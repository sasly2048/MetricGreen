"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ShieldCheck, Loader2, Check, Flame, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfettiBurst, SuccessRing, AnimatedCheck, PulseDot } from "@/components/ui/MicroInteractions";
import { sfx } from "@/lib/sfx";
import { formatNumber, formatCurrency, shortenAddress, shortenTx } from "@/lib/utils";
import { toast } from "sonner";
import { useHoldings } from "@/lib/demo-state";

export function PurchaseDialog({ target, onClose }) {
  const [stage, setStage] = useState("review");
  const [autoRetire, setAutoRetire] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [confettiKey, setConfettiKey] = useState(0);
  const [purchasedAmount, setPurchasedAmount] = useState(0);
  const [purchasedTx, setPurchasedTx] = useState("");
  const [blockNumber, setBlockNumber] = useState(0);
  const [certId, setCertId] = useState("");
  const { hold, retire } = useHoldings();

  useEffect(() => {
    if (!target) return;
    const reset = setTimeout(() => {
      setStage("review");
      setAmount("");
      setAutoRetire(true);
      setError("");
      setPurchasedAmount(0);
    }, 0);
    return () => clearTimeout(reset);
  }, [target]);

  if (!target) return null;
  const { listing, project } = target;

  const usedAmount = (() => {
    const n = parseInt(amount, 10);
    if (!n) return listing.amount;
    return Math.max(1, Math.min(n, listing.amount));
  })();
  const total = usedAmount * listing.pricePerTonne;

  const validate = () => {
    const n = parseInt(amount || listing.amount, 10);
    if (!n || n < 1) return "Enter a valid amount";
    if (n > listing.amount) return `Only ${listing.amount} tCO₂e available`;
    return null;
  };

  const onPurchase = async () => {
    const err = validate();
    if (err) {
      setError(err);
      sfx.error();
      toast.error(err);
      return;
    }
    setError("");
    const amt = usedAmount;
    setPurchasedAmount(amt);

    sfx.step();
    setStage("approve");
    await new Promise((r) => setTimeout(r, 700));
    sfx.step();
    setStage("swap");
    await new Promise((r) => setTimeout(r, 1100));
    setStage(autoRetire ? "retire" : "settle");
    await new Promise((r) => setTimeout(r, 1000));

    const id = "crd_purchased_" + Date.now().toString(36);
    hold(id);
    if (autoRetire) retire(id);

    const tx = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setPurchasedTx(tx);
    setCertId("0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
    let bn = 0;
    for (let i = 0; i < tx.length; i++) bn = (bn * 31 + tx.charCodeAt(i)) >>> 0;
    setBlockNumber(5000000 + (bn % 9000000));

    sfx.purchase();
    setConfettiKey((k) => k + 1);
    setStage("done");
    toast.success(
      autoRetire
        ? `Retired ${amt} tCO₂e from ${project.name}`
        : `Acquired ${amt} tCO₂e from ${project.name}`,
    );
  };

  const close = () => onClose();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-md sm:items-center sm:p-4"
        onClick={close}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg overflow-hidden rounded-t-2xl border border-white/10 bg-[#0a1020] shadow-2xl shadow-black/60 sm:rounded-2xl"
        >
          <ConfettiBurst trigger={confettiKey} />
          <div className="flex items-center justify-between border-b border-white/5 p-5">
            <div className="min-w-0">
              <p className="font-mono text-[9.5px] uppercase tracking-widest text-emerald-300 leading-none">
                {stage === "done" ? "Complete" : "Purchase"}
              </p>
              <h2 className="mt-1.5 truncate font-display text-[17px] font-semibold leading-tight tracking-tight text-white">
                {project.name}
              </h2>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-400">{listing.registry} · {project.projectId}</p>
            </div>
            <button onClick={close} aria-label="Close" className="rounded-md p-1.5 text-[20px] leading-none text-ink-300 transition hover:bg-white/5 hover:text-white">
              ×
            </button>
          </div>

          <div className="min-h-[320px] p-5">
            <AnimatePresence mode="wait">
              {stage === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-[13px]">
                    <Row k="Available" v={`${formatNumber(listing.amount)} tCO₂e`} />
                    <Row k="Price" v={`${formatCurrency(listing.pricePerTonne)} / tCO₂e`} />
                    <Row k="Vintage" v={listing.vintage} />
                    <Row k="Seller" v={shortenAddress(listing.seller, 5)} mono />
                    <div className="mt-3 border-t border-white/[0.05] pt-3">
                      <Row k="Total" v={formatCurrency(total)} emphasis />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400 leading-none">Amount (tCO₂e)</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={listing.amount}
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder={`Max: ${formatNumber(listing.amount)}`}
                        className="h-9 w-full rounded-md border border-white/[0.07] bg-white/[0.02] px-3 text-[13px] leading-tight text-white focus:border-emerald-500/40 focus:outline-none"
                      />
                      <button
                        onClick={() => setAmount(String(listing.amount))}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[11.5px] font-medium leading-none text-ink-200 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        Max
                      </button>
                    </div>
                    {error && <p className="mt-1 text-[11px] leading-tight text-rose-400">{error}</p>}
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-[13px]">
                    <input
                      type="checkbox"
                      checked={autoRetire}
                      onChange={(e) => {
                        setAutoRetire(e.target.checked);
                        sfx.tick();
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-emerald-500/40 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500/50"
                    />
                    <div>
                      <p className="flex items-center gap-1.5 font-medium leading-tight text-white">
                        <Flame className="h-3.5 w-3.5 text-rose-300" />
                        Retire immediately on purchase
                      </p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">Skip holding. Burn the credit and receive a retirement certificate.</p>
                    </div>
                  </label>
                </motion.div>
              )}

              {stage === "approve" && (
                <ProcessStage
                  key="approve"
                  icon={ShieldCheck}
                  label="Approving USDC spend"
                  detail="Allowing marketplace contract to move funds…"
                />
              )}

              {stage === "swap" && (
                <ProcessStage
                  key="swap"
                  icon={Sparkles}
                  label="Settling trade on-chain"
                  detail={`Matching best execution across ${listing.amount} tCO₂e…`}
                />
              )}

              {stage === "retire" && (
                <ProcessStage
                  key="retire"
                  icon={Flame}
                  label="Burning credit (permanent retirement)"
                  detail="Computing retirement certificate hash…"
                />
              )}

              {stage === "settle" && (
                <ProcessStage
                  key="settle"
                  icon={ShieldCheck}
                  label="Transferring credit to your wallet"
                  detail="Credit is now in your holdings…"
                />
              )}

              {stage === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 text-center"
                >
                  <div className="relative mx-auto grid h-16 w-16 place-items-center">
                    <SuccessRing trigger={confettiKey} color="#10b981" />
                    <AnimatedCheck size={64} />
                  </div>
                  <div>
                    <h3 className="font-display text-[20px] font-semibold leading-tight tracking-tight text-white">Transaction complete</h3>
                    <p className="mt-1 text-[13px] leading-snug text-ink-400">
                      {autoRetire
                        ? `Your ${purchasedAmount} tCO₂e has been permanently retired. A retirement certificate has been anchored to your wallet.`
                        : `${purchasedAmount} tCO₂e is now in your wallet.`}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-left">
                    <Row k="Amount" v={`${formatNumber(purchasedAmount)} tCO₂e`} />
                    <Row k="Transaction" v={shortenTx(purchasedTx, 6)} mono />
                    <Row k="Block" v={`#${blockNumber.toLocaleString()}`} mono />
                    {autoRetire && <Row k="Retirement Cert" v={shortenTx(certId, 6)} mono />}
                    <Row k="Gas" v={<span className="text-emerald-300">$0.00 (Paymaster)</span>} />
                  </div>
                  <div className="flex items-center justify-center gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-[11.5px] text-emerald-200">
                    <PulseDot color="#10b981" />
                    <span>Viewable on the public audit trail</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {stage === "review" && (
            <div className="flex items-center justify-end gap-2 border-t border-white/5 bg-white/[0.02] p-4">
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button
                onClick={onPurchase}
                leftIcon={<ShoppingBag className="h-4 w-4" />}
                loading={["approve", "swap", "retire", "settle"].includes(stage)}
                loadingText="Processing…"
              >
                {autoRetire ? `Buy & Retire ${formatNumber(usedAmount)}` : `Buy ${formatNumber(usedAmount)}`}
              </Button>
            </div>
          )}
          {stage === "done" && (
            <div className="flex items-center justify-end gap-2 border-t border-white/5 bg-white/[0.02] p-4">
              <Button onClick={close} rightIcon={<ArrowRight className="h-4 w-4" />}>Done</Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ k, v, mono, emphasis }) {
  return (
    <div className="flex items-center justify-between py-1.5 leading-none">
      <span className="text-[11.5px] text-ink-400">{k}</span>
      <span className={`${mono ? "font-mono" : ""} ${emphasis ? "font-display text-[15px] font-semibold text-white" : "text-[12.5px] text-ink-200"}`}>{v}</span>
    </div>
  );
}

function ProcessStage({ icon: Icon, label, detail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
          <Icon className="h-5 w-5 animate-spin text-emerald-300" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold leading-tight text-white">{label}</p>
          <p className="mt-0.5 truncate font-mono text-[11px] leading-snug text-ink-400">{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}
