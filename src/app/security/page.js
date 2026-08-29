"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Key, Eye, FileCheck, Bug, Mail, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CredentialBadge } from "@/components/ui/Illustrations";
import { Page, PageHeader, Section } from "@/components/ui/Page";

const audits = [
  { firm: "Trail of Bits", date: "Q1 2026", scope: "Full protocol, focus on retirement logic", status: "Completed" },
  { firm: "OpenZeppelin", date: "Q2 2026", scope: "ERC-721 conformance and re-entrancy", status: "Completed" },
  { firm: "Certora", date: "Q2 2026", scope: "Formal verification of retirement invariants", status: "Completed" },
  { firm: "ChainSec", date: "Q3 2026", scope: "Oracle manipulation and economic attacks", status: "In progress" },
];

const principles = [
  { icon: Lock, title: "Non-custodial by design", body: "No party, including MetricGreen Labs, ever has custody of user assets. All credits are held in user-controlled wallets." },
  { icon: Key, title: "Cryptographic guarantees", body: "Theft, double-counting, and resale of retired credits are mathematically impossible by construction, not policy." },
  { icon: Eye, title: "Transparent by default", body: "Every state transition is a public event. The full audit trail is queryable by anyone, in real time, forever." },
  { icon: FileCheck, title: "Audited and verified", body: "Smart contracts are audited by leading firms and formally verified for critical invariants. Bug bounty is live." },
];

export default function SecurityPage() {
  return (
    <Page>
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-rose-300/90 justify-center">Security</p>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3rem]">
          Security is a <span className="italic font-normal text-rose-300" style={{ fontFamily: "var(--font-serif)" }}>protocol-level</span> invariant.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.6] text-ink-300">
          We&apos;ve designed the protocol so that the most damaging attacks against legacy
          carbon markets — greenwashing, double-counting, retroactive edits — are
          mathematically impossible.
        </p>
      </div>

      <Section>
        <div className="grid items-stretch gap-5 sm:grid-cols-2">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card className="h-full p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <p.icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="font-display text-[16px] font-semibold leading-tight tracking-tight text-white">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-300">{p.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Audits & Formal Verification</h2>
        <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
          Independent reviews by leading firms. Reports are public.
        </p>
        <Card className="mt-6 overflow-hidden">
          <ul className="divide-y divide-white/[0.04]">
            {audits.map((a) => (
              <li key={a.firm} className="grid items-center gap-2 p-5 sm:grid-cols-[1fr_120px_1fr_120px]">
                <p className="font-display text-[14px] font-semibold leading-tight tracking-tight text-white">{a.firm}</p>
                <p className="font-mono text-[11px] leading-tight text-ink-400 sm:text-right">{a.date}</p>
                <p className="text-[13.5px] leading-snug text-ink-200">{a.scope}</p>
                <div className="sm:text-right">
                  <Badge tone={a.status === "Completed" ? "success" : "warning"}>
                    {a.status === "Completed" && <Check className="mr-1 inline h-3 w-3" />}
                    {a.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section>
        <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Bug Bounty</h2>
        <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
          Up to <span className="font-mono text-emerald-300">$500,000</span> per critical-severity finding. Payouts within 24 hours.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <SeverityCard severity="Critical" amount="$500k" tone="rose" />
          <SeverityCard severity="High" amount="$50k" tone="amber" />
          <SeverityCard severity="Medium" amount="$5k" tone="iris" />
          <SeverityCard severity="Low" amount="$500" tone="neutral" />
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Verified Certificate</h2>
        <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
          A sample of the on-chain certificate issued to verified producers.
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card className="p-6">
            <h3 className="font-display text-[15px] font-semibold leading-tight tracking-tight text-white">What the certificate proves</h3>
            <ul className="mt-4 space-y-2 text-[13.5px] text-ink-300">
              {[
                "The producer wallet has staked a valid VCS001 reputation bond.",
                "The methodology has been verified by a registered verifier.",
                "The certificate hash is permanently anchored to the producer address.",
                "Minting rights are now enabled for this wallet.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="leading-snug">{t}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4">
            <CredentialBadge className="w-full" />
            <p className="mt-4 text-center font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">
              Sample certificate
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Responsible Disclosure</h2>
        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Bug className="mt-1 h-5 w-5 text-emerald-300" />
              <div>
                <p className="font-medium leading-tight text-white">We mean it. Please report.</p>
                <p className="mt-1 text-[13.5px] leading-snug text-ink-300">
                  Email <a className="text-emerald-300 hover:text-emerald-200" href="mailto:security@metricgreen.xyz">security@metricgreen.xyz</a> with details and reproduction steps. PGP key on the documentation page. We respond within 24 hours.
                </p>
              </div>
            </div>
            <Badge tone="success" dot>Active program</Badge>
          </div>
        </Card>
      </Section>
    </Page>
  );
}

function SeverityCard({ severity, amount, tone }) {
  const tones = {
    rose: "border-rose-500/20 bg-rose-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    iris: "border-indigo-500/20 bg-indigo-500/5",
    neutral: "border-white/10 bg-white/[0.02]",
  };
  return (
    <div className={`rounded-xl border p-5 ${tones[tone]}`}>
      <p className="font-mono text-[9.5px] uppercase tracking-widest text-ink-500 leading-none">{severity}</p>
      <p className="mt-1.5 font-display text-[24px] font-semibold leading-none tracking-[-0.025em] text-white">{amount}</p>
    </div>
  );
}
