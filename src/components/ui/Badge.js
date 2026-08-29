"use client";

import { cn } from "@/lib/utils";

const tones = {
  brand: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  iris: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  neutral: "border-white/[0.08] bg-white/[0.04] text-ink-200",
  outline: "border-white/15 bg-transparent text-ink-200",
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  danger: "border-rose-500/25 bg-rose-500/10 text-rose-300",
  info: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
};

// Heights match button heights: xs=20, sm=24, md=28, lg=32 — but slightly tighter for in-flow chips
const sizes = {
  xs: "h-5 px-1.5 text-[9px] gap-1 rounded",
  sm: "h-5 px-2 text-[10px] gap-1 rounded-md",
  md: "h-6 px-2.5 text-[11px] gap-1.5 rounded-md",
  lg: "h-7 px-3 text-[12px] gap-1.5 rounded-md",
};

export function Badge({
  tone = "neutral",
  size = "sm",
  icon: Icon,
  className,
  children,
  dot = false,
  uppercase = true,
  mono = true,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border font-medium tracking-wide leading-none",
        mono && "font-mono",
        uppercase && "uppercase",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              tone === "brand" || tone === "success" ? "bg-emerald-400" : "bg-current",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              tone === "brand" || tone === "success" ? "bg-emerald-400" : "bg-current",
            )}
          />
        </span>
      )}
      {Icon && !dot && <Icon className="h-2.5 w-2.5" strokeWidth={2} />}
      {children}
    </span>
  );
}

const statusMap = {
  Active: "success",
  Listed: "iris",
  Retired: "neutral",
  Challenged: "warning",
  Live: "success",
  Sold: "neutral",
  Cancelled: "danger",
  Pending: "warning",
  Success: "success",
  Failed: "danger",
  online: "success",
  offline: "neutral",
  degraded: "warning",
};

export function StatusPill({ status, className, dot = true }) {
  return (
    <Badge tone={statusMap[status] || "neutral"} size="sm" dot={dot} className={className}>
      {status}
    </Badge>
  );
}
