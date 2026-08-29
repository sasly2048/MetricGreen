"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Leaf,
  Activity,
  Coins,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Cpu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { Sparkline, AreaChart, DonutChart } from "@/components/ui/Charts";
import { EmptyState } from "@/components/ui/EmptyStates";
import { PulseDot } from "@/components/ui/MicroInteractions";
import { Page, PageHeader, Section, StatGrid } from "@/components/ui/Page";
import { networkStats, events, projects, sensors, producers } from "@/lib/data";
import { useDemoState } from "@/lib/demo-state";
import { formatNumber, relativeTime, shortenTx, cn } from "@/lib/utils";

export default function DashboardPage() {
  const { state } = useDemoState();
  const isProducer = !!state.producer.id;
  const producer = isProducer ? producers.find((p) => p.id === state.producer.id) : null;

  return (
    <Page>
      <PageHeader
        eyebrow={isProducer ? "Producer Console" : "Network"}
        title={isProducer ? `Welcome back, ${producer?.name?.split(" ")[0]}` : "Network overview"}
        description={isProducer
          ? "Track issuance, retirements, and on-chain attestations for your portfolio."
          : "Real-time view of the entire MetricGreen protocol."}
        action={
          <>
            <Button as={Link} href="/projects" variant="secondary" size="md">View Projects</Button>
            <Button as={Link} href="/projects/new" leftIcon={<Plus className="h-4 w-4" />} size="md">
              Mint Credit
            </Button>
          </>
        }
      />

      {!isProducer && <NotRegisteredCallout />}

      <StatGrid cols={4}>
        <MetricCard
          label="Credits Issued (30d)"
          value={formatNumber(networkStats.totalCreditsIssued, { compact: true })}
          delta="+8.4%"
          trend="up"
          hint="tCO₂e equivalent"
          icon={Leaf}
          tone="brand"
          spark={<Sparkline data={networkStats.issuanceSeries.slice(-12)} color="#10b981" />}
        />
        <MetricCard
          label="Permanent Retirements"
          value={formatNumber(networkStats.totalCreditsRetired, { compact: true })}
          delta="+12.1%"
          trend="up"
          hint="Mathematically burned"
          icon={Flame}
          tone="rose"
          spark={<Sparkline data={networkStats.retirementSeries.slice(-12)} color="#fb7185" />}
        />
        <MetricCard
          label="Avg. Verification Time"
          value="2.3s"
          delta="-12ms"
          trend="down"
          hint="zk-SNARK + satellite"
          icon={ShieldCheck}
          tone="iris"
          spark={<Sparkline data={networkStats.priceSeries.slice(-12)} color="#818cf8" />}
        />
        <MetricCard
          label="Active Sensor Streams"
          value={formatNumber(networkStats.activeSensors, { compact: true })}
          delta="+3"
          trend="up"
          hint="Across 38 countries"
          icon={Cpu}
          tone="cyan"
          spark={<Sparkline data={networkStats.issuanceSeries.slice(-12)} color="#22d3ee" />}
        />
      </StatGrid>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader
                eyebrow="Issuance · 30d"
                title="Network issuance & retirement"
                description="Daily volume of new credits minted (emerald) against permanent retirements (rose)."
                action={
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 text-ink-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Issued
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-400">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      Retired
                    </span>
                  </div>
                }
              />
              <div className="p-5 pt-0">
                <div className="h-56">
                  <AreaChart data={networkStats.issuanceSeries} color="#10b981" height={220} />
                </div>
                <div className="mt-2 h-28">
                  <AreaChart data={networkStats.retirementSeries} color="#fb7185" height={112} />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader eyebrow="Registry Mix" title="By standard" description="Active credits by registry." />
              <div className="flex items-center gap-6 p-5 pt-0">
                <div className="relative">
                  <DonutChart data={networkStats.registryMix} size={128} thickness={16} />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <p className="font-display text-[16px] font-semibold leading-none text-white">184k</p>
                      <p className="mt-1 font-mono text-[8.5px] uppercase tracking-widest text-ink-500">credits</p>
                    </div>
                  </div>
                </div>
                <ul className="flex-1 space-y-2">
                  {networkStats.registryMix.map((r) => (
                    <li key={r.name} className="flex items-center justify-between gap-2 text-[12.5px]">
                      <span className="flex items-center gap-2 text-ink-200">
                        <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                        {r.name}
                      </span>
                      <span className="font-mono text-ink-400">{r.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card>
              <CardHeader eyebrow="Methodology" title="Category mix" />
              <div className="grid grid-cols-2 gap-2 p-5 pt-0">
                {networkStats.categoryMix.slice(0, 6).map((c) => (
                  <div key={c.name} className="rounded-md border border-white/[0.05] bg-white/[0.02] p-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-ink-300 leading-none">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-[15px] font-semibold leading-none text-white">{c.value}%</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader
                eyebrow="Activity"
                title="Recent on-chain events"
                description="Live stream of mints, retirements, listings, and attestations."
                action={
                  <Link href="/audit" className="group inline-flex items-center gap-1 text-[12px] text-ink-400 transition hover:text-white">
                    View all
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                }
              />
              <ul className="divide-y divide-white/[0.04]">
                {events.slice(0, 6).map((e) => (
                  <li key={e.id} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.02]">
                    <EventTypeIcon type={e.type} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-white leading-none">{e.type}</p>
                        <StatusPill status={e.status} />
                      </div>
                      <p className="mt-1.5 truncate text-[11.5px] leading-snug text-ink-400">{e.note}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="font-mono text-[11px] leading-tight text-ink-300">{shortenTx(e.txHash, 4)}</p>
                      <p className="mt-1 font-mono text-[10px] leading-none text-ink-500">{relativeTime(e.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader
                eyebrow="My Projects"
                title="Producer portfolio"
                action={
                  <Link href="/projects" className="text-[12px] text-ink-400 transition hover:text-white">
                    All
                  </Link>
                }
              />
              {producer ? (
                <ul className="divide-y divide-white/[0.04]">
                  {projects.filter((p) => p.producerId === producer.id).slice(0, 3).map((p) => (
                    <li key={p.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold leading-tight text-white">{p.name}</p>
                        <StatusPill status={p.status} />
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-ink-400">{p.location} · {p.category}</p>
                      <div className="mt-3 flex items-center justify-between text-[11.5px] leading-none">
                        <span className="text-ink-400">Issued</span>
                        <span className="font-mono text-ink-100">{formatNumber(p.totalIssued)} tCO₂e</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-emerald-500/60"
                          style={{ width: `${(p.totalRetired / p.totalIssued) * 100}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] leading-none text-ink-500">
                        <span>{((p.totalRetired / p.totalIssued) * 100).toFixed(0)}% retired</span>
                        <span>{formatNumber(p.totalRetired)} / {formatNumber(p.totalIssued)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 pt-0">
                  <EmptyState
                    illustration="projects"
                    title="No active projects"
                    description="Register your VCS001 certificate to start minting."
                    primaryAction={
                      <Button as={Link} href="/projects/new" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                        Register Project
                      </Button>
                    }
                  />
                </div>
              )}
            </Card>

            <Card>
              <CardHeader
                eyebrow="Sensors"
                title="Live data streams"
                action={
                  <div className="flex items-center gap-1.5 text-[11px] text-ink-400">
                    <PulseDot color="#10b981" />
                    <span>Live</span>
                  </div>
                }
              />
              <ul className="space-y-2 p-5 pt-0">
                {sensors.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                    <div className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-ink-300">
                      <Cpu className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium leading-tight text-white">{s.name}</p>
                      <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-widest text-ink-500">{s.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[12px] leading-none text-ink-100">{s.lastReading} <span className="text-ink-500">{s.unit}</span></p>
                      <div className="mt-1.5 flex justify-end">
                        <StatusPill status={s.status} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </Page>
  );
}

function EventTypeIcon({ type }) {
  const map = {
    Mint: { icon: Coins, color: "emerald" },
    Retire: { icon: Flame, color: "rose" },
    Register: { icon: ShieldCheck, color: "indigo" },
    List: { icon: Activity, color: "amber" },
    Purchase: { icon: Activity, color: "cyan" },
    Challenge: { icon: AlertTriangle, color: "amber" },
    Verify: { icon: ShieldCheck, color: "emerald" },
    Revoke: { icon: AlertTriangle, color: "rose" },
  };
  const config = map[type] || { icon: Activity, color: "neutral" };
  const Icon = config.icon;
  const colors = {
    emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    rose: "border-rose-500/25 bg-rose-500/10 text-rose-300",
    indigo: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
    amber: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
    neutral: "border-white/10 bg-white/[0.04] text-ink-300",
  };
  return (
    <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border", colors[config.color])}>
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
}

function NotRegisteredCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col items-start gap-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-[14px] font-semibold leading-tight text-white">No VCS001 registration detected</p>
          <p className="mt-1 text-[13px] leading-snug text-ink-300">
            Connect a registered producer wallet or register a new VCS001 certificate to begin minting.
          </p>
        </div>
      </div>
      <Button as={Link} href="/projects/new" size="sm" variant="dark">
        Register Now
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}
