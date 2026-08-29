"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is MetricGreen a registry?",
    a: "No. MetricGreen is a protocol layer that sits on top of existing registries (Verra, Gold Standard, CAR, ACR). It enforces uniqueness, traceability, and permanent retirement through smart contracts — it does not replace the underlying certification bodies.",
  },
  {
    q: "How are ZK proofs generated?",
    a: "Producers run a local zk-SNARK prover (built with Circom and SnarkJS) inside their IoT gateway. The proof attests that aggregated sensor readings fall within the methodology's compliance range, without revealing the raw data. Proofs are then verified on-chain in under 50k gas.",
  },
  {
    q: "What happens if a sensor goes offline?",
    a: "Issuance is paused automatically. A credit cannot be minted while a required sensor stream is degraded or offline for more than the methodology-defined tolerance window. This prevents producers from minting against stale or fabricated data.",
  },
  {
    q: "Can a credit be reversed or resold after retirement?",
    a: "No. The retirement function calls a smart contract that permanently marks the credit as retired and emits a tamper-proof certificate anchored to the retiree's address. The NFT cannot be transferred, fractionalized, or re-minted.",
  },
  {
    q: "Who can become a producer?",
    a: "Any project that holds a valid VCS001-equivalent certification from a supported registry can register. A reputation bond (between 1–5 ETH depending on methodology) is staked to align long-term incentives with project quality.",
  },
  {
    q: "Is the protocol audited?",
    a: "Yes. The smart contracts have been audited by Trail of Bits and OpenZeppelin, with a formal verification report for the retirement logic. The full audit reports are public on our documentation page.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section">
      <div className="container-prose">
        <p className="eyebrow text-violet-300/90 justify-center">
          FAQ
        </p>
        <h2 className="mt-4 text-center font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]">
          Common questions.
        </h2>

        <div className="mt-12 overflow-hidden rounded-xl border border-white/[0.06]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={cn(i !== 0 && "border-t border-white/[0.05]")}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.015]"
                >
                  <span className="font-display text-[15.5px] font-medium tracking-tight text-white">{f.q}</span>
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
                      isOpen
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-white/[0.08] bg-white/[0.02] text-ink-400",
                    )}
                  >
                    {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-200",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0">
                    <p className="px-5 pb-5 text-[13.5px] leading-[1.65] text-ink-300">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
