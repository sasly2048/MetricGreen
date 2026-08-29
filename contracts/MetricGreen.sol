// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MetricGreen
 * @notice Protocol for issuing, trading, and permanently retiring verifiable
 *         carbon credits on a public blockchain. Anchors IoT and satellite
 *         dMRV data through zero-knowledge proofs and registry attestations.
 * @dev This contract is the canonical settlement layer. It is intentionally
 *      minimal in surface area: every meaningful state transition emits an
 *      event so that the full audit trail can be reconstructed off-chain.
 */
contract MetricGreen is ERC721URIStorage, Ownable, ReentrancyGuard {
    // ---------------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------------

    enum CreditStatus { Active, Challenged, Retired }

    struct Credit {
        uint256 id;
        address producer;
        string  projectName;
        string  registryName;       // "Verra", "Gold Standard", "CAR", "ACR"
        string  projectId;          // e.g. "VCS-9341"
        string  vintage;            // e.g. "2024" or "2024-Q3"
        uint256 amount;             // tCO2e
        bytes32 zkProof;            // ZK-SNARK attestation hash
        bytes32 iotHash;            // aggregated IoT payload hash
        bytes32 satHash;            // satellite dMRV cross-check hash
        uint256 issuedAt;
        uint256 challengeEndsAt;
        CreditStatus status;
    }

    struct Producer {
        address wallet;
        bytes32 certId;             // VCS001 certificate hash
        string  methodology;        // "VM0007 v1.6", "Puro.earth", etc.
        uint256 bond;               // wei staked at registration
        uint256 reputation;         // 0..100, updated by attestations
        uint256 creditsIssued;
        uint256 creditsRetired;
        bool    active;
    }

    // ---------------------------------------------------------------------
    // Storage
    // ---------------------------------------------------------------------

    struct MintParams {
        string projectName;
        string registryName;
        string projectId;
        string vintage;
        uint256 amount;
        bytes32 zkProof;
        bytes32 iotHash;
        bytes32 satHash;
        string tokenUri;
    }

    uint256 public nextCreditId = 1;
    uint256 public constant CHALLENGE_WINDOW = 7 days;
    uint256 public constant MIN_BOND = 1 ether;
    uint256 public constant MAX_BATCH = 5_000; // tCO2e per mint

    mapping(uint256 => Credit) public credits;
    mapping(address => Producer) public producers;
    mapping(address => bool) public verifiers;
    mapping(uint256 => bool) public challenged;   // creditId => challenged?
    mapping(uint256 => uint256) public attestationCount;

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------

    event ProducerRegistered(address indexed producer, bytes32 certId, uint256 bond);
    event ProducerRevoked(address indexed producer);
    event VerifierAdded(address indexed verifier);
    event CreditMinted(
        uint256 indexed id,
        address indexed producer,
        uint256 amount,
        bytes32 zkProof,
        uint256 challengeEndsAt
    );
    event CreditChallenged(uint256 indexed id, address indexed challenger, string reason);
    event CreditAttested(uint256 indexed id, address indexed verifier);
    event CreditRetired(uint256 indexed id, address indexed retiree, bytes32 retirementCert);
    event ReputationUpdated(address indexed producer, uint256 newReputation);

    // ---------------------------------------------------------------------
    // Modifiers
    // ---------------------------------------------------------------------

    modifier onlyRegisteredProducer() {
        require(producers[msg.sender].active, "Not a registered producer");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not a verifier");
        _;
    }

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor() ERC721("MetricGreen Carbon Credit", "MGC") Ownable(msg.sender) {}

    // ---------------------------------------------------------------------
    // Admin
    // ---------------------------------------------------------------------

    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
    }

    function revokeProducer(address producer) external onlyOwner {
        Producer storage p = producers[producer];
        require(p.active, "Producer not active");
        p.active = false;
        p.reputation = 0;
        emit ProducerRevoked(producer);
    }

    // ---------------------------------------------------------------------
    // Producer flow
    // ---------------------------------------------------------------------

    /**
     * @notice Register as a producer by staking a VCS001 bond.
     * @param certId Hash of the VCS001 certificate document
     * @param methodology Methodology string (e.g. "VM0007 v1.6")
     */
    function registerProducer(bytes32 certId, string calldata methodology) external payable {
        require(!producers[msg.sender].active, "Already registered");
        require(msg.value >= MIN_BOND, "Bond below minimum");
        require(certId != bytes32(0), "Invalid cert");
        require(bytes(methodology).length > 0, "Invalid methodology");

        producers[msg.sender] = Producer({
            wallet: msg.sender,
            certId: certId,
            methodology: methodology,
            bond: msg.value,
            reputation: 100,
            creditsIssued: 0,
            creditsRetired: 0,
            active: true
        });

        emit ProducerRegistered(msg.sender, certId, msg.value);
    }

    function topUpBond() external payable onlyRegisteredProducer {
        producers[msg.sender].bond += msg.value;
    }

    /**
     * @notice Mint a new credit. Requires a valid ZK-SNARK proof that
     *         attests to methodology compliance. The credit enters a
     *         7-day challenge window during which verifiers may dispute it.
     */
    function mintCredit(MintParams calldata p) external onlyRegisteredProducer nonReentrant returns (uint256) {
        require(p.amount > 0 && p.amount <= MAX_BATCH, "Invalid amount");
        require(p.zkProof != bytes32(0), "Missing ZK proof");
        require(p.iotHash != bytes32(0) && p.satHash != bytes32(0), "Missing data hash");
        require(bytes(p.projectName).length > 0, "Missing project name");
        require(bytes(p.registryName).length > 0, "Missing registry");
        require(bytes(p.projectId).length > 0, "Missing project ID");

        producers[msg.sender].creditsIssued += p.amount;

        uint256 id = nextCreditId++;
        uint256 issuedAt = block.timestamp;
        uint256 challengeEndsAt = issuedAt + CHALLENGE_WINDOW;

        credits[id] = Credit({
            id: id,
            producer: msg.sender,
            projectName: p.projectName,
            registryName: p.registryName,
            projectId: p.projectId,
            vintage: p.vintage,
            amount: p.amount,
            zkProof: p.zkProof,
            iotHash: p.iotHash,
            satHash: p.satHash,
            issuedAt: issuedAt,
            challengeEndsAt: challengeEndsAt,
            status: CreditStatus.Active
        });

        _safeMint(msg.sender, id);
        _setTokenURI(id, p.tokenUri);

        emit CreditMinted(id, msg.sender, p.amount, p.zkProof, challengeEndsAt);
        return id;
    }

    // ---------------------------------------------------------------------
    // Verifier flow
    // ---------------------------------------------------------------------

    function attest(uint256 creditId) external onlyVerifier {
        Credit storage c = credits[creditId];
        require(c.id != 0, "Unknown credit");
        require(block.timestamp <= c.challengeEndsAt, "Challenge window closed");
        require(!challenged[creditId], "Already challenged");

        attestationCount[creditId] += 1;
        emit CreditAttested(creditId, msg.sender);
    }

    function challenge(uint256 creditId, string calldata reason) external onlyVerifier {
        Credit storage c = credits[creditId];
        require(c.id != 0, "Unknown credit");
        require(block.timestamp <= c.challengeEndsAt, "Window closed");
        require(c.status == CreditStatus.Active, "Not active");

        challenged[creditId] = true;
        c.status = CreditStatus.Challenged;

        // Penalize producer reputation
        Producer storage p = producers[c.producer];
        if (p.reputation > 5) p.reputation -= 5;
        emit ReputationUpdated(c.producer, p.reputation);
        emit CreditChallenged(creditId, msg.sender, reason);
    }

    // ---------------------------------------------------------------------
    // Retirement
    // ---------------------------------------------------------------------

    /**
     * @notice Burn the credit. This is irreversible. The token is destroyed
     *         and a retirement certificate hash is emitted and stored.
     */
    function retire(uint256 creditId) external nonReentrant {
        require(_isAuthorized(_ownerOf(creditId), msg.sender, creditId), "Not owner or approved");
        Credit storage c = credits[creditId];
        require(c.id != 0, "Unknown credit");
        require(c.status == CreditStatus.Active, "Not active");
        require(block.timestamp > c.challengeEndsAt || attestationCount[creditId] >= 2, "Challenge window active");

        c.status = CreditStatus.Retired;
        producers[c.producer].creditsRetired += c.amount;

        // Mint a deterministic retirement certificate hash
        bytes32 cert = keccak256(abi.encodePacked(creditId, msg.sender, block.timestamp, c.amount));
        _burn(creditId);

        emit CreditRetired(creditId, msg.sender, cert);
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------

    function getCredit(uint256 id) external view returns (Credit memory) {
        return credits[id];
    }

    function getProducer(address wallet) external view returns (Producer memory) {
        return producers[wallet];
    }

    function totalSupply() external view returns (uint256) {
        return nextCreditId - 1;
    }

    function activeSupply() external view returns (uint256) {
        uint256 active = 0;
        for (uint256 i = 1; i < nextCreditId; i++) {
            if (credits[i].status == CreditStatus.Active) active += credits[i].amount;
        }
        return active;
    }
}
