"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { AreaChart } from "@/components/ui/Charts";
import { networkStats } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

const stats = [
  {
    label: "Total credits minted",
    value: formatNumber(networkStats.totalCreditsIssued, { compact: true }),
    detail: "tCO₂e across 142 active projects",
    series: networkStats.issuanceSeries,
  },
  {
    label: "Permanent retirements",
    value: formatNumber(networkStats.totalCreditsRetired, { compact: true }),
    detail: "38.7% of supply, mathematically burned",
    series: networkStats.retirementSeries,
  },
  {
    label: "Total value locked",
    value: "$" + formatNumber(networkStats.totalValueLocked, { compact: true }),
    detail: "Across producer bonds and listings",
    series: networkStats.priceSeries,
  },
  {
    label: "Active sensor streams",
    value: formatNumber(networkStats.activeSensors, { compact: true }),
    detail: "From 38 countries, all signed and attested",
    series: networkStats.issuanceSeries,
  },
];

export function StatsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="surface-2 relative overflow-hidden rounded-2xl p-8 sm:p-12">
          <div className="pointer-events-none absolute inset-0 dot-pattern opacity-25" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-emerald-300/90">
                  <Sparkles className="h-3 w-3" />
                  Network · Live
                </p>
                <h2 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.5rem]">
                  The largest on-chain climate dataset in the world.
                </h2>
                <p className="mt-3 text-[14px] leading-[1.6] text-ink-400">
                  Every credit, every sensor reading, every retirement — verifiable
                  in real time, queryable by anyone, secured by cryptography.
                </p>
              </div>
              <a
                href="/audit"
                className="group inline-flex items-center gap-2 self-start rounded-md border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-medium text-ink-100 transition hover:border-white/20 hover:bg-white/[0.08] sm:self-end"
              >
                Explore the audit trail
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="bg-ink-1000 p-5"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 leading-none">{s.label}</p>
                  <p className="mt-2.5 font-display text-[26px] font-semibold leading-none tracking-[-0.025em] text-white">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-ink-500">{s.detail}</p>
                  <div className="mt-3 -mb-1">
                    <AreaChart data={s.series} color="#10b981" height={40} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
