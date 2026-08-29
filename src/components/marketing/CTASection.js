"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wallet, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTASection({ onConnect }) {
  return (
    <section className="section">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="surface-3 relative overflow-hidden rounded-2xl"
        >
          <div className="pointer-events-none absolute inset-0 dot-pattern opacity-20" />
          <div className="pointer-events-none absolute -left-1/4 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -right-1/4 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

          <div className="relative px-8 py-20 text-center sm:px-16 sm:py-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
              <Sparkles className="h-3 w-3" />
              Start in under 60 seconds
            </div>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.25rem]">
              Ship climate infrastructure
              <br />
              <span className="text-gradient-emerald">your CFO will believe.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.6] text-ink-300">
              Connect a wallet, register your VCS001 certificate, and mint your first
              verifiable credit. No vendor onboarding, no PDF audits, no waiting.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="xl" onClick={onConnect} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Connect Wallet
              </Button>
              <Button as={Link} href="/docs" size="xl" variant="secondary">
                Read the Docs
              </Button>
            </div>

            <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3">
              {[
                { icon: Wallet, label: "No install" },
                { icon: ShieldCheck, label: "Audited" },
                { icon: Globe, label: "38 countries" },
              ].map((b) => (
                <div key={b.label} className="flex items-center justify-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] py-2.5 text-[11px] text-ink-300">
                  <b.icon className="h-3 w-3 text-emerald-400" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
