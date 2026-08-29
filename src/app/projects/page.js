"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Plus, Search, SlidersHorizontal, MapPin, Leaf, ArrowUpRight, TrendingUp, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { CategoryArt } from "@/components/ui/CategoryArt";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/EmptyStates";
import { Page, PageHeader, Section, StatGrid } from "@/components/ui/Page";
import { projects, producers, networkStats } from "@/lib/data";
import { formatNumber, formatCurrency, cn } from "@/lib/utils";

const categories = ["All", "Reforestation", "Direct Air Capture", "Renewable Energy", "Blue Carbon", "Methane Capture", "Soil Sequestration"];
const registries = ["All", "Verra", "Gold Standard", "CAR", "ACR"];
const statuses = ["All", "Active", "Listed", "Retired"];

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [registry, setRegistry] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("issued");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = projects.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.projectId.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (registry !== "All") list = list.filter((p) => p.registry === registry);
    if (status !== "All") list = list.filter((p) => p.status === status);
    list.sort((a, b) => {
      if (sort === "issued") return b.totalIssued - a.totalIssued;
      if (sort === "retired") return b.totalRetired - a.totalRetired;
      if (sort === "price") return b.pricePerTonne - a.pricePerTonne;
      if (sort === "vintage") return b.vintage.localeCompare(a.vintage);
      return 0;
    });
    return list;
  }, [query, category, registry, status, sort]);

  const featured = projects[0];
  const featuredProducer = producers.find((p) => p.id === featured?.producerId);

  return (
    <Page>
      <PageHeader
        eyebrow="Projects"
        title="Verified carbon projects"
        description={`${filtered.length} of ${projects.length} projects · ${formatNumber(networkStats.totalCreditsIssued, { compact: true })} tCO₂e issued`}
        action={
          <>
            <Button variant="secondary" size="md" leftIcon={<SlidersHorizontal className="h-4 w-4" />} onClick={() => setShowFilters((s) => !s)}>
              Filters
            </Button>
            <Button as={Link} href="/projects/new" leftIcon={<Plus className="h-4 w-4" />} size="md">
              New Project
            </Button>
          </>
        }
      />

      <StatGrid cols={4}>
        <MetricCard label="Active Projects" value={formatNumber(projects.length)} icon={Leaf} tone="brand" />
        <MetricCard label="Total Issued" value={`${formatNumber(networkStats.totalCreditsIssued, { compact: true })} tCO₂e`} icon={TrendingUp} tone="iris" />
        <MetricCard label="Active Producers" value={formatNumber(networkStats.activeProducers)} icon={MapPin} tone="cyan" />
        <MetricCard label="Avg. Price" value={formatCurrency(networkStats.averagePrice)} icon={Leaf} tone="amber" />
      </StatGrid>

      {featured && (
        <Section>
          <Link href={`/projects/${featured.id}`} className="group block">
            <Card className="grid gap-0 overflow-hidden transition hover:border-white/10 lg:grid-cols-[1.4fr_1fr]">
              <CategoryArt category={featured.category} height="100%" className="min-h-[260px] lg:min-h-0" />
              <div className="flex flex-col justify-between gap-5 p-6 sm:p-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="iris" size="sm">Featured</Badge>
                    <Badge tone="neutral" size="sm">{featured.registry}</Badge>
                    <StatusPill status={featured.status} />
                  </div>
                  <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-[1.05] tracking-[-0.025em] text-white sm:text-[2rem]">
                    {featured.name}
                  </h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-ink-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {featured.location}
                  </p>
                  <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.6] text-ink-300">
                    {featured.description}
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-4 border-t border-white/[0.05] pt-4">
                    <Stat label="Issued" value={formatNumber(featured.totalIssued, { compact: true })} />
                    <Stat label="Retired" value={formatNumber(featured.totalRetired, { compact: true })} />
                    <Stat label="Price" value={formatCurrency(featured.pricePerTonne)} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 font-mono text-[10.5px] text-ink-500">
                    <Leaf className="h-3 w-3" />
                    <span>By {featuredProducer?.name}</span>
                    <ArrowUpRight className="ml-auto h-3 w-3 text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </Section>
      )}

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by project name, ID, or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>
          <SortMenu value={sort} onChange={setSort} />
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-5 border-t border-white/[0.05] pt-5 sm:grid-cols-3">
            <FilterChips label="Category" options={categories} value={category} onChange={setCategory} />
            <FilterChips label="Registry" options={registries} value={registry} onChange={setRegistry} />
            <FilterChips label="Status" options={statuses} value={status} onChange={setStatus} />
          </div>
        )}

        {(category !== "All" || registry !== "All" || status !== "All" || query) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.05] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Active:</span>
            {query && <ActiveChip onClear={() => setQuery("")}>&ldquo;{query}&rdquo;</ActiveChip>}
            {category !== "All" && <ActiveChip onClear={() => setCategory("All")}>{category}</ActiveChip>}
            {registry !== "All" && <ActiveChip onClear={() => setRegistry("All")}>{registry}</ActiveChip>}
            {status !== "All" && <ActiveChip onClear={() => setStatus("All")}>{status}</ActiveChip>}
            <button
              onClick={() => { setQuery(""); setCategory("All"); setRegistry("All"); setStatus("All"); }}
              className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 hover:text-emerald-200"
            >
              Clear all
            </button>
          </div>
        )}
      </Card>

      <Section>
        {filtered.length === 0 ? (
          <EmptyState
            illustration="search"
            title="No projects match your filters"
            description="Try adjusting your search criteria or clearing the filters to see all available projects."
            primaryAction={
              <Button onClick={() => { setQuery(""); setCategory("All"); setRegistry("All"); setStatus("All"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => {
              const prod = producers.find((p) => p.id === p.producerId);
              return (
                <Link key={p.id} href={`/projects/${p.id}`} className="group">
                  <Card className="h-full transition hover:border-white/10 hover:bg-ink-900/60">
                    <CategoryArt category={p.category} height={140} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-400 leading-none">{p.registry} · {p.projectId}</p>
                          <h3 className="mt-1.5 font-display text-[15.5px] font-semibold leading-tight tracking-tight text-white transition group-hover:text-emerald-300">
                            {p.name}
                          </h3>
                        </div>
                        <StatusPill status={p.status} />
                      </div>

                      <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-ink-400">
                        <MapPin className="h-3 w-3" />
                        {p.location}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/[0.05] py-3 text-center">
                        <Stat label="Issued" value={formatNumber(p.totalIssued, { compact: true })} />
                        <Stat label="Retired" value={formatNumber(p.totalRetired, { compact: true })} />
                        <Stat label="Available" value={formatNumber(p.available, { compact: true })} />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11.5px] leading-none">
                        <div>
                          <p className="text-ink-500">Vintage</p>
                          <p className="mt-1 font-mono text-ink-100">{p.vintage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-ink-500">Price</p>
                          <p className="mt-1 font-mono text-ink-100">{formatCurrency(p.pricePerTonne)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-ink-500 leading-none">
                        <Leaf className="h-3 w-3" />
                        {prod?.name || "Anonymous Producer"}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </Page>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[8.5px] uppercase tracking-widest text-ink-500 leading-none">{label}</p>
      <p className="mt-1.5 font-display text-[13px] font-semibold leading-none text-white">{value}</p>
    </div>
  );
}

function SortMenu({ value, onChange }) {
  const opts = [
    { id: "issued", label: "Most Issued" },
    { id: "retired", label: "Most Retired" },
    { id: "price", label: "Highest Price" },
    { id: "vintage", label: "Newest Vintage" },
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

function FilterChips({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-500 leading-none">{label}</p>
      <div className="flex flex-wrap gap-1.5">
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
    </div>
  );
}

function ActiveChip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10.5px] text-emerald-300">
      {children}
      <button onClick={onClear} className="opacity-60 hover:opacity-100">
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}
