"use client";

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  as: Comp = "div",
  variant = "default",
  ...props
}) {
  const variants = {
    default: "border border-white/[0.06] bg-ink-900/40 backdrop-blur-md",
    flat: "border border-white/[0.06] bg-white/[0.015]",
    inset: "border border-white/[0.06] bg-black/30",
    glow: "border border-emerald-500/20 bg-emerald-500/[0.02] shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]",
  };

  return (
    <Comp
      className={cn(
        "relative overflow-hidden rounded-2xl transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({
  className,
  title,
  description,
  action,
  eyebrow,
  icon: Icon,
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 pb-4", className)}>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            {Icon && <Icon className="h-3 w-3" />}
            <span>{eyebrow}</span>
          </div>
        )}
        {title && (
          <h3 className="font-display text-[15px] font-semibold leading-tight tracking-tight text-white">
            {title}
          </h3>
        )}
        {description && <p className="mt-1 text-[12.5px] leading-relaxed text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn("p-5 pt-0", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn("flex items-center gap-3 border-t border-white/[0.06] p-4", className)}>
      {children}
    </div>
  );
}
