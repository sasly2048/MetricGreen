"use client";

import { cn } from "@/lib/utils";
import { EmptyState as NewEmptyState } from "./EmptyStates";

export { NewEmptyState as EmptyState } from "./EmptyStates";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.04]",
        "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/[0.06] after:to-transparent after:animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export function DataRow({ label, value, mono = true, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 py-2",
        onClick && "cursor-pointer rounded px-2 -mx-2 hover:bg-white/[0.03] transition",
        className,
      )}
    >
      <span className="text-[12px] text-ink-400">{label}</span>
      <span className={cn("text-[12.5px] text-ink-100", mono && "font-mono")}>{value || "—"}</span>
    </div>
  );
}

export function Divider({ className }) {
  return <div className={cn("h-px w-full bg-white/[0.06]", className)} />;
}

export function KeyValueList({ items, className }) {
  return (
    <div className={cn("divide-y divide-white/[0.04]", className)}>
      {items.map((it) => (
        <DataRow key={it.label} {...it} />
      ))}
    </div>
  );
}

export function ProgressBar({ value, max = 100, tone = "brand" }) {
  const pct = Math.min(100, (value / max) * 100);
  const tones = {
    brand: "bg-emerald-500/60",
    amber: "bg-amber-500/60",
    rose: "bg-rose-500/60",
    iris: "bg-indigo-500/60",
  };
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
      <div className={cn("h-full rounded-full transition-all", tones[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
