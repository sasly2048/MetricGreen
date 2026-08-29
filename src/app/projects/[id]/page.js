"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Coins, Flame, ShieldCheck, ExternalLink, Plus, Share2, Heart, Sparkles,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { Sparkline } from "@/components/ui/Charts";
import { KeyValueList } from "@/components/ui/Misc";
import { Page, PageHeader, Section } from "@/components/ui/Page";
import { projects, producers, sensors, credits } from "@/lib/data";
import { formatNumber, formatCurrency, relativeTime, shortenAddress, shortenTx } from "@/lib/utils";
import { MintDialog } from "@/components/projects/MintDialog";

export default function ProjectDetailPage({ params }) {
  const { id } = use(params);
  const project = projects.find((p) => p.id === id);
  const [mintOpen, setMintOpen] = useState(false);

  if (!project) notFound();

  const producer = producers.find((p) => p.id === project.producerId);
  const projectSensors = sensors.filter((s) => project.sensorIds.includes(s.id));
  const projectCredits = credits.filter((c) => c.projectId === project.id);

  return (
    <Page>
      <nav className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-500">
        <Link href="/projects" className="transition hover:text-ink-200">Projects</Link>
        <span className="text-ink-700">/</span>
        <span className="text-ink-300 truncate max-w-xs">{project.name}</span>
      </nav>

      <PageHeader
        eyebrow={project.category}
        title={project.name}
        description={project.description}
        className="mt-5"
        action={
          <>
            <Button variant="secondary" size="md" leftIcon={<Share2 className="h-4 w-4" />}>Share</Button>
            <Button variant="secondary" size="md" leftIcon={<Heart className="h-4 w-4" />}>Follow</Button>
            <Button onClick={() => setMintOpen(true)} leftIcon={<Plus className="h-4 w-4" />} size="md">
              Mint Credit
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <CategoryArt category={project.category} height={200} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="iris">{project.registry}</Badge>
            <span className="font-mono text-[11.5px] text-ink-400">{project.projectId}</span>
            <StatusPill status={project.status} />
            <Badge tone="neutral">Vintage {project.vintage}</Badge>
            <Badge tone="success" dot>Live on-chain</Badge>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink-300">
            <MapPin className="h-3.5 w-3.5" /> {project.location}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/[0.05] p-6 sm:grid-cols-4 sm:p-8">
          <ProjectStat label="Total Issued" value={formatNumber(project.totalIssued)} unit="tCO₂e" icon={Coins} />
          <ProjectStat label="Retired" value={formatNumber(project.totalRetired)} unit="tCO₂e" icon={Flame} tone="rose" />
          <ProjectStat label="Available" value={formatNumber(project.available)} unit="tCO₂e" icon={Coins} tone="brand" />
          <ProjectStat label="Price" value={formatCurrency(project.pricePerTonne)} unit="per tCO₂e" icon={Sparkles} tone="iris" />
        </div>
      </Card>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader
                eyebrow="Sensor Network"
                title={`${projectSensors.length} data streams`}
                description="Real-time telemetry from ground sensors and orbital dMRV feeds."
                action={
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-widest text-emerald-300">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </span>
                }
              />
              <div className="grid gap-3 p-5 pt-0 sm:grid-cols-2">
                {projectSensors.map((s) => (
                  <div key={s.id} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold leading-tight text-white">{s.name}</p>
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-500 leading-none">{s.type}</p>
                      </div>
                      <StatusPill status={s.status} />
                    </div>
                    <div className="mt-4 flex items-baseline gap-1.5 leading-none">
                      <span className="font-display text-[22px] font-semibold text-white">{s.lastReading}</span>
                      <span className="text-[11.5px] text-ink-400">{s.unit}</span>
                    </div>
                    <div className="mt-3 -mb-1">
                      <Sparkline data={[3.2, 3.4, 3.6, 3.5, 3.8, 3.9, 4.0, 4.2, 4.1, 4.3, 4.5, s.lastReading]} color="#10b981" height={32} />
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] text-ink-500 leading-none">
                      <span>Updated {relativeTime(s.updatedAt)}</span>
                      <span>{shortenTx(s.certHashes[0], 3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader
                eyebrow="Credits"
                title="Issued credit batches"
                description="All carbon credits minted against this project's data."
                action={
                  <Link href="/audit" className="text-[12px] text-ink-400 transition hover:text-white">
                    View on audit trail
                  </Link>
                }
              />
              {projectCredits.length === 0 ? (
                <p className="p-5 pt-0 text-[13.5px] text-ink-500">No credits minted yet.</p>
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {projectCredits.map((c) => (
                    <li key={c.id} className="grid gap-3 px-5 py-3.5 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono text-[12.5px] text-white leading-none">{c.serialNumber}</p>
                          <StatusPill status={c.status} />
                        </div>
                        <p className="mt-1.5 font-mono text-[10px] text-ink-400 leading-snug">
                          ZK {shortenTx(c.zkProof)} · IoT {shortenTx(c.iotHash)} · SAT {shortenTx(c.satelliteHash)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-[16px] font-semibold leading-none text-white">{c.amount} <span className="text-[11px] text-ink-400 font-normal">tCO₂e</span></p>
                        <p className="mt-1 font-mono text-[9.5px] text-ink-500 leading-none">Minted {relativeTime(c.issuedAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader eyebrow="Producer" title={producer?.name || "Anonymous"} />
              <div className="space-y-3 p-5 pt-0">
                <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-500/0 text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">Wallet</p>
                    <p className="mt-1 truncate font-mono text-[12.5px] text-white">{shortenAddress(producer?.wallet, 6)}</p>
                  </div>
                </div>
                <KeyValueList
                  items={[
                    { label: "Country", value: producer?.country },
                    { label: "Methodology", value: producer?.methodology },
                    { label: "VCS Cert", value: producer?.vcsCert },
                    { label: "Reputation", value: producer ? `${producer.reputation}/100` : "—" },
                    { label: "Joined", value: producer?.joinedAt },
                  ]}
                />
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                  <div className="flex items-center justify-between text-[11.5px] leading-none">
                    <span className="text-ink-400">Reputation score</span>
                    <span className="font-mono text-emerald-300">{producer?.reputation}/100</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${producer?.reputation || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader eyebrow="Methodology" title={project.methodologyDoc} />
              <div className="space-y-3 p-5 pt-0 text-[13px] text-ink-300">
                <p className="leading-[1.6]">
                  This project is registered under {project.methodologyDoc}. Methodology compliance
                  is verified at issuance via a zero-knowledge proof generated locally by the
                  producer&apos;s IoT gateway. Satellite dMRV cross-checks are performed every 6 hours.
                </p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Verification frequency</span>
                    <span className="text-ink-100">Every 6 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Challenge window</span>
                    <span className="text-ink-100">7 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Required attestations</span>
                    <span className="text-ink-100">2 / 2</span>
                  </div>
                </div>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300 transition hover:text-emerald-200"
                >
                  View methodology document
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <MintDialog open={mintOpen} onClose={() => setMintOpen(false)} project={project} />
    </Page>
  );
}

function ProjectStat({ label, value, unit, icon: Icon, tone = "neutral" }) {
  const tones = {
    brand: "text-emerald-300",
    rose: "text-rose-300",
    iris: "text-indigo-300",
    neutral: "text-ink-300",
  };
  return (
    <div>
      <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">
        <Icon className={`h-3 w-3 ${tones[tone]}`} />
        {label}
      </div>
      <p className="mt-1.5 font-display text-[20px] font-semibold leading-none tracking-[-0.02em] text-white sm:text-[22px]">{value}</p>
      <p className="mt-0.5 font-mono text-[9.5px] text-ink-500 leading-none">{unit}</p>
    </div>
  );
}
