"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Volume2, VolumeX, Command } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { WalletButton } from "./WalletButton";
import { useDemoState } from "@/lib/demo-state";
import { cn } from "@/lib/utils";
import { sfx, getAudioSettings, setAudioEnabled } from "@/lib/sfx";

const marketingNav = [
  { href: "/", label: "Overview" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

const appNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/audit", label: "Audit" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { state } = useDemoState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(getAudioSettings().enabled);

  const isAppRoute = pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/projects") ||
    pathname?.startsWith("/marketplace") ||
    pathname?.startsWith("/audit") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/settings");
  const nav = isAppRoute ? appNav : marketingNav;

  useEffect(() => {
    const handle = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(handle);
  }, [pathname]);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioEnabled(next);
    setAudioOn(next);
    if (next) sfx.click();
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-white/[0.04] bg-ink-1000/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-8 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <BrandMark size={32} />
            </Link>

            <nav className="hidden items-center gap-0.5 md:flex">
              {nav.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-[13.5px] font-medium tracking-tight transition-colors",
                      active ? "text-white" : "text-ink-300 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("mg:open-command"))}
              className="hidden items-center gap-3 rounded-md border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5 text-[12.5px] text-ink-400 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-ink-200 lg:flex"
              aria-label="Open command menu"
            >
              <Search className="h-3 w-3" />
              <span>Search</span>
              <kbd className="flex items-center gap-0.5 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9.5px] text-ink-400">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            <button
              onClick={toggleAudio}
              className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/[0.05] bg-white/[0.02] text-ink-400 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-ink-200 md:flex"
              aria-label={audioOn ? "Mute sound effects" : "Enable sound effects"}
              title={audioOn ? "Mute" : "Unmute"}
            >
              {audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            <WalletButton />

            <button
              className="rounded-md p-2 text-ink-300 transition hover:bg-white/5 hover:text-white md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-b border-white/[0.04] bg-ink-1000/95 backdrop-blur-xl md:hidden"
          >
            <nav className="space-y-0.5 p-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2.5 text-[13.5px] font-medium tracking-tight transition",
                    pathname === item.href
                      ? "bg-white/[0.05] text-white"
                      : "text-ink-300 hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
