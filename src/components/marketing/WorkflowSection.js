"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Factory, Fingerprint, Layers, Coins, Flame, Clock, ShieldCheck, Cpu, Satellite } from "lucide-react";
import {
  ForestCanopyIllustration,
  SatelliteDishIllustration,
  DACTowerIllustration,
} from "@/components/ui/Illustrations";
import { cn, formatNumber } from "@/lib/utils";

const steps = [
  {
    id: 1,
    label: "Register",
    title: "Producers stake a reputation bond",
    body: "Connect a wallet and lock a VCS001-attested bond. This prevents Sybil attacks and aligns long-term incentives with project quality.",
    icon: Factory,
    metric: "1.0 ETH",
    metricLabel: "Bond",
    duration: "~2 min",
    detail: ["VCS001 cert verification", "Reputation bond (1–5 ETH)", "On-chain producer profile"],
    Illust: ForestCanopyIllustration,
  },
  {
    id: 2,
    label: "Prove",
    title: "Generate a ZK-compliance proof",
    body: "Producers' IoT gateways compute a zk-SNARK locally. The proof attests to methodology thresholds without uploading raw sensor data.",
    icon: Fingerprint,
    metric: "1.4s",
    metricLabel: "Avg. prove time",
    duration: "1.4s",
    detail: ["zk-SNARK generation", "Local proving", "Raw data never leaves device"],
    Illust: DACTowerIllustration,
  },
  {
    id: 3,
    label: "Anchor",
    title: "Sensor data is hashed on-chain",
    body: "Signed IoT and satellite readings are anchored to the contract. Anyone can later verify the data — only the proof, not the payload, is public.",
    icon: Layers,
    metric: "2.3s",
    metricLabel: "Verify time",
    duration: "3s",
    detail: ["IoT hash + signature", "Satellite cross-check", "IPFS metadata pin"],
    Illust: SatelliteDishIllustration,
  },
  {
    id: 4,
    label: "Mint",
    title: "An ERC-721 credit is issued",
    body: "The contract mints a uniquely serialized, vintage-tagged credit. A 7-day challenge window begins for third-party verifiers to dispute issuance.",
    icon: Coins,
    metric: "12s",
    metricLabel: "Mint latency",
    duration: "12s",
    detail: ["ERC-721 soulbound until cleared", "7-day challenge window", "Registry batched"],
    Illust: ForestCanopyIllustration,
  },
  {
    id: 5,
    label: "Retire",
    title: "Offset is burned — forever",
    body: "Buyers claim the credit, the contract cryptographically destroys the NFT, and a retirement certificate is anchored to the buyer's wallet.",
    icon: Flame,
    metric: "<1s",
    metricLabel: "Burn tx",
    duration: "<1s",
    detail: ["On-chain burn event", "Retirement certificate", "Supply permanently decremented"],
    Illust: DACTowerIllustration,
  },
];

export function WorkflowSection() {
  const [active, setActive] = useState(1);
  const step = steps.find((s) => s.id === active);

  return (
    <section className="section">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Sticky nav rail */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <p className="eyebrow text-indigo-300/90">
                <span className="h-px w-6 bg-current opacity-40" />
                The Workflow
              </p>
              <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]">
                From sensor reading to <span className="italic font-normal text-indigo-300" style={{ fontFamily: "var(--font-serif)" }}>permanent</span> offset.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.6] text-ink-300">
                The full lifecycle of a MetricGreen carbon credit, end-to-end.
                No spreadsheets, no quarterly reviews, no intermediaries.
              </p>

              {/* Step list */}
              <ol className="mt-8 space-y-1">
                {steps.map((s) => {
                  const isActive = s.id === active;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => setActive(s.id)}
                        className={cn(
                          "group flex w-full items-center gap-4 rounded-lg border px-3.5 py-3 text-left transition",
                          isActive
                            ? "border-emerald-500/25 bg-emerald-500/[0.04]"
                            : "border-transparent hover:border-white/10 hover:bg-white/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-[10px] font-medium tabular-nums",
                            isActive ? "text-emerald-300" : "text-ink-500",
                          )}
                        >
                          {String(s.id).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "flex-1 font-display text-[13.5px] font-medium tracking-tight",
                            isActive ? "text-white" : "text-ink-300",
                          )}
                        >
                          {s.label}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px] tabular-nums",
                            isActive ? "text-emerald-300" : "text-ink-500",
                          )}
                        >
                          {s.duration}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Step detail */}
          <div className="lg:col-span-8">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="surface-2 overflow-hidden rounded-2xl"
            >
              <div className="relative h-64 sm:h-72">
                <step.Illust className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/30 to-transparent" />
                <div className="absolute right-5 top-5 flex flex-col items-end gap-2">
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-200 backdrop-blur-md">
                    Step {step.id} of {steps.length}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-300 backdrop-blur-md">
                    <Clock className="mr-1 inline h-2.5 w-2.5" />{step.duration}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
                      <step.icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <h3 className="font-display text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[14.5px] leading-[1.6] text-ink-200">{step.body}</p>

                <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                  {step.detail.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-[13px] text-ink-200">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Data label="Prover" v={step.metric} />
                  <Data label="Step duration" v={step.duration} />
                  <Data label="Gas" v="Gasless" tone="brand" />
                  <Data label="Privacy" v="ZK-SNARK" tone="brand" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Data({ label, v, tone = "neutral" }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
      <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">{label}</p>
      <p className={cn("mt-2 font-mono text-[13px] font-medium tracking-tight leading-none", tone === "brand" ? "text-emerald-300" : "text-white")}>{v}</p>
    </div>
  );
}
