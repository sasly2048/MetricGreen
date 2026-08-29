"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Info, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// -------------------------------------------------------------------------
// Confetti burst — for major success moments
// -------------------------------------------------------------------------
export function ConfettiBurst({ trigger, duration = 1800 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const next = Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 60 + Math.random() * 80;
      return {
        id: `${Date.now()}-${i}`,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rot: Math.random() * 720 - 360,
        color: ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#22d3ee"][i % 5],
        size: 4 + Math.random() * 6,
      };
    });
    const tick = setTimeout(() => setParticles(next), 0);
    const t = setTimeout(() => setParticles([]), duration);
    return () => {
      clearTimeout(tick);
      clearTimeout(t);
    };
  }, [trigger, duration]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4, rotate: p.rot }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute h-2 w-2 rounded-sm"
          style={{ background: p.color, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

// -------------------------------------------------------------------------
// Success ring — ripples outward on success
// -------------------------------------------------------------------------
export function SuccessRing({ trigger, color = "#10b981" }) {
  if (!trigger) return null;
  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.4, delay: i * 0.18, ease: "easeOut" }}
          className="absolute h-12 w-12 rounded-full border-2"
          style={{ borderColor: color }}
        />
      ))}
    </span>
  );
}

// -------------------------------------------------------------------------
// Status flash — top-of-screen toast for major events
// -------------------------------------------------------------------------
const flashIcons = {
  success: Check,
  warning: AlertTriangle,
  info: Info,
  error: AlertTriangle,
};

export function StatusFlash({ message, type = "success", onClose }) {
  if (!message) return null;
  const Icon = flashIcons[type] || Info;
  const tones = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    info: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.96 }}
        className={cn(
          "pointer-events-auto fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md shadow-2xl shadow-black/40",
          tones[type],
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-1 rounded-full p-0.5 opacity-60 transition hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// -------------------------------------------------------------------------
// Skeleton shimmer — used in cards/lists
// -------------------------------------------------------------------------
export function PulseDot({ color = "#10b981" }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <motion.span
        animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ background: color }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

// -------------------------------------------------------------------------
// Shimmer — animated background for loading slots
// -------------------------------------------------------------------------
export function Shimmer({ className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/[0.04] after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/[0.07] after:to-transparent after:animate-shimmer",
        className,
      )}
    />
  );
}

// -------------------------------------------------------------------------
// Check mark — animated success state
// -------------------------------------------------------------------------
export function AnimatedCheck({ size = 64 }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="grid place-items-center rounded-full bg-emerald-500/15"
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.path
          d="M 4 12 L 10 18 L 20 6"
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}

// -------------------------------------------------------------------------
// Counter — animates between numeric values
// -------------------------------------------------------------------------
export function AnimatedCounter({ value, duration = 800, className }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = typeof value === "number" ? value : parseFloat(value) || 0;
    const start = display;
    const startTime = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{typeof value === "number" && Number.isInteger(value) ? Math.round(display) : display.toFixed(2)}</span>;
}

// -------------------------------------------------------------------------
// BgGlow — soft pulse for hero metrics
// -------------------------------------------------------------------------
export function BgGlow({ color = "rgba(16, 185, 129, 0.15)" }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(circle at center, ${color}, transparent 60%)` }}
    />
  );
}
