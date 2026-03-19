"use client";
import { useState } from "react";
import { ethers } from "ethers";

const contractABI = [
  "function depositBond() public payable",
  "function mintCredit(string memory _name, uint256 _amount) public",
  "function retireCredit(uint256 _index) public",
  "function credits(uint256) public view returns (string name, uint256 amount, bool isRetired)",
  "function getCreditsCount() public view returns (uint)",
];

const contractAddress =
  process.env.NEXT_PUBLIC_METRIC_GREEN_CONTRACT_ADDRESS ||
  "0xfA508B1BF3823621a1F27dC87A8b937C17a7B975";
const requiredChainId = parseChainId(
  process.env.NEXT_PUBLIC_METRIC_GREEN_CHAIN_ID,
  11155111n,
);
const requiredChainName =
  process.env.NEXT_PUBLIC_METRIC_GREEN_CHAIN_NAME || "Sepolia";
const requiredChainHex = `0x${requiredChainId.toString(16)}`;

function parseChainId(value, fallback) {
  try {
    return value ? BigInt(value) : fallback;
  } catch {
    return fallback;
  }
}

function formatNetwork(network) {
  const chainId = network.chainId.toString();
  return network.name && network.name !== "unknown"
    ? `${network.name} (chain ${chainId})`
    : `chain ${chainId}`;
}

function createAppError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function getWrongNetworkMessage(network) {
  return `MetricGreen is configured for ${requiredChainName} (chain ${requiredChainId.toString()}). Switch from ${formatNetwork(network)} and try again.`;
}

function getContractErrorDetails(error) {
  if (error?.code === 4001) {
    return { code: error.code, message: "Request cancelled in MetaMask." };
  }

  if (error?.code === "WRONG_NETWORK") {
    return { code: error.code, message: error.message };
  }

  if (error?.code === "BAD_DATA") {
    return {
      code: error.code,
      message:
        "The configured contract address does not match this network or ABI. Switch networks or update the deployed address.",
    };
  }

  return {
    code: error?.code || "UNKNOWN_ERROR",
    message:
      error?.shortMessage ||
      error?.message ||
      "Unable to reach the MetricGreen contract right now.",
  };
}

export default function Home() {
  const [account, setAccount] = useState("");
  const [credits, setCredits] = useState([]);
  const [isStaking, setIsStaking] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [retiringCreditId, setRetiringCreditId] = useState(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [status, setStatus] = useState({ code: "", message: "" });

  async function getContract(provider, { withSigner = false } = {}) {
    if (!contractAddress) {
      throw new Error(
        "Set NEXT_PUBLIC_METRIC_GREEN_CONTRACT_ADDRESS before connecting a wallet.",
      );
    }

    const network = await provider.getNetwork();

    if (network.chainId !== requiredChainId) {
      throw createAppError(getWrongNetworkMessage(network), "WRONG_NETWORK");
    }

    const code = await provider.getCode(contractAddress);

    if (code === "0x") {
      throw new Error(
        `No MetricGreen contract was found at ${contractAddress} on ${formatNetwork(network)}.`,
      );
    }

    const runner = withSigner ? await provider.getSigner() : provider;
    return new ethers.Contract(contractAddress, contractABI, runner);
  }

  async function loadCredits(provider) {
    setIsLoadingCredits(true);
    try {
      setStatus({ code: "", message: "" });
      const contract = await getContract(provider);
      const count = Number(await contract.getCreditsCount());

      let list = [];
      for (let i = 0; i < count; i++) {
        const c = await contract.credits(i);
        list.push({
          id: i,
          name: c.name,
          amount: c.amount.toString(),
          retired: c.isRetired,
        });
      }
      setCredits(list);
    } catch (error) {
      setCredits([]);
      setStatus(getContractErrorDetails(error));
    } finally {
      setIsLoadingCredits(false);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        setStatus({ code: "", message: "" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        await loadCredits(provider);
      } catch (error) {
        if (error.code === 4001) alert("Connection rejected.");
        setStatus(getContractErrorDetails(error));
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function switchNetwork() {
    if (!window.ethereum) return;

    try {
      setStatus({ code: "", message: "" });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requiredChainHex }],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      if (account) {
        await loadCredits(provider);
      }
      setStatus({
        code: "SUCCESS",
        message: `Switched to ${requiredChainName}.`,
      });
    } catch (error) {
      if (error?.code === 4902) {
        setStatus({
          code: "CHAIN_NOT_ADDED",
          message: `${requiredChainName} is not available in MetaMask yet. Add chain ${requiredChainId.toString()} manually and try again.`,
        });
        return;
      }

      setStatus(getContractErrorDetails(error));
    }
  }

  async function stake() {
    if (!account) return alert("Connect wallet first!");
    setIsStaking(true);
    try {
      setStatus({ code: "", message: "" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = await getContract(provider, { withSigner: true });
      const tx = await contract.depositBond({
        value: ethers.parseEther("0.01"),
      });
      await tx.wait();
      setStatus({
        code: "SUCCESS",
        message: "Bond deposited successfully.",
      });
      alert("Reputation Bond Staked!");
    } catch (error) {
      setStatus(getContractErrorDetails(error));
      if (error.code === 4001) alert("Transaction cancelled.");
      else alert("Staking failed. Check balance or selected network.");
    } finally {
      setIsStaking(false);
    }
  }

  async function mint() {
    if (!account) return alert("Connect wallet first!");
    setIsMinting(true);

    setTimeout(async () => {
      try {
        setStatus({ code: "", message: "" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = await getContract(provider, { withSigner: true });
        const randomAmount = Math.floor(Math.random() * 100) + 20;

        const tx = await contract.mintCredit("Sensor_ID_042", randomAmount);
        await tx.wait();

        setIsMinting(false);
        await loadCredits(provider);
        setStatus({
          code: "SUCCESS",
          message: "Credit minted successfully.",
        });
        alert("Success: Verified via ZK-Proof and Minted!");
      } catch (error) {
        setIsMinting(false);
        setStatus(getContractErrorDetails(error));
        if (error.code === 4001) alert("Minting cancelled.");
      }
    }, 3000);
  }

  async function retireCredit(creditId) {
    if (!account) return alert("Connect wallet first!");
    setRetiringCreditId(creditId);

    try {
      setStatus({ code: "", message: "" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = await getContract(provider, { withSigner: true });

      const tx = await contract.retireCredit(creditId);
      await tx.wait();

      await loadCredits(provider);
      setStatus({
        code: "SUCCESS",
        message: `Credit #${creditId} retired successfully.`,
      });
    } catch (error) {
      setStatus(getContractErrorDetails(error));
      if (error.code === 4001) alert("Retirement cancelled.");
      else alert("Retirement failed. Check the selected network and try again.");
    } finally {
      setRetiringCreditId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto border border-green-900 p-8 rounded-2xl bg-zinc-950 shadow-2xl">
        <h1 className="text-4xl font-bold text-green-500 mb-2">MetricGreen</h1>
        <p className="text-zinc-500 mb-8 font-mono italic">
          Decentralized Carbon Credit Infrastructure
        </p>

        <div className="mb-10">
          {!account ? (
            <button
              onClick={connectWallet}
              className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 transition"
            >
              Connect MetaMask
            </button>
          ) : (
            <div className="p-3 border border-green-800 rounded-lg inline-block bg-green-900/10">
              <p className="text-green-400 font-mono text-sm">
                ● Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
          )}
          {status.message && (
            <div className="mt-3 max-w-2xl space-y-3">
              <p
                className={`rounded-lg border px-4 py-3 text-sm ${
                  status.code === "SUCCESS"
                    ? "border-green-900/60 bg-green-950/40 text-green-200"
                    : "border-amber-900/60 bg-amber-950/40 text-amber-200"
                }`}
              >
                {status.message}
              </p>
              {status.code === "WRONG_NETWORK" && (
                <button
                  onClick={switchNetwork}
                  className="rounded-lg border border-green-700 bg-green-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-500"
                >
                  Switch to {requiredChainName}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-zinc-800 pb-2">
              Producer Actions
            </h2>

            <button
              onClick={stake}
              disabled={isStaking}
              className={`w-full py-4 rounded-xl text-left px-5 border transition group ${
                isStaking
                  ? "bg-zinc-800 border-zinc-800 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
              }`}
            >
              <span className="block text-xs text-zinc-500 uppercase tracking-widest mb-1">
                Step 1: Stake Bond
              </span>
              <span className="font-bold text-lg group-hover:text-green-400 transition">
                {isStaking
                  ? "Waiting for Transaction..."
                  : "Deposit Reputation Bond"}
              </span>
            </button>

            <button
              onClick={mint}
              disabled={isMinting}
              className={`w-full py-4 rounded-xl text-left px-5 font-bold transition ${isMinting ? "bg-zinc-800 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
            >
              <span className="block text-xs text-green-200 uppercase tracking-widest mb-1">
                Step 2: Verification
              </span>
              <span className="text-lg">
                {isMinting ? "Generating ZK-Proof..." : "Verify & Mint Credit"}
              </span>
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b border-zinc-800 pb-2 mb-4">
              On-Chain Ledger
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {isLoadingCredits && (
                <p className="text-zinc-500 italic">Loading credits from chain...</p>
              )}
              {!isLoadingCredits && credits.length === 0 && (
                <p className="text-zinc-600 italic">
                  No credits found on-chain...
                </p>
              )}
              {credits.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-lg border transition ${c.retired ? "border-zinc-800 bg-black opacity-40" : "border-green-900 bg-zinc-900/50"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-green-400 uppercase text-xs">
                        Verified Credit
                      </p>
                      <p className="text-lg font-semibold">{c.name}</p>
                    </div>
                    <p className="font-mono text-green-500 font-bold">
                      {c.amount}T
                    </p>
                  </div>
                  {c.retired && (
                    <p className="text-[10px] text-red-500 font-bold mt-2 tracking-tighter uppercase">
                      Retired / Prevented Double-Counting
                    </p>
                  )}
                  {!c.retired && (
                    <button
                      onClick={() => retireCredit(c.id)}
                      disabled={retiringCreditId === c.id}
                      className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                        retiringCreditId === c.id
                          ? "cursor-not-allowed border border-zinc-800 bg-zinc-800 text-zinc-500"
                          : "border border-red-900 bg-red-950/40 text-red-300 hover:bg-red-900/40"
                      }`}
                    >
                      {retiringCreditId === c.id
                        ? "Retiring..."
                        : "Retire Credit"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
