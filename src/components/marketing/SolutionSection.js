"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Satellite, BadgeCheck, Flame, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Zero-knowledge compliance",
    body:
      "Producers generate zk-SNARK proofs locally that mathematically attest to methodology compliance without ever exposing raw proprietary data.",
    label: "Privacy",
  },
  {
    icon: Cpu,
    title: "IoT sensor fusion",
    body:
      "Ground sensors stream signed telemetry directly into the protocol. Every reading is hashed, attested, and pinned to the credit's lifecycle.",
    label: "Verification",
  },
  {
    icon: Satellite,
    title: "Satellite dMRV",
    body:
      "Independent orbital measurements cross-check biomass, soil carbon, and methane plumes — preventing on-the-ground reporting fraud.",
    label: "Oracle",
  },
  {
    icon: BadgeCheck,
    title: "VCS001 registry bridge",
    body:
      "Native integration with Verra, Gold Standard, CAR, and ACR. No double-issuance, no parallel registries, no manual reconciliation.",
    label: "Bridge",
  },
  {
    icon: Flame,
    title: "Permanent retirement",
    body:
      "Retired credits are cryptographically destroyed at the smart-contract level. Resale, fractionalization, and double-claiming are mathematically impossible.",
    label: "Settlement",
  },
  {
    icon: ArrowRight,
    title: "Programmable by design",
    body:
      "Compose credits as building blocks. Auto-purchase on listing, retire-on-emit, treasury diversification, marketplace routing — all in one transaction.",
    label: "Composability",
  },
];

export function SolutionSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-emerald-300/90">
            <span className="h-px w-6 bg-current opacity-40" />
            The Solution
          </p>
          <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]">
            A protocol rebuilt <span className="italic font-normal text-emerald-300" style={{ fontFamily: "var(--font-serif)" }}>from first principles</span>.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-ink-300">
            MetricGreen replaces opaque, slow, paper-based verification with cryptographic
            guarantees that are cheaper, faster, and more rigorous than anything that came before.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative bg-ink-1000 p-7 transition hover:bg-ink-900"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white">
                  <p.icon className="h-4 w-4" strokeWidth={1.6} />
                </div>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-500">
                  {String(i + 1).padStart(2, "0")} / {pillars.length}
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80 leading-none">{p.label}</p>
              <h3 className="mt-2.5 font-display text-[16px] font-semibold leading-[1.25] tracking-tight text-white">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-ink-400">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
