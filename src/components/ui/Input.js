"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(function Input(
  { className, label, hint, error, leftIcon, rightIcon, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-400"
        >
          <span>{label}</span>
        </label>
      )}
      <div
        className={cn(
          "group flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.02] px-3 transition focus-within:border-emerald-500/40 focus-within:bg-emerald-500/[0.02] hover:border-white/[0.12]",
          error && "border-rose-500/40 focus-within:border-rose-500/60",
        )}
      >
        {leftIcon && <span className="text-ink-500 [&_svg]:size-3.5">{leftIcon}</span>}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-9 w-full bg-transparent text-[13px] text-white placeholder:text-ink-500 focus:outline-none",
            className,
          )}
          {...props}
        />
        {rightIcon && <span className="text-ink-500 [&_svg]:size-3.5">{rightIcon}</span>}
      </div>
      {(hint || error) && (
        <p className={cn("text-[11px] leading-tight", error ? "text-rose-400" : "text-ink-500")}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { className, label, hint, error, id, rows = 4, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-400"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-md border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] text-white placeholder:text-ink-500 transition focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:outline-none",
          error && "border-rose-500/40",
          className,
        )}
        {...props}
      />
      {(hint || error) && (
        <p className={cn("text-[11px] leading-tight", error ? "text-rose-400" : "text-ink-500")}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

export function Select({ className, label, hint, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-400">
          {label}
        </label>
      )}
      <select
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-white/[0.07] bg-white/[0.02] px-3 pr-9 text-[13px] text-white transition focus:border-emerald-500/40 focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {hint && <p className="text-[11px] leading-tight text-ink-500">{hint}</p>}
    </div>
  );
}
