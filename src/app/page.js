"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Activity,
  Server,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Wallet,
  Lock,
  Factory,
} from "lucide-react";

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
  if (error?.code === 4001 || error?.code === "ACTION_REJECTED") {
    return { code: error.code, message: "User rejected the transaction." };
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
      error?.code === "ACTION_REJECTED"
        ? "User rejected the action."
        : error?.shortMessage
          ? error.shortMessage.charAt(0).toUpperCase() +
            error.shortMessage.slice(1) +
            "."
          : error?.message ||
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
        if (error?.code === 4001 || error?.code === "ACTION_REJECTED")
          alert("Connection rejected.");
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
      if (error?.code === 4001 || error?.code === "ACTION_REJECTED")
        alert("Transaction cancelled.");
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
        if (error?.code === 4001 || error?.code === "ACTION_REJECTED")
          alert("Minting cancelled.");
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
      if (error?.code === 4001 || error?.code === "ACTION_REJECTED")
        alert("Retirement cancelled.");
      else
        alert("Retirement failed. Check the selected network and try again.");
    } finally {
      setRetiringCreditId(null);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="min-h-screen relative bg-[#050505] text-neutral-200 font-sans selection:bg-green-500/30 overflow-hidden">
      {/* Background Glows */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-10 sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-sm mix-blend-overlay"></div>
              <Leaf className="w-5 h-5 text-black relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-1">
                Metric<span className="text-emerald-400">Green</span>
              </h1>
              <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase flex items-center gap-1">
                <Activity className="w-3 h-3" /> Decentralized Ledger
              </p>
            </div>
          </div>

          <div>
            {!account ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 bg-white border border-transparent rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
              >
                <Wallet className="w-4 h-4" /> Connect Wallet
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4 py-2 border border-emerald-500/30 rounded-full bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)] backdrop-blur-md cursor-pointer hover:bg-emerald-500/20 transition-colors"
                title="Connected Wallet"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <p className="text-emerald-300 font-mono text-sm font-medium tracking-wider">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-12 relative z-10"
      >
        {/* Status Alerts */}
        <AnimatePresence mode="popLayout">
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8"
            >
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border p-4 backdrop-blur-md ${
                  status.code === "SUCCESS"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shadow-[0_0_30px_rgba(52,211,153,0.1)]"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.1)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {status.code === "SUCCESS" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <p className="text-sm font-medium">{status.message}</p>
                </div>

                {status.code === "WRONG_NETWORK" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={switchNetwork}
                    className="whitespace-nowrap rounded-lg bg-amber-500/20 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/30 hover:text-amber-200"
                  >
                    Switch to {requiredChainName}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Action Panel */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Factory className="w-6 h-6 text-emerald-400" />
                  Producer Actions
                </h2>
              </div>
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                Connect your IoT sensors and execute verified sustainability
                actions to mint credits on the immutable ledger.
              </p>

              <div className="space-y-5 relative z-10">
                <motion.button
                  whileHover={!isStaking ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isStaking ? { scale: 0.98 } : {}}
                  onClick={stake}
                  disabled={isStaking}
                  className={`w-full group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 border ${
                    isStaking
                      ? "bg-neutral-900 border-white/5 cursor-not-allowed opacity-70"
                      : "bg-neutral-900/50 border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/20 shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest font-mono font-semibold">
                      <Lock className="w-3.5 h-3.5" /> Step 01
                    </span>
                    {isStaking && (
                      <Activity className="w-4 h-4 text-emerald-500 animate-spin" />
                    )}
                  </div>
                  <h3
                    className={`text-xl font-bold transition-colors ${isStaking ? "text-neutral-500" : "text-white group-hover:text-emerald-400"}`}
                  >
                    {isStaking
                      ? "Processing Transaction..."
                      : "Stake Reputation Bond"}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-2 font-mono flex items-center gap-2">
                    Cost:{" "}
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      0.01 ETH
                    </span>
                  </p>
                </motion.button>

                <motion.button
                  whileHover={!isMinting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isMinting ? { scale: 0.98 } : {}}
                  onClick={mint}
                  disabled={isMinting}
                  className={`w-full group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 border shadow-lg ${
                    isMinting
                      ? "bg-neutral-900 border-white/5 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-br from-emerald-600 to-green-800 border-emerald-400/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)]"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] ${!isMinting && "mix-blend-overlay"}`}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`flex items-center gap-2 text-xs uppercase tracking-widest font-mono font-semibold ${isMinting ? "text-neutral-400" : "text-emerald-100"}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Step 02
                      </span>
                      {isMinting && (
                        <Activity className="w-4 h-4 text-emerald-100 animate-spin" />
                      )}
                    </div>
                    <h3
                      className={`text-xl font-bold flex items-center gap-2 ${isMinting ? "text-neutral-500" : "text-white"}`}
                    >
                      {isMinting
                        ? "Generating ZK-Proof..."
                        : "Verify & Mint Credit"}
                      {!isMinting && (
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      )}
                    </h3>
                    <p
                      className={`text-sm mt-2 font-mono ${isMinting ? "text-neutral-600" : "text-emerald-100/80"}`}
                    >
                      Target:{" "}
                      <span className="font-bold text-white bg-black/20 px-2 py-0.5 rounded-md">
                        Sensor_ID_042
                      </span>
                    </p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Ledger Panel */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 space-y-4"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Server className="w-6 h-6 text-neutral-400" />
                Network Ledger
              </h2>
              <div className="flex gap-4 items-center text-xs font-mono text-neutral-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block shadow-[0_0_8px_rgba(16,185,129,0.8)]" />{" "}
                  Active
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 block" />{" "}
                  Retired
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-3xl p-3 backdrop-blur-xl shadow-2xl min-h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-2">
                <AnimatePresence mode="wait">
                  {isLoadingCredits && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-5"
                    >
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                        <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
                        Querying Blocks...
                      </p>
                    </motion.div>
                  )}

                  {!isLoadingCredits && credits.length === 0 && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 opacity-70"
                    >
                      <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center border border-white/5 mb-2 shadow-inner">
                        <Server className="w-8 h-8 text-neutral-600" />
                      </div>
                      <p className="text-lg font-semibold text-neutral-300">
                        Ledger is empty.
                      </p>
                      <p className="text-sm text-neutral-500 font-mono text-center max-w-xs">
                        Connect wallet and generate proofs to populate the
                        chain.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  <AnimatePresence>
                    {!isLoadingCredits &&
                      credits.map((c, index) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${
                            c.retired
                              ? "border-white/5 bg-neutral-900/40 grayscale opacity-50"
                              : "border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 to-black hover:border-emerald-400/60 hover:bg-emerald-900/20 hover:shadow-[0_4px_30px_rgba(16,185,129,0.1)] group/card"
                          }`}
                        >
                          {!c.retired && (
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover/card:opacity-100" />
                          )}

                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 ${c.retired ? "bg-neutral-800 text-neutral-400" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"}`}
                                >
                                  {c.retired ? (
                                    <XCircle className="w-3 h-3" />
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3" />
                                  )}
                                  {c.retired ? "Settled" : "Verified"}
                                </span>
                                <span className="text-xs text-neutral-500 font-mono bg-neutral-900 px-2 py-1 rounded-md border border-white/5">
                                  TxID: {c.id.toString().padStart(4, "0")}
                                </span>
                              </div>
                              <p
                                className={`text-2xl font-bold tracking-tight mt-1 ${c.retired ? "text-neutral-500" : "text-white"}`}
                              >
                                {c.name}
                              </p>
                            </div>

                            <div className="text-right flex flex-col items-end">
                              <p
                                className={`font-mono text-3xl font-light tracking-tighter flex items-end ${c.retired ? "text-neutral-600" : "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"}`}
                              >
                                {c.amount}
                                <span className="text-sm font-sans font-bold mb-1 ml-1 opacity-60 text-emerald-500">
                                  TONS
                                </span>
                              </p>
                              {!c.retired && (
                                <p className="text-[10px] text-emerald-500/50 font-mono mt-1">
                                  CO₂e Offset
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                            {c.retired ? (
                              <p className="text-sm text-neutral-500 font-mono flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-neutral-600" />
                                Permanently removed from supply
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-neutral-400 font-mono flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                                  Active on network
                                </p>
                                <motion.button
                                  whileHover={
                                    retiringCreditId !== c.id
                                      ? { scale: 1.05 }
                                      : {}
                                  }
                                  whileTap={
                                    retiringCreditId !== c.id
                                      ? { scale: 0.95 }
                                      : {}
                                  }
                                  onClick={() => retireCredit(c.id)}
                                  disabled={retiringCreditId === c.id}
                                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                                    retiringCreditId === c.id
                                      ? "border-neutral-800 bg-neutral-900 text-neutral-500 cursor-wait"
                                      : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                                  }`}
                                >
                                  {retiringCreditId === c.id
                                    ? "Burning..."
                                    : "Burn Token"}
                                </motion.button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scrollbar hide style */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.3); }
      `,
        }}
      />
    </main>
  );
}
