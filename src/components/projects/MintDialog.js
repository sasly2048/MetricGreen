"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ShieldCheck, Loader2, Check, Sparkles, Factory, Lock, AlertCircle, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ConfettiBurst, SuccessRing, AnimatedCheck } from "@/components/ui/MicroInteractions";
import { sfx } from "@/lib/sfx";
import { toast } from "sonner";
import { useHoldings } from "@/lib/demo-state";
import { shortenAddress } from "@/lib/utils";

const stages = ["form", "verify", "prove", "mint", "done"];

const stageLabels = {
  form: "Configure",
  verify: "Verify",
  prove: "ZK-Proof",
  mint: "Mint",
  done: "Complete",
};

export function MintDialog({ open, onClose, project }) {
  const [stage, setStage] = useState("form");
  const [amount, setAmount] = useState("100");
  const [registry, setRegistry] = useState(project?.registry || "Verra");
  const [batchId, setBatchId] = useState(project?.projectId || "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [proof, setProof] = useState(null);
  const [mintedId, setMintedId] = useState(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const { hold } = useHoldings();

  useEffect(() => {
    if (!open) return;
    const reset = setTimeout(() => {
      setStage("form");
      setAmount("100");
      setRegistry(project?.registry || "Verra");
      setBatchId(project?.projectId || "");
      setNote("");
      setError("");
      setProof(null);
      setMintedId(null);
    }, 0);
    return () => clearTimeout(reset);
  }, [open, project]);

  if (!open) return null;

  const validate = () => {
    const num = parseInt(amount, 10);
    if (!num || num < 1) return "Enter an amount of at least 1 tCO₂e";
    if (num > 5000) return "Maximum 5,000 tCO₂e per batch";
    if (!batchId.trim()) return "Batch ID is required";
    return null;
  };

  const close = () => onClose();

  const onVerify = async () => {
    const err = validate();
    if (err) {
      setError(err);
      sfx.error();
      toast.error(err);
      return;
    }
    setError("");
    sfx.step();
    setStage("verify");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: batchId,
          claimedAmount: amount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) {
        sfx.error();
        setError(data.error || "Verification failed");
        toast.error(data.error || "Verification failed");
        setStage("form");
        return;
      }
      setProof(data);
      await new Promise((r) => setTimeout(r, 800));
      sfx.proof();
      setStage("prove");
      await new Promise((r) => setTimeout(r, 1600));
      sfx.step();
      setStage("mint");
      await new Promise((r) => setTimeout(r, 1400));

      const id = "crd_" + Date.now().toString(36);
      setMintedId(id);
      hold(id);

      sfx.success();
      setConfettiKey((k) => k + 1);
      setStage("done");
      toast.success(`Minted ${num} tCO₂e on-chain`, {
        description: `Project ${project?.name} — ZK proof verified.`,
      });
    } catch (e) {
      sfx.error();
      setError(e.message || "Unknown error");
      toast.error(e.message || "Unknown error");
      setStage("form");
    }
  };

  const num = parseInt(amount, 10) || 0;
  const total = num * (project?.pricePerTonne || 0);
  const isMinting = ["verify", "prove", "mint"].includes(stage);

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
          className="relative w-full max-w-xl overflow-hidden rounded-t-2xl border border-white/10 bg-[#0a1020] shadow-2xl shadow-black/60 sm:rounded-2xl"
        >
          <ConfettiBurst trigger={confettiKey} />
          <div className="flex items-center justify-between border-b border-white/5 p-5">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-widest text-emerald-300 leading-none">
                Mint · {stage === "done" ? "Complete" : `Step ${stages.indexOf(stage) + 1}/${stages.length - 1}`}
              </p>
              <h2 className="mt-1.5 font-display text-[17px] font-semibold leading-tight tracking-tight text-white">
                {stage === "done" ? "Credit minted" : "Mint carbon credit"}
              </h2>
              {project && (
                <p className="mt-0.5 text-[12px] leading-snug text-ink-400">{project.name} · {project.projectId}</p>
              )}
            </div>
            <button onClick={close} aria-label="Close" className="rounded-md p-1.5 text-[20px] leading-none text-ink-300 transition hover:bg-white/5 hover:text-white">
              ×
            </button>
          </div>

          <div className="px-5 pt-5">
            <Stepper stage={stage} />
          </div>

          <div className="relative min-h-[280px] p-5">
            {stage === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <Input
                    label="Credit amount (tCO₂e)"
                    type="number"
                    min="1"
                    max="5000"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (error) setError("");
                    }}
                    leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                    hint={
                      num > 0
                        ? `Estimated price: $${total.toFixed(2)} · Max 5,000 per batch`
                        : "Enter 1–5,000"
                    }
                    error={error}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Registry" value={registry} onChange={(e) => setRegistry(e.target.value)}>
                    <option>Verra</option>
                    <option>Gold Standard</option>
                    <option>CAR</option>
                    <option>ACR</option>
                  </Select>
                  <Input
                    label="Batch ID"
                    placeholder="VCS-9341-2024-Q4"
                    value={batchId}
                    onChange={(e) => {
                      setBatchId(e.target.value);
                      if (error) setError("");
                    }}
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400 leading-none">Attestation note (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Add a note for verifiers reviewing this issuance…"
                    className="mt-1.5 w-full rounded-md border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] leading-snug text-white placeholder:text-ink-500 focus:border-emerald-500/40 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 text-[12px] leading-snug">
                  <span className="flex items-center gap-2 text-emerald-200">
                    <Lock className="h-3.5 w-3.5" />
                    Gasless via Paymaster
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-widest text-emerald-300 leading-none">No fee</span>
                </div>
              </motion.div>
            )}

            {stage === "verify" && (
              <ProcessStage
                key="verify"
                icon={Factory}
                label="Querying IoT sensors & satellite oracles"
                detail="Cross-checking 1,287 active streams…"
              />
            )}

            {stage === "prove" && (
              <ProcessStage
                key="prove"
                icon={ShieldCheck}
                label="Generating zero-knowledge proof locally"
                detail={proof ? `Proof: ${proof.zkProof.slice(0, 14)}…` : "Compressing 2.3MB sensor payload…"}
                progress
              />
            )}

            {stage === "mint" && (
              <ProcessStage
                key="mint"
                icon={Loader2}
                label="Submitting transaction to chain"
                detail={`Minting ${num} tCO₂e against project ${project?.name}…`}
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
                  <h3 className="font-display text-[20px] font-semibold leading-tight tracking-tight text-white">Credit minted successfully</h3>
                  <p className="mt-1 text-[13px] leading-snug text-ink-400">
                    {num} tCO₂e is now live. A 7-day challenge window is open for verifiers.
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-left">
                  <KVRow k="Credit ID" v={shortenAddress(mintedId || "0x0000", 10)} mono />
                  <KVRow k="Batch" v={batchId} mono />
                  <KVRow k="ZK Proof" v={proof ? `${proof.zkProof.slice(0, 18)}…` : "—"} mono />
                  <KVRow k="IoT Hash" v={proof ? `${proof.iotHash?.slice(0, 18) || "—"}…` : "—"} mono />
                  <KVRow k="Status" v={<span className="text-emerald-300">In challenge window</span>} />
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="secondary" onClick={close}>Close</Button>
                  <Button rightIcon={<ArrowRight className="h-4 w-4" />} onClick={close}>
                    View in Audit Trail
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {stage === "form" && (
            <div className="flex items-center justify-end gap-2 border-t border-white/5 bg-white/[0.02] p-4">
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button
                onClick={onVerify}
                leftIcon={<ShieldCheck className="h-4 w-4" />}
                disabled={isMinting}
                loading={isMinting}
                loadingText="Verifying…"
              >
                Verify & Mint
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Stepper({ stage }) {
  const labels = ["Configure", "Verify", "ZK-Proof", "Mint", "Complete"];
  const currentIndex = labels.indexOf(stageLabels[stage]);
  return (
    <ol className="flex items-center gap-2">
      {labels.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[10.5px] font-mono font-semibold leading-none transition-all ${
                done
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : active
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_16px_-4px_rgba(16,185,129,0.5)]"
                    : "border-white/10 bg-white/[0.04] text-ink-400"
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className={`truncate font-mono text-[9.5px] uppercase tracking-widest leading-none ${active || done ? "text-white" : "text-ink-500"}`}>
              {s}
            </span>
            {i < labels.length - 1 && (
              <div className={`h-px flex-1 ${done ? "bg-emerald-500/40" : "bg-white/[0.08]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ProcessStage({ icon: Icon, label, detail, progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
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
      {progress && (
        <div className="space-y-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-center font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">
            zk-SNARK generation · 1.4s avg
          </p>
        </div>
      )}
    </motion.div>
  );
}

function KVRow({ k, v, mono }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-1.5 leading-none last:border-0">
      <span className="text-[11.5px] text-ink-400">{k}</span>
      <span className={`text-[12.5px] text-ink-100 ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
  );
}
