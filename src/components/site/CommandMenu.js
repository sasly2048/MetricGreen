"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Search,
  Wallet,
  LayoutDashboard,
  Leaf,
  Activity,
  Shield,
  Code,
  Settings,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onCustom = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("mg:open-command", onCustom);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("mg:open-command", onCustom);
    };
  }, []);

  const run = (fn) => {
    setOpen(false);
    setTimeout(fn, 50);
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Projects", icon: Leaf, href: "/projects" },
    { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
    { label: "Audit trail", icon: Activity, href: "/audit" },
    { label: "Admin", icon: Shield, href: "/admin" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Documentation", icon: Code, href: "/docs" },
  ];

  const quickActions = [
    { label: "Mint new credit", icon: Sparkles, href: "/projects/new" },
    { label: "Browse marketplace", icon: ShoppingBag, href: "/marketplace" },
    { label: "View audit trail", icon: Activity, href: "/audit" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-md sm:pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a1020]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Global command menu" className="w-full text-white">
              <div className="flex items-center border-b border-white/[0.05] px-4">
                <Search className="mr-3 h-4 w-4 text-ink-500" />
                <Command.Input
                  autoFocus
                  placeholder="Search, jump, or run a command…"
                  className="w-full bg-transparent py-4 text-[15px] text-white outline-none placeholder:text-ink-500"
                />
                <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-widest text-ink-400">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[55vh] overflow-y-auto p-2">
                <Command.Empty className="py-12 text-center text-[13px] text-ink-500">
                  No results. Try another query.
                </Command.Empty>

                <Command.Group heading="Navigate" className="px-1 pb-2">
                  {navItems.map((item) => (
                    <Command.Item
                      key={item.label}
                      onSelect={() => run(() => router.push(item.href))}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] text-ink-200 aria-selected:bg-white/[0.06] aria-selected:text-white"
                    >
                      <item.icon className="h-4 w-4 text-ink-400" />
                      {item.label}
                      <ArrowRight className="ml-auto h-3 w-3 text-ink-500" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Quick actions" className="px-1 pb-2">
                  {quickActions.map((item) => (
                    <Command.Item
                      key={item.label}
                      onSelect={() => run(() => router.push(item.href))}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] text-ink-200 aria-selected:bg-white/[0.06] aria-selected:text-white"
                    >
                      <item.icon className="h-4 w-4 text-emerald-400" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between border-t border-white/[0.05] bg-white/[0.015] px-4 py-2.5 text-[10.5px] text-ink-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-ink-300">↑</kbd>
                    <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-ink-300">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-ink-300">↵</kbd>
                    select
                  </span>
                </div>
                <span className="flex items-center gap-1.5">
                  Powered by <span className="font-semibold text-ink-300">MetricGreen</span>
                </span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
