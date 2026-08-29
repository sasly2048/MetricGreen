"use client";

import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sfx";

const variants = {
  primary:
    "bg-gradient-to-b from-emerald-400 to-emerald-600 text-emerald-950 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(16,185,129,0.2)] hover:from-emerald-300 hover:to-emerald-500",
  secondary:
    "bg-white/[0.04] text-white border border-white/10 hover:bg-white/[0.07] hover:border-white/15",
  ghost: "text-ink-200 hover:text-white hover:bg-white/[0.04]",
  outline:
    "border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/[0.06] hover:border-emerald-500/40",
  danger:
    "bg-rose-500/10 text-rose-300 border border-rose-500/25 hover:bg-rose-500/15 hover:border-rose-500/40",
  dark: "bg-ink-900 text-white border border-white/10 hover:bg-ink-800 hover:border-white/15",
};

// Carefully proportioned: each size is a 4px step. Heights match icon sizes exactly.
const sizes = {
  xs: "h-7 px-2.5 text-[11px] gap-1.5 rounded-md [&_svg]:size-3",
  sm: "h-8 px-3 text-[12.5px] gap-1.5 rounded-lg [&_svg]:size-3.5",
  md: "h-9 px-3.5 text-[13px] gap-2 rounded-lg [&_svg]:size-3.5",
  lg: "h-11 px-5 text-[14px] gap-2 rounded-xl [&_svg]:size-4",
  xl: "h-12 px-6 text-[15px] gap-2.5 rounded-xl [&_svg]:size-4",
};

export const Button = forwardRef(function Button(
  {
    as: Comp = "button",
    variant = "primary",
    size = "md",
    className,
    children,
    leftIcon,
    rightIcon,
    loading,
    loadingText,
    disabled,
    sound = true,
    onClick,
    ...props
  },
  ref,
) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!ripples.length) return;
    const t = setTimeout(() => setRipples([]), 600);
    return () => clearTimeout(t);
  }, [ripples]);

  const handleClick = (e) => {
    if (disabled || loading) return;
    if (sound && variant === "primary") sfx.click();
    if (Comp === "button") {
      const rect = e.currentTarget.getBoundingClientRect();
      const r = {
        id: Date.now() + Math.random(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setRipples((arr) => [...arr, r]);
    }
    onClick?.(e);
  };

  return (
    <Comp
      ref={ref}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={cn(
        "group relative isolate inline-flex items-center justify-center overflow-hidden font-medium tracking-tight whitespace-nowrap transition-[transform,background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1000 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        pressed && !disabled && !loading && "scale-[0.97]",
        className,
      )}
      {...props}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{ left: r.x - 6, top: r.y - 6, width: 12, height: 12 }}
        />
      ))}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-2"
          >
            <Spinner />
            {loadingText || children}
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-2"
          >
            {leftIcon}
            <span className="truncate">{children}</span>
            {rightIcon}
          </motion.span>
        )}
      </AnimatePresence>
    </Comp>
  );
});

function Spinner() {
  return (
    <span className="relative inline-flex h-3.5 w-3.5">
      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path d="M 12 3 A 9 9 0 0 1 21 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}
