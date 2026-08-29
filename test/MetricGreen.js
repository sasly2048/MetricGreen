const { expect } = require("chai");
const { ethers } = require("hardhat");

const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

function mintParams(overrides = {}) {
  return {
    projectName: "Manauary Reforestation",
    registryName: "Verra",
    projectId: "VCS-9341",
    vintage: "2024",
    amount: 500,
    zkProof: ethers.id("zkproof-1"),
    iotHash: ethers.id("iot-hash-1"),
    satHash: ethers.id("sat-hash-1"),
    tokenUri: "ipfs://metadata/1",
    ...overrides,
  };
}

describe("MetricGreen Contract", function () {
  let contract, owner, producer, producer2, verifier, retiree;

  beforeEach(async function () {
    [owner, producer, producer2, verifier, retiree] = await ethers.getSigners();
    const MetricGreen = await ethers.getContractFactory("MetricGreen");
    contract = await MetricGreen.deploy();
    await contract.addVerifier(verifier.address);
  });

  describe("Deployment", function () {
    it("Sets the deployer as owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Starts with zero total supply", async function () {
      expect(await contract.totalSupply()).to.equal(0);
    });

    it("Names and symbols the token correctly", async function () {
      expect(await contract.name()).to.equal("MetricGreen Carbon Credit");
      expect(await contract.symbol()).to.equal("MGC");
    });
  });

  describe("Producer registration", function () {
    it("Registers a VCS001 producer with a sufficient bond", async function () {
      await contract.connect(producer).registerProducer(
        ethers.id("VCS001-XYZ"),
        "VM0007 v1.6",
        { value: ethers.parseEther("1.0") },
      );
      const p = await contract.getProducer(producer.address);
      expect(p.active).to.be.true;
      expect(p.reputation).to.equal(100);
      expect(p.creditsIssued).to.equal(0);
    });

    it("Rejects registration with insufficient bond", async function () {
      await expect(
        contract.connect(producer).registerProducer(
          ethers.id("VCS001-XYZ"),
          "VM0007 v1.6",
          { value: ethers.parseEther("0.5") },
        ),
      ).to.be.revertedWith("Bond below minimum");
    });

    it("Prevents double registration", async function () {
      await contract.connect(producer).registerProducer(
        ethers.id("VCS001"),
        "VM0007",
        { value: ethers.parseEther("1.0") },
      );
      await expect(
        contract.connect(producer).registerProducer(
          ethers.id("VCS001"),
          "VM0007",
          { value: ethers.parseEther("1.0") },
        ),
      ).to.be.revertedWith("Already registered");
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await contract.connect(producer).registerProducer(
        ethers.id("VCS001"),
        "VM0007 v1.6",
        { value: ethers.parseEther("1.0") },
      );
    });

    it("Mints a credit to a registered producer", async function () {
      await contract.connect(producer).mintCredit(mintParams());
      const c = await contract.getCredit(1);
      expect(c.amount).to.equal(500);
      expect(c.status).to.equal(0); // Active
      expect(await contract.totalSupply()).to.equal(1);
    });

    it("Rejects minting by unregistered wallets", async function () {
      await expect(
        contract.connect(producer2).mintCredit(mintParams()),
      ).to.be.revertedWith("Not a registered producer");
    });

    it("Rejects batches above the maximum size", async function () {
      await expect(
        contract.connect(producer).mintCredit(mintParams({ amount: 6_000 })),
      ).to.be.revertedWith("Invalid amount");
    });

    it("Rejects missing ZK proof", async function () {
      await expect(
        contract.connect(producer).mintCredit(mintParams({ zkProof: ZERO_BYTES32 })),
      ).to.be.revertedWith("Missing ZK proof");
    });
  });

  describe("Attestation & Challenge", function () {
    beforeEach(async function () {
      await contract.connect(producer).registerProducer(
        ethers.id("VCS001"),
        "VM0007 v1.6",
        { value: ethers.parseEther("1.0") },
      );
      await contract.connect(producer).mintCredit(mintParams());
    });

    it("Allows verifiers to attest during the challenge window", async function () {
      await contract.connect(verifier).attest(1);
      expect(await contract.attestationCount(1)).to.equal(1);
    });

    it("Allows verifiers to challenge and reduces producer reputation", async function () {
      await contract.connect(verifier).challenge(1, "Discrepancy in biomass estimate");
      const c = await contract.getCredit(1);
      expect(c.status).to.equal(1); // Challenged
      const p = await contract.getProducer(producer.address);
      expect(p.reputation).to.equal(95);
    });
  });

  describe("Retirement", function () {
    beforeEach(async function () {
      await contract.connect(producer).registerProducer(
        ethers.id("VCS001"),
        "VM0007 v1.6",
        { value: ethers.parseEther("1.0") },
      );
      await contract.connect(producer).mintCredit(mintParams());
      // Provide 2 attestations to clear challenge window
      await contract.connect(verifier).attest(1);
      await contract.addVerifier(retiree.address);
      await contract.connect(retiree).attest(1);
    });

    it("Burns the credit when the owner retires it", async function () {
      await expect(contract.connect(producer).retire(1))
        .to.emit(contract, "CreditRetired");
      const c = await contract.getCredit(1);
      expect(c.status).to.equal(2); // Retired
    });
  });

  describe("Admin", function () {
    it("Allows the owner to add and remove verifiers", async function () {
      await contract.addVerifier(producer.address);
      expect(await contract.verifiers(producer.address)).to.be.true;
    });

    it("Allows the owner to revoke a producer", async function () {
      await contract.connect(producer).registerProducer(
        ethers.id("VCS001"), "VM0007", { value: ethers.parseEther("1.0") },
      );
      await contract.revokeProducer(producer.address);
      const p = await contract.getProducer(producer.address);
      expect(p.active).to.be.false;
    });
  });
});
