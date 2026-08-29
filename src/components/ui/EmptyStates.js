"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Leaf, Search, FileText, Activity, ShieldCheck, Inbox, Plug, Database,
  Bell, Key, Webhook, CreditCard, User,
} from "lucide-react";

// Custom illustrations for empty states
export function NoConnectionIllustration({ className }) {
  return (
    <svg viewBox="0 0 240 160" className={cn("h-32 w-auto", className)} aria-hidden>
      <defs>
        <linearGradient id="no-conn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1e1a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0c1e1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#no-conn-bg)" rx="12" />

      {/* Wallet */}
      <g transform="translate(60, 50)">
        <rect x="0" y="0" width="80" height="60" rx="6" fill="#0a1228" stroke="#1e293b" strokeWidth="1" />
        <rect x="60" y="22" width="14" height="16" rx="2" fill="#10b981" opacity="0.4" />
        <circle cx="67" cy="30" r="2" fill="#34d399" />
        <line x1="10" y1="14" x2="50" y2="14" stroke="#334155" strokeWidth="1" />
        <line x1="10" y1="24" x2="40" y2="24" stroke="#334155" strokeWidth="1" />
        <line x1="10" y1="34" x2="50" y2="34" stroke="#334155" strokeWidth="1" />
        <line x1="10" y1="44" x2="30" y2="44" stroke="#334155" strokeWidth="1" />
      </g>

      {/* Plug */}
      <g transform="translate(150, 70)">
        <rect x="0" y="0" width="36" height="24" rx="3" fill="#0a1228" stroke="#10b981" strokeWidth="1" />
        <rect x="2" y="-4" width="3" height="6" fill="#34d399" />
        <rect x="10" y="-4" width="3" height="6" fill="#34d399" />
        <path d="M 36 12 Q 50 12 50 0" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      </g>

      {/* Connection lines */}
      <path d="M 140 80 L 150 80" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4">
        <animate attributeName="stroke-dashoffset" from="0" to="6" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function NoSearchIllustration({ className }) {
  return (
    <svg viewBox="0 0 200 140" className={cn("h-28 w-auto", className)} aria-hidden>
      <defs>
        <linearGradient id="no-search-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1a2e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0c1a2e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill="url(#no-search-bg)" rx="12" />
      <g transform="translate(100, 70)">
        <circle cx="-6" cy="-6" r="22" fill="none" stroke="#475569" strokeWidth="2" />
        <line x1="10" y1="10" x2="24" y2="24" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <path d="M -16 -8 Q -10 -16 -2 -10" fill="none" stroke="#1e293b" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function NoProjectsIllustration({ className }) {
  return (
    <svg viewBox="0 0 240 160" className={cn("h-32 w-auto", className)} aria-hidden>
      <defs>
        <linearGradient id="no-prj-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#022c22" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#no-prj-bg)" rx="12" />
      {/* Tree silhouette */}
      <g transform="translate(120, 90)">
        <path d="M 0 0 L 0 -50" stroke="#065f46" strokeWidth="2" />
        <ellipse cx="0" cy="-60" rx="32" ry="22" fill="#064e3b" />
        <ellipse cx="-6" cy="-65" rx="20" ry="14" fill="#047857" />
        <ellipse cx="6" cy="-58" rx="14" ry="10" fill="#10b981" opacity="0.4" />
        {/* Small dots floating */}
        <circle cx="-20" cy="-30" r="1" fill="#34d399" opacity="0.6" />
        <circle cx="15" cy="-20" r="1" fill="#34d399" opacity="0.6" />
        <circle cx="-10" cy="-10" r="1" fill="#34d399" opacity="0.6" />
        <circle cx="20" cy="-40" r="1" fill="#34d399" opacity="0.6" />
      </g>
    </svg>
  );
}

export function NoActivityIllustration({ className }) {
  return (
    <svg viewBox="0 0 200 140" className={cn("h-28 w-auto", className)} aria-hidden>
      <defs>
        <linearGradient id="no-act-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0d2e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1a0d2e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill="url(#no-act-bg)" rx="12" />
      <g transform="translate(100, 70)">
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="0" cy="0" r="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

const illustrationMap = {
  connection: NoConnectionIllustration,
  search: NoSearchIllustration,
  projects: NoProjectsIllustration,
  activity: NoActivityIllustration,
};

const iconMap = {
  connection: Plug,
  search: Search,
  projects: Leaf,
  activity: Activity,
  inbox: Inbox,
  file: FileText,
  shield: ShieldCheck,
  database: Database,
  bell: Bell,
  key: Key,
  webhook: Webhook,
  card: CreditCard,
  user: User,
};

export function EmptyState({
  illustration = "search",
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  size = "default",
}) {
  const Illust = illustrationMap[illustration];
  const Icon = icon ? iconMap[icon] || icon : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 text-center",
        size === "lg" ? "py-16" : "py-10",
        className,
      )}
    >
      {Illust && <Illust className="mb-2" />}
      {Icon && !Illust && (
        <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-400">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <h3 className="mt-3 font-display text-[16px] font-semibold tracking-tight text-white sm:text-[17px]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ink-400">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
}
