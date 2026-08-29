"use client";

import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { Github, Twitter, Globe, BookOpen, Send } from "lucide-react";

const groups = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Overview" },
      { href: "/how-it-works", label: "How it Works" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/projects", label: "Projects" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/security", label: "Security" },
      { href: "/docs#contracts", label: "Smart Contracts" },
      { href: "/docs#api", label: "API Reference" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/audit", label: "Audit Trail" },
      { href: "/docs#methodology", label: "Methodology" },
      { href: "/docs#faq", label: "FAQ" },
      { href: "/docs#whitepaper", label: "Whitepaper" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/docs#about", label: "About" },
      { href: "/docs#contact", label: "Contact" },
      { href: "/docs#careers", label: "Careers" },
      { href: "/docs#legal", label: "Legal" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.04] bg-ink-1000">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="mx-auto max-w-[88rem] px-6 py-16 lg:px-10">
        <div className="mb-14 grid gap-6 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 sm:grid-cols-[1.5fr_1fr] sm:items-center sm:p-7">
          <div>
            <h3 className="font-display text-[16px] font-semibold leading-tight tracking-tight text-white">Subscribe to the protocol digest</h3>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-400">Monthly. Governance, methodology updates, and notable mints. No spam.</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@organization.com"
              className="h-10 flex-1 rounded-md border border-white/10 bg-white/[0.02] px-3 text-[13px] text-white placeholder:text-ink-500 focus:border-emerald-500/40 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-3.5 text-[13px] font-semibold text-emerald-950 transition hover:from-emerald-300 hover:to-emerald-500"
            >
              <Send className="h-3.5 w-3.5" />
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <BrandMark size={36} />
            <p className="mt-5 max-w-xs text-[13px] leading-[1.6] text-ink-400">
              The institutional-grade protocol for issuing, trading, and permanently retiring
              verifiable carbon credits on a decentralized ledger.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { Icon: Github, label: "GitHub" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Globe, label: "Website" },
                { Icon: BookOpen, label: "Docs" },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-ink-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  <s.Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-[12.5px] font-semibold leading-none tracking-tight text-white">{group.title}</h3>
              <ul className="mt-5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.04] pt-7 text-[12px] text-ink-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} MetricGreen Labs. Built for transparent climate markets.
          </p>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Mainnet: Sepolia
            </span>
            <span>v1.0.0 · {new Date().toISOString().slice(0, 10)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
