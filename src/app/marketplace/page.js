"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Flame, ShoppingBag, ArrowUpDown, Sparkles, ShieldCheck, ArrowUpRight, MapPin, Activity, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyStates";
import { Page, PageHeader, Section, StatGrid } from "@/components/ui/Page";
import { PulseDot } from "@/components/ui/MicroInteractions";
import { PurchaseDialog } from "@/components/marketplace/PurchaseDialog";
import { listings, projects } from "@/lib/data";
import { formatNumber, formatCurrency, cn, relativeTime } from "@/lib/utils";

const registries = ["All", "Verra", "Gold Standard", "CAR", "ACR"];

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [registry, setRegistry] = useState("All");
  const [sort, setSort] = useState("price-asc");
  const [purchase, setPurchase] = useState(null);

  const live = useMemo(() => listings.filter((l) => l.status === "Live"), []);

  const filtered = useMemo(() => {
    let list = live.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((l) => {
        const p = projects.find((p) => p.id === l.projectId);
        return p?.name.toLowerCase().includes(q) || p?.location.toLowerCase().includes(q) || p?.projectId.toLowerCase().includes(q);
      });
    }
    if (registry !== "All") list = list.filter((l) => l.registry === registry);
    list.sort((a, b) => {
      if (sort === "price-asc") return a.pricePerTonne - b.pricePerTonne;
      if (sort === "price-desc") return b.pricePerTonne - a.pricePerTonne;
      if (sort === "amount") return b.amount - a.amount;
      if (sort === "vintage") return b.vintage.localeCompare(a.vintage);
      return 0;
    });
    return list;
  }, [query, registry, sort, live]);

  const stats = {
    volume: live.reduce((s, l) => s + l.amount * l.pricePerTonne, 0),
    tonnes: live.reduce((s, l) => s + l.amount, 0),
    listings: live.length,
    avgPrice: live.length ? live.reduce((s, l) => s + l.pricePerTonne, 0) / live.length : 0,
  };

  const recent = live.slice(0, 3);

  return (
    <Page>
      <PageHeader
        eyebrow="Marketplace"
        title="Verified carbon credits"
        description={
          <span className="flex items-center gap-2">
            <PulseDot color="#10b981" />
            Every listing is cross-checked against its registry batch and ZK-proofed telemetry.
          </span>
        }
        action={
          <>
            <Button as={Link} href="/projects" variant="secondary" size="md">Browse Projects</Button>
            <Button leftIcon={<Sparkles className="h-4 w-4" />} size="md">List Credit</Button>
          </>
        }
      />

      <StatGrid cols={4}>
        <MetricCard label="Volume (live)" value={formatCurrency(stats.volume, "USD", { compact: true })} delta="+18.2%" icon={ShoppingBag} tone="brand" />
        <MetricCard label="Tonnes listed" value={formatNumber(stats.tonnes, { compact: true })} delta="+12" icon={Flame} tone="iris" />
        <MetricCard label="Active listings" value={stats.listings} delta="+2" icon={Activity} tone="cyan" />
        <MetricCard label="Avg. price" value={formatCurrency(stats.avgPrice)} delta="-0.4%" trend="down" icon={ShieldCheck} tone="amber" />
      </StatGrid>

      {recent.length > 0 && (
        <Section>
          <Card className="overflow-hidden p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="eyebrow text-emerald-300/90">Recent activity</p>
                <h2 className="mt-2 font-display text-[18px] font-semibold leading-tight tracking-tight text-white">Just listed</h2>
              </div>
              <Badge tone="brand" dot>Live</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {recent.map((l) => {
                const p = projects.find((p) => p.id === l.projectId);
                if (!p) return null;
                return (
                  <Link
                    key={l.id}
                    href={`/projects/${p.id}`}
                    className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-emerald-300">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium leading-tight text-white">{p.name}</p>
                        <p className="mt-0.5 text-[11.5px] text-ink-400">{formatNumber(l.amount)} tCO₂e · {formatCurrency(l.pricePerTonne)}</p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-ink-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </Section>
      )}

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by project, location, or registry ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterChips options={registries} value={registry} onChange={setRegistry} />
            <SortMenu value={sort} onChange={setSort} />
          </div>
        </div>
      </Card>

      <Section>
        {filtered.length === 0 ? (
          <EmptyState
            illustration="search"
            title="No listings match your filters"
            description="Try clearing filters or check back soon — new batches are minted every hour."
            primaryAction={
              <Button onClick={() => { setQuery(""); setRegistry("All"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((l) => {
              const project = projects.find((p) => p.id === l.projectId);
              if (!project) return null;
              return (
                <Card
                  key={l.id}
                  className="group overflow-hidden transition hover:border-white/10 hover:bg-ink-900/60"
                >
                  <Link href={`/projects/${project.id}`}>
                    <CategoryArt category={project.category} height={140} />
                  </Link>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400 leading-none">{l.registry} · {project.projectId}</p>
                        <Link href={`/projects/${project.id}`} className="mt-1.5 block">
                          <h3 className="truncate font-display text-[15.5px] font-semibold leading-tight tracking-tight text-white transition group-hover:text-emerald-300">
                            {project.name}
                          </h3>
                        </Link>
                      </div>
                      <StatusPill status={l.status} />
                    </div>
                    <p className="mt-1.5 flex items-center gap-1 truncate text-[11.5px] text-ink-400">
                      <MapPin className="h-3 w-3" /> {project.location}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-y border-white/[0.05] py-3">
                      <div>
                        <p className="font-mono text-[8.5px] uppercase tracking-widest text-ink-500 leading-none">Amount</p>
                        <p className="mt-1.5 font-display text-[15px] font-semibold leading-none text-white">{formatNumber(l.amount)} tCO₂e</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[8.5px] uppercase tracking-widest text-ink-500 leading-none">Price</p>
                        <p className="mt-1.5 font-display text-[15px] font-semibold leading-none text-emerald-300">{formatCurrency(l.pricePerTonne)}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-ink-500 leading-none">
                      <span>Vintage {l.vintage}</span>
                      <span>{relativeTime(l.listedAt)}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button as={Link} href={`/projects/${project.id}`} variant="secondary" size="sm" className="flex-1">
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => setPurchase({ listing: l, project })}
                        leftIcon={<ShoppingBag className="h-3.5 w-3.5" />}
                      >
                        Purchase
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <PurchaseDialog target={purchase} onClose={() => setPurchase(null)} />
    </Page>
  );
}

function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wider transition",
            value === o
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/15 hover:text-white",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function SortMenu({ value, onChange }) {
  const opts = [
    { id: "price-asc", label: "Price ↑" },
    { id: "price-desc", label: "Price ↓" },
    { id: "amount", label: "Amount" },
    { id: "vintage", label: "Vintage" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.02] p-1">
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-wider transition",
            value === o.id ? "bg-white/[0.06] text-white" : "text-ink-400 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
