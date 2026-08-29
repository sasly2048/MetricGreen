"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle, Check, X, FileText, Clock, Activity, Search, TrendingUp } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyStates";
import { Input } from "@/components/ui/Input";
import { Page, PageHeader, Section, StatGrid } from "@/components/ui/Page";
import { MetricCard } from "@/components/ui/MetricCard";
import { producers, projects, events } from "@/lib/data";
import { formatNumber, shortenAddress, relativeTime, cn } from "@/lib/utils";
import { toast } from "sonner";
import { sfx } from "@/lib/sfx";

const tabs = [
  { id: "queue", label: "Review Queue" },
  { id: "producers", label: "Producers" },
  { id: "disputes", label: "Disputes" },
  { id: "settings", label: "Settings" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("queue");
  const pendingEvents = events.filter((e) => e.status === "Pending");

  return (
    <Page>
      <PageHeader
        eyebrow="Verifier Console"
        title="Protocol governance"
        description="Review pending attestations, manage producer registrations, and resolve disputes."
      />

      <StatGrid cols={4}>
        <MetricCard
          label="Pending Reviews"
          value={pendingEvents.length}
          icon={Clock}
          tone={pendingEvents.length > 0 ? "amber" : "brand"}
        />
        <MetricCard label="Active Producers" value={producers.filter((p) => p.verified).length} icon={ShieldCheck} />
        <MetricCard label="Total Credits" value={formatNumber(184233, { compact: true })} icon={Activity} />
        <MetricCard label="Avg. Attest Time" value="3.4h" icon={TrendingUp} />
      </StatGrid>

      <div className="mt-10 flex flex-wrap gap-1 border-b border-white/[0.05]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative rounded-t-md px-4 py-2.5 text-[13.5px] font-medium tracking-tight transition",
              tab === t.id
                ? "text-white"
                : "text-ink-400 hover:text-white",
            )}
          >
            {t.label}
            {t.id === "queue" && pendingEvents.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 font-mono text-[10px] leading-none text-amber-300">
                {pendingEvents.length}
              </span>
            )}
            {tab === t.id && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-emerald-500" />
            )}
          </button>
        ))}
      </div>

      {tab === "queue" && <Queue />}
      {tab === "producers" && <Producers />}
      {tab === "disputes" && <Disputes />}
      {tab === "settings" && <Settings />}
    </Page>
  );
}

function Queue() {
  const pending = events.filter((e) => e.type === "Mint" || e.type === "Verify");
  return (
    <Section>
      <Card>
        <CardHeader
          eyebrow="Review queue"
          title="Pending attestations"
          description="Mint and verification events awaiting your attestation. Challenge window: 7 days from issuance."
          action={
            <Input placeholder="Search…" className="h-8 w-48" leftIcon={<Search className="h-3.5 w-3.5" />} />
          }
        />
        {pending.length === 0 ? (
          <div className="p-5">
            <EmptyState
              illustration="activity"
              title="Queue is empty"
              description="All caught up. New mint events will appear here for your attestation."
            />
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {pending.map((e) => {
              const project = projects.find((p) => p.id === e.projectId);
              return (
                <li key={e.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={e.type === "Mint" ? "brand" : "iris"} size="sm">{e.type}</Badge>
                      <StatusPill status={e.status} />
                    </div>
                    <p className="mt-2 font-display text-[14px] font-semibold leading-tight text-white">
                      {project?.name} · {e.amount} tCO₂e
                    </p>
                    <p className="mt-1 font-mono text-[11px] leading-snug text-ink-400">
                      Tx {e.txHash.slice(0, 18)}… · {relativeTime(e.timestamp)} · {e.actor}
                    </p>
                    <p className="mt-2 text-[13.5px] leading-snug text-ink-300">{e.note}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                      Inspect
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<X className="h-3.5 w-3.5" />}
                      onClick={() => { sfx.error(); toast.error("Challenge submitted for review"); }}
                    >
                      Challenge
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<Check className="h-3.5 w-3.5" />}
                      onClick={() => { sfx.success(); toast.success("Attestation signed on-chain"); }}
                    >
                      Attest
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </Section>
  );
}

function Producers() {
  return (
    <Section>
      <Card>
        <CardHeader
          eyebrow="Producer registry"
          title="VCS001-registered producers"
          description="Reputation updates automatically based on attestation outcomes."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead className="border-b border-white/[0.05] text-left font-mono text-[9.5px] uppercase tracking-widest text-ink-500">
              <tr>
                <th className="px-5 py-3">Producer</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">VCS Cert</th>
                <th className="px-5 py-3 text-right">Credits Issued</th>
                <th className="px-5 py-3 text-right">Reputation</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {producers.map((p) => (
                <tr key={p.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="font-medium leading-tight text-white">{p.name}</div>
                    <div className="mt-0.5 font-mono text-[10.5px] leading-tight text-ink-400">{shortenAddress(p.wallet, 6)}</div>
                  </td>
                  <td className="px-5 py-3.5 leading-tight text-ink-300">{p.country}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] leading-tight text-ink-100">{p.vcsCert}</td>
                  <td className="px-5 py-3.5 text-right font-mono leading-tight text-ink-100">{formatNumber(p.creditsIssued)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ReputationBar value={p.reputation} />
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] leading-tight text-ink-400">{p.joinedAt}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="xs"
                      variant={p.verified ? "secondary" : "primary"}
                      onClick={() => {
                        if (p.verified) sfx.error(); else sfx.success();
                        toast.success(p.verified ? "Producer revoked" : "Producer verified");
                      }}
                    >
                      {p.verified ? "Revoke" : "Verify"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}

function ReputationBar({ value }) {
  const tone = value >= 90 ? "emerald" : value >= 75 ? "amber" : "rose";
  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn(
        "font-mono text-[12.5px] font-semibold leading-none tabular-nums",
        tone === "emerald" && "text-emerald-300",
        tone === "amber" && "text-amber-300",
        tone === "rose" && "text-rose-300",
      )}>
        {value}
      </span>
      <div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "emerald" && "bg-emerald-500",
            tone === "amber" && "bg-amber-500",
            tone === "rose" && "bg-rose-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Disputes() {
  return (
    <Section>
      <Card>
        <CardHeader
          eyebrow="Disputes"
          title="Active challenges"
          description="Mint events currently under verifier challenge. Resolution must occur within 14 days."
        />
        <div className="p-5 pt-0">
          <EmptyState
            illustration="activity"
            icon={Check}
            title="No active disputes"
            description="All mint events are currently within the standard 7-day challenge window."
          />
        </div>
      </Card>
    </Section>
  );
}

function Settings() {
  return (
    <Section>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-[15px] font-semibold leading-tight tracking-tight text-white">Protocol Parameters</h3>
          <div className="mt-4 space-y-3">
            <SettingRow label="Challenge Window" value="7 days" hint="Time for verifiers to dispute issuance" />
            <SettingRow label="Minimum Reputation Bond" value="1.00 ETH" hint="Required stake for producer registration" />
            <SettingRow label="Maximum Mint Batch" value="5,000 tCO₂e" hint="Per single transaction" />
            <SettingRow label="Protocol Fee" value="0.25%" hint="Treasury allocation per mint" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-[15px] font-semibold leading-tight tracking-tight text-white">Registry Bridges</h3>
          <div className="mt-4 space-y-3">
            {[
              { name: "Verra", status: "Live", tone: "success" },
              { name: "Gold Standard", status: "Live", tone: "warning" },
              { name: "CAR", status: "Live", tone: "iris" },
              { name: "ACR", status: "Beta", tone: "rose" },
              { name: "Puro.earth", status: "Pending", tone: "neutral" },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                <div>
                  <p className="text-[13.5px] font-medium leading-tight text-white">{r.name}</p>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">Cross-registry batch reconciliation</p>
                </div>
                <Badge tone={r.tone}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function SettingRow({ label, value, hint }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
      <div>
        <p className="text-[13.5px] font-medium leading-tight text-white">{label}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">{hint}</p>
      </div>
      <span className="font-mono text-[12.5px] text-emerald-300">{value}</span>
    </div>
  );
}
