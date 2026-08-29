"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Activity, Leaf, Zap, Network, ShieldCheck, Cpu, Database, Globe2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ForestCanopyIllustration, SatelliteDishIllustration, DACTowerIllustration } from "@/components/ui/Illustrations";
import { PulseDot } from "@/components/ui/MicroInteractions";

export function HeroSection({ onConnect }) {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-20 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 grid-pattern-fine opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-10">
        {/* Top eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <Link
            href="/docs#methodology"
            className="group inline-flex items-center gap-3 rounded-full border border-emerald-500/15 bg-emerald-500/[0.04] py-1.5 pl-2 pr-3.5 text-[11px] text-ink-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-emerald-300">
              <PulseDot color="#34d399" />
              Live
            </span>
            <span className="text-ink-300">Protocol 2.0 — Sepolia mainnet</span>
            <ArrowUpRight className="h-3 w-3 text-ink-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <div className="hidden items-center gap-5 font-mono text-[10.5px] text-ink-500 sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              184,233 tCO₂e issued
            </span>
            <span>71,402 retired</span>
            <span>142 producers</span>
          </div>
        </motion.div>

        {/* Asymmetric editorial layout */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left: typography, 7 cols */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white text-balance"
            >
              The <span className="text-gradient-emerald">programmable</span><br />
              infrastructure for the<br />
              <span className="italic font-normal text-ink-300" style={{ fontFamily: "var(--font-serif)" }}>
                climate economy.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-7 max-w-xl text-[16px] leading-[1.6] text-ink-300"
            >
              Issue, trade, and permanently retire verifiable carbon credits on a
              decentralized ledger. Anchor IoT and satellite data with zero-knowledge
              proofs. <span className="text-ink-200">Eliminate greenwashing at the protocol layer.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" onClick={onConnect} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Connect wallet
              </Button>
              <Button as={Link} href="/how-it-works" size="lg" variant="secondary" leftIcon={<Activity className="h-4 w-4" />}>
                How it works
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-ink-500"
            >
              <span>Non-custodial</span>
              <span className="h-3 w-px bg-white/10" />
              <span>Audited contracts</span>
              <span className="h-3 w-px bg-white/10" />
              <span>Open-source</span>
              <span className="h-3 w-px bg-white/10" />
              <span>No signup required</span>
            </motion.div>
          </div>

          {/* Right: floating dashboard, 5 cols */}
          <div className="relative lg:col-span-5">
            <HeroFloatingDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFloatingDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 bg-gradient-to-br from-emerald-500/15 via-indigo-500/5 to-fuchsia-500/10 blur-3xl" />

      <div className="surface-3 relative rounded-2xl p-2 shadow-2xl shadow-black/50 ring-1 ring-white/[0.04]">
        {/* Window chrome */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-white/[0.04] bg-black/30 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-400/70" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-500">
            <Activity className="h-2.5 w-2.5" />
            app.metricgreen.xyz / dashboard
          </div>
          <div className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-widest text-ink-500">
            <PulseDot color="#10b981" />
            Sepolia
          </div>
        </div>

        <div className="space-y-2 p-2.5">
          {/* Top stats row */}
          <div className="grid grid-cols-3 gap-2">
            <DashStat label="Issued 24h" value="12,847" delta="+8.4%" />
            <DashStat label="Verify" value="2.3s" delta="-12ms" down />
            <DashStat label="Sensors" value="1,287" delta="+3" />
          </div>

          {/* Big chart */}
          <div className="rounded-xl border border-white/[0.04] bg-black/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-500">Issuance · 30d</p>
                <p className="mt-0.5 font-display text-[18px] font-semibold leading-tight tracking-tight text-white">184,233 <span className="text-[11px] text-ink-400 font-normal">tCO₂e</span></p>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-ink-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Issued
                </span>
                <span className="flex items-center gap-1 text-ink-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  Retired
                </span>
              </div>
            </div>
            <div className="h-20">
              <HeroChart />
            </div>
          </div>

          {/* Bottom: project + recent mint */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative overflow-hidden rounded-xl border border-white/[0.04]">
              <div className="relative h-24">
                <ForestCanopyIllustration className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <p className="font-mono text-[8.5px] uppercase tracking-widest text-emerald-300">Top</p>
                  <p className="mt-0.5 truncate font-display text-[12px] font-semibold leading-tight text-white">Manauary Reforestation</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.04] bg-black/30 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-500">Recent</p>
              <p className="mt-1.5 truncate font-mono text-[11px] leading-tight text-white">MGC-9341-2024-0001</p>
              <p className="mt-0.5 text-[10px] text-ink-400">500 tCO₂e · 2s ago</p>
              <div className="mt-2 space-y-0.5 font-mono text-[9px] text-ink-500">
                <Mini k="ZK" v="0x8f7b…3c1a" />
                <Mini k="IoT" v="0xa1b2…c3d4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Mini({ k, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{k}</span>
      <span className="text-ink-200">{v}</span>
    </div>
  );
}

function DashStat({ label, value, delta, down }) {
  return (
    <div className="rounded-lg border border-white/[0.04] bg-black/30 px-2.5 py-2">
      <p className="font-mono text-[9px] uppercase tracking-widest text-ink-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <p className="font-display text-[15px] font-semibold leading-none tracking-tight text-white">{value}</p>
        <span className={`font-mono text-[10px] leading-none ${down ? "text-rose-400" : "text-emerald-400"}`}>
          {down ? "▼" : "▲"} {delta}
        </span>
      </div>
    </div>
  );
}

function HeroChart() {
  const points = [12, 18, 14, 22, 28, 24, 32, 38, 34, 42, 48, 44, 52, 58, 54, 62, 68, 64, 72, 78, 74, 82, 88, 84, 92, 96, 102, 110];
  const retired = [6, 8, 10, 12, 16, 18, 22, 26, 24, 30, 32, 30, 36, 40, 38, 44, 48, 46, 52, 56, 54, 60, 64, 62, 68, 72, 76, 80];
  const max = Math.max(...points);
  const h = 100;
  const w = 100;
  const stepX = w / (points.length - 1);
  const issuedPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * stepX},${h - (p / max) * 80 - 10}`)
    .join(" ");
  const retiredPath = retired
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * stepX},${h - (p / max) * 80 - 10}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path d={`${issuedPath} L100,100 L0,100 Z`} fill="url(#hero-area)" />
      <path d={issuedPath} fill="none" stroke="url(#hero-line)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
      <path d={retiredPath} fill="none" stroke="#fb7185" strokeWidth="0.5" strokeDasharray="1 1" vectorEffect="non-scaling-stroke" opacity="0.6" />
    </svg>
  );
}
