"use client";

import { cn } from "@/lib/utils";

/**
 * Page — top-level wrapper that establishes the consistent vertical rhythm,
 * max-width, padding, and section spacing used across the app.
 */
export function Page({ children, className, size = "default" }) {
  const sizes = {
    default: "max-w-7xl",
    wide: "max-w-[88rem]",
    narrow: "max-w-4xl",
  };
  return (
    <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12", className)}>
      <div className={cn("mx-auto w-full", sizes[size])}>{children}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}) {
  return (
    <header className={cn("mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end", className)}>
      <div className="min-w-0 flex-1 max-w-2xl">
        {eyebrow && (
          <p className="eyebrow text-ink-400">
            <span className="h-px w-6 bg-current opacity-40" />
            <span>{eyebrow}</span>
          </p>
        )}
        <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.375rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </header>
  );
}

export function Section({ children, className }) {
  return <section className={cn("mt-10 first:mt-0", className)}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, description, action, className }) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="eyebrow text-ink-400">
            <span>{eyebrow}</span>
          </p>
        )}
        {title && (
          <h2 className="mt-2 font-display text-[18px] font-semibold leading-[1.2] tracking-[-0.015em] text-white">
            {title}
          </h2>
        )}
        {description && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Divider({ className }) {
  return <div className={cn("h-px w-full bg-white/[0.05]", className)} />;
}

export function StatGrid({ children, className, cols = 4 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };
  return <div className={cn("grid gap-4", gridCols[cols] || gridCols[4], className)}>{children}</div>;
}
