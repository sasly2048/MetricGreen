"use client";

import { useState, useMemo } from "react";
import { Search, Download, ExternalLink, Hash, Clock, Activity, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyStates";
import { Page, PageHeader, Section, StatGrid } from "@/components/ui/Page";
import { MetricCard } from "@/components/ui/MetricCard";
import { PulseDot } from "@/components/ui/MicroInteractions";
import { events, projects } from "@/lib/data";
import { formatNumber, formatDate, relativeTime, shortenTx, cn } from "@/lib/utils";

const eventTypes = ["All", "Mint", "Retire", "Register", "List", "Purchase", "Challenge", "Verify", "Revoke"];

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = events.slice();
    if (type !== "All") list = list.filter((e) => e.type === type);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.txHash.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q) ||
          e.note.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, type]);

  const liveCount = events.filter((e) => e.status !== "Pending").length;
  const pendingCount = events.filter((e) => e.status === "Pending").length;

  return (
    <Page>
      <PageHeader
        eyebrow="Audit Trail"
        title="On-chain transparency"
        description={
          <span className="flex items-center gap-2">
            <PulseDot color="#10b981" />
            Live · {liveCount} confirmed · {pendingCount} pending
          </span>
        }
        action={
          <>
            <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />} size="md">Export CSV</Button>
            <Button leftIcon={<ExternalLink className="h-4 w-4" />} size="md">Block Explorer</Button>
          </>
        }
      />

      <StatGrid cols={4}>
        <MetricCard label="Total Events" value={formatNumber(events.length * 1247, { compact: true })} icon={Hash} />
        <MetricCard label="24h Volume" value={liveCount} icon={Clock} />
        <MetricCard label="Avg. Block Time" value="12.4s" icon={Activity} />
        <MetricCard
          label="Pending"
          value={pendingCount}
          icon={Activity}
          tone={pendingCount > 0 ? "amber" : "brand"}
        />
      </StatGrid>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by tx hash, actor, or note…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {eventTypes.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wider transition",
                  type === t
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/15 hover:text-white",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Section>
        {filtered.length === 0 ? (
          <EmptyState
            illustration="search"
            title="No events match your filters"
            description="Adjust the event type or clear the search to see all on-chain activity."
            primaryAction={
              <Button onClick={() => { setQuery(""); setType("All"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="hidden border-b border-white/[0.05] bg-white/[0.02] px-5 py-3 font-mono text-[9.5px] uppercase tracking-widest text-ink-500 sm:grid sm:grid-cols-[100px_1fr_120px_120px_90px] sm:gap-4">
              <div>Type</div>
              <div>Hash · Detail</div>
              <div>Block</div>
              <div>When</div>
              <div className="text-right">Status</div>
            </div>

            <ul className="divide-y divide-white/[0.04]">
              {filtered.map((e) => {
                const project = projects.find((p) => p.id === e.projectId);
                const isOpen = expanded === e.id;
                return (
                  <li key={e.id}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : e.id)}
                      className="grid w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-white/[0.02] sm:grid-cols-[100px_1fr_120px_120px_90px] sm:gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <EventTypeBadge type={e.type} />
                        {isOpen ? <ChevronDown className="h-3 w-3 text-ink-500" /> : <ChevronRight className="h-3 w-3 text-ink-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[12.5px] text-white leading-tight">{shortenTx(e.txHash, 6)}</p>
                        <p className="mt-0.5 truncate text-[11.5px] text-ink-400">
                          {project ? project.name + " · " : ""}{e.note}
                        </p>
                      </div>
                      <div className="hidden font-mono text-[11.5px] text-ink-300 leading-tight sm:block">{e.blockNumber}</div>
                      <div className="hidden font-mono text-[11px] text-ink-400 leading-tight sm:block">{relativeTime(e.timestamp)}</div>
                      <div className="hidden text-right sm:block">
                        <StatusPill status={e.status} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-white/[0.04] bg-white/[0.01] p-5 sm:px-8">
                        <div className="grid gap-6 lg:grid-cols-2">
                          <div>
                            <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">Transaction</p>
                            <div className="mt-2 space-y-1.5 text-[13px]">
                              <KV k="Hash" v={e.txHash} mono />
                              <KV k="Block" v={e.blockNumber} mono />
                              <KV k="Type" v={e.type} />
                              <KV k="Status" v={e.status} />
                              <KV k="Timestamp" v={formatDate(e.timestamp, { full: true })} />
                            </div>
                          </div>
                          <div>
                            <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">Event Payload</p>
                            <div className="mt-2 space-y-1.5 text-[13px]">
                              <KV k="Actor" v={e.actor} mono />
                              <KV k="Project" v={project ? `${project.name} (${project.projectId})` : "—"} />
                              <KV k="Credit ID" v={e.creditId || "—"} mono />
                              <KV k="Amount" v={e.amount ? `${formatNumber(e.amount)} tCO₂e` : "—"} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                            View on Etherscan
                          </Button>
                          <Button size="sm">Recompute Proof</Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </Section>
    </Page>
  );
}

function EventTypeBadge({ type }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest",
        type === "Mint" && "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        type === "Retire" && "border-rose-500/25 bg-rose-500/10 text-rose-300",
        type === "Register" && "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
        type === "List" && "border-amber-500/25 bg-amber-500/10 text-amber-300",
        type === "Purchase" && "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
        type === "Challenge" && "border-amber-500/25 bg-amber-500/10 text-amber-300",
        type === "Verify" && "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        type === "Revoke" && "border-rose-500/25 bg-rose-500/10 text-rose-300",
      )}
    >
      {type}
    </span>
  );
}

function KV({ k, v, mono }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] py-1.5 last:border-0">
      <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-500">{k}</span>
      <span className={cn("text-[12.5px] text-ink-100 truncate", mono && "font-mono")}>{v}</span>
    </div>
  );
}
