"use client";

import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const tones = {
  brand: { tint: "from-emerald-500/10", icon: "text-emerald-300", bar: "bg-emerald-500/50" },
  iris: { tint: "from-indigo-500/10", icon: "text-indigo-300", bar: "bg-indigo-500/50" },
  amber: { tint: "from-amber-500/10", icon: "text-amber-300", bar: "bg-amber-500/50" },
  rose: { tint: "from-rose-500/10", icon: "text-rose-300", bar: "bg-rose-500/50" },
  cyan: { tint: "from-cyan-500/10", icon: "text-cyan-300", bar: "bg-cyan-500/50" },
  violet: { tint: "from-violet-500/10", icon: "text-violet-300", bar: "bg-violet-500/50" },
};

export function MetricCard({
  label,
  value,
  delta,
  trend = "up",
  hint,
  icon: Icon,
  tone = "brand",
  loading,
  spark,
}) {
  const t = tones[tone] || tones.brand;
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-ink-400";

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-ink-900/40 p-5 backdrop-blur-md"
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          t.tint,
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            {label}
          </p>
          {Icon && (
            <div
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/[0.06] bg-white/[0.02]",
                t.icon,
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </div>
          )}
        </div>

        <div className="mt-3">
          {loading ? (
            <div className="h-8 w-32 animate-pulse rounded bg-white/[0.05]" />
          ) : (
            <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.025em] text-white">
              {value}
            </p>
          )}
        </div>

        {(delta || hint) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px]">
            {delta && (
              <span className={cn("inline-flex items-center gap-0.5 font-mono font-medium", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                {delta}
              </span>
            )}
            {hint && <span className="text-ink-500">{hint}</span>}
          </div>
        )}

        {spark && <div className="mt-4 -mb-1">{spark}</div>}
      </div>
    </motion.div>
  );
}
