"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Leaf,
  ShoppingBag,
  Activity,
  ShieldCheck,
  Settings,
  Plus,
  FileText,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/demo-state";
import { BrandMark } from "@/components/site/BrandMark";

const groups = [
  {
    title: "Operate",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/projects", label: "Projects", icon: Leaf },
      { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    ],
  },
  {
    title: "Verify",
    items: [
      { href: "/audit", label: "Audit Trail", icon: Activity },
      { href: "/admin", label: "Verifier Console", icon: ShieldCheck },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/docs", label: "Documentation", icon: FileText },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { wallet } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#0a1020] text-white shadow-2xl shadow-black/40 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-white/[0.04] bg-ink-1000/40 backdrop-blur-md lg:block">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="px-2 pb-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-500">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((it) => {
                    const active = pathname === it.href || (it.href !== "/dashboard" && pathname?.startsWith(it.href));
                    return (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium tracking-tight transition",
                            active
                              ? "bg-white/[0.06] text-white"
                              : "text-ink-300 hover:bg-white/[0.03] hover:text-white",
                          )}
                        >
                          <it.icon
                            className={cn(
                              "h-3.5 w-3.5 transition",
                              active ? "text-emerald-400" : "text-ink-400 group-hover:text-ink-200",
                            )}
                          />
                          {it.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.04] p-4">
            <Link
              href="/projects/new"
              className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-3 py-2 text-[13px] font-semibold text-emerald-950 transition hover:from-emerald-300 hover:to-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Mint Credit
            </Link>

            {wallet.address && (
              <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-widest text-ink-500">
                  <Wallet className="h-3 w-3" />
                  Connected
                </div>
                <p className="mt-1 truncate font-mono text-[12px] text-ink-200">
                  {wallet.ensName || wallet.address.slice(0, 10) + "…"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-72 border-r border-white/[0.04] bg-ink-1000 p-4"
            >
              <div className="mb-6 flex items-center justify-between">
                <BrandMark size={28} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-1.5 text-ink-300 transition hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.title}>
                    <p className="px-2 pb-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-500">
                      {group.title}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((it) => {
                        const active = pathname === it.href || (it.href !== "/dashboard" && pathname?.startsWith(it.href));
                        return (
                          <li key={it.href}>
                            <Link
                              href={it.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium tracking-tight transition",
                                active
                                  ? "bg-white/[0.06] text-white"
                                  : "text-ink-300 hover:bg-white/[0.03] hover:text-white",
                              )}
                            >
                              <it.icon className={cn("h-3.5 w-3.5", active ? "text-emerald-400" : "text-ink-400")} />
                              {it.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
