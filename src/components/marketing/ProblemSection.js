"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Repeat, FileX, EyeOff } from "lucide-react";

const problems = [
  {
    number: "01",
    icon: AlertTriangle,
    title: "Greenwashing is rampant",
    body:
      "An estimated 90% of voluntary carbon offsets lack real additionality. Buyers cannot distinguish signal from noise in a fragmented market.",
    stat: "~90%",
    statLabel: "of offsets lack verified additionality",
  },
  {
    number: "02",
    icon: Repeat,
    title: "Double-counting persists",
    body:
      "The same tonne of CO₂ is routinely sold, retired, and resold across registries. There is no canonical source of truth for ownership.",
    stat: "4–6×",
    statLabel: "average resale rate across registries",
  },
  {
    number: "03",
    icon: FileX,
    title: "Audits take 18+ months",
    body:
      "Manual verification and PDF-based reporting make meaningful oversight slow, expensive, and inconsistent across project types.",
    stat: "18mo",
    statLabel: "median time from mint to verification",
  },
  {
    number: "04",
    icon: EyeOff,
    title: "Producer data is exposed",
    body:
      "Disclosing proprietary factory telemetry to verifiers creates competitive risk. Producers self-censor or exaggerate to protect IP.",
    stat: "67%",
    statLabel: "of producers report IP-sensitive data gaps",
  },
];

export function ProblemSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Sticky header */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <p className="eyebrow text-rose-300/90">
                <span className="h-px w-6 bg-current opacity-40" />
                The Problem
              </p>
              <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]">
                The voluntary carbon market is <span className="italic font-normal text-rose-300" style={{ fontFamily: "var(--font-serif)" }}>broken</span>.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.6] text-ink-300">
                A trillion-dollar climate crisis is being financed by paper credits that
                cannot be reliably verified, traced, or retired. We rebuilt the rails.
              </p>
            </div>
          </div>

          {/* Problem cards */}
          <div className="space-y-3 lg:col-span-8">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group grid grid-cols-[auto_1fr] items-start gap-6 rounded-xl border border-rose-500/10 bg-rose-500/[0.015] p-6 transition hover:border-rose-500/20 hover:bg-rose-500/[0.03]"
              >
                <div className="flex flex-col items-start gap-3 pt-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">{p.number}</span>
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-rose-500/15 bg-rose-500/[0.08]">
                    <p.icon className="h-4 w-4 text-rose-300" strokeWidth={1.8} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[17px] font-semibold leading-tight tracking-tight text-white">{p.title}</h3>
                    <p className="font-display text-[22px] font-semibold leading-none tracking-[-0.02em] text-rose-300">
                      {p.stat}
                    </p>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-300">{p.body}</p>
                  <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-500">
                    {p.statLabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
