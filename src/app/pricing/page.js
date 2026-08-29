"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles, Building2, Rocket, Shield, Cpu, Globe, Lock, Zap, Network, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Page, PageHeader, Section } from "@/components/ui/Page";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    cadence: "/forever",
    desc: "For individual producers and small projects getting started.",
    icon: Sparkles,
    features: [
      "Up to 100 tCO₂e / month",
      "1 IoT sensor integration",
      "Public marketplace listing",
      "Email notifications",
      "Community support",
    ],
    cta: "Get started",
    href: "/",
    highlighted: false,
  },
  {
    id: "protocol",
    name: "Protocol",
    price: "$0",
    cadence: "+ gas sponsorship",
    desc: "For active producers and credit buyers. Our most popular plan.",
    icon: Rocket,
    features: [
      "Unlimited issuance",
      "Up to 50 sensor integrations",
      "Auto-retire on purchase",
      "Verra / GS / CAR / ACR registry adapters",
      "Priority support",
      "Webhook subscriptions",
    ],
    cta: "Connect wallet",
    href: "/",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "For climate funds, large buyers, and protocol integrators.",
    icon: Building2,
    features: [
      "Dedicated RPC and indexing",
      "Custom methodology circuits",
      "SLA and 24/7 incident response",
      "Single-tenant deployment",
      "Custom data residency",
      "On-prem option available",
    ],
    cta: "Contact sales",
    href: "/docs#contact",
    highlighted: false,
  },
];

const compareRows = [
  { label: "Mint capacity", starter: "100 tCO₂e / mo", protocol: "Unlimited", enterprise: "Unlimited" },
  { label: "Sensor integrations", starter: "1", protocol: "50", enterprise: "Custom" },
  { label: "Marketplace listing", starter: true, protocol: true, enterprise: true },
  { label: "Auto-retire", starter: false, protocol: true, enterprise: true },
  { label: "Registry adapters", starter: "Verra only", protocol: "All 4", enterprise: "All + custom" },
  { label: "Webhook subscriptions", starter: false, protocol: true, enterprise: true },
  { label: "Support", starter: "Community", protocol: "Priority", enterprise: "24/7 + SLA" },
  { label: "Dedicated RPC", starter: false, protocol: false, enterprise: true },
  { label: "On-prem deployment", starter: false, protocol: false, enterprise: true },
];

export default function PricingPage() {
  return (
    <Page>
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-emerald-300/90 justify-center">Pricing</p>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3rem]">
          Free for the planet. <span className="italic font-normal text-emerald-300" style={{ fontFamily: "var(--font-serif)" }}>Fair for everyone</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.6] text-ink-300">
          The base protocol is free and gas-sponsored. We never charge producers for
          minting. Premium plans add capacity, support, and compliance tooling.
        </p>
      </div>

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={cn(
                "relative h-full p-7 transition",
                p.highlighted && "border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
              )}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge tone="success">Most Popular</Badge>
                </div>
              )}
              <div className="mb-5 flex items-center gap-3">
                <div className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl border",
                  p.highlighted ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-white/[0.04]",
                )}>
                  <p.icon className={cn("h-5 w-5", p.highlighted ? "text-emerald-300" : "text-white")} />
                </div>
                <div>
                  <h3 className="font-display text-[16px] font-semibold leading-tight tracking-tight text-white">{p.name}</h3>
                  <p className="text-[12px] leading-snug text-ink-400">{p.desc}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-display text-[36px] font-bold tracking-[-0.025em] text-white">{p.price}</span>
                <span className="text-[13px] text-ink-400">{p.cadence}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-200">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                as={Link}
                href={p.href}
                variant={p.highlighted ? "primary" : "secondary"}
                className="mt-7 w-full"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {p.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-center font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Compare plans</h2>
        <Card className="mt-7 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="border-b border-white/[0.05] text-left font-mono text-[9.5px] uppercase tracking-widest text-ink-500">
                <tr>
                  <th className="px-5 py-3">Feature</th>
                  <th className="px-5 py-3">Starter</th>
                  <th className="px-5 py-3">Protocol</th>
                  <th className="px-5 py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {compareRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-3 leading-snug text-ink-300">{row.label}</td>
                    <Cell value={row.starter} />
                    <Cell value={row.protocol} highlight />
                    <Cell value={row.enterprise} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Section>
        <Card className="p-8 sm:p-12 text-center">
          <Shield className="mx-auto h-9 w-9 text-emerald-300" />
          <h2 className="mt-4 font-display text-[22px] font-bold leading-tight tracking-tight text-white">All plans include</h2>
          <ul className="mx-auto mt-5 grid max-w-3xl gap-3 text-[13px] text-ink-200 sm:grid-cols-2">
            {[
              { icon: Zap, label: "Gas-sponsored transactions" },
              { icon: Network, label: "Full audit trail access" },
              { icon: BadgeCheck, label: "Verifiable on-chain proofs" },
              { icon: Lock, label: "Open-source contracts" },
              { icon: Cpu, label: "No vendor lock-in" },
              { icon: Globe, label: "Public marketplace access" },
            ].map((b) => (
              <li key={b.label} className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                <b.icon className="h-3 w-3 text-emerald-400" />
                {b.label}
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </Page>
  );
}

function Cell({ value, highlight }) {
  if (value === true) {
    return (
      <td className="px-5 py-3">
        <Check className={`h-3.5 w-3.5 ${highlight ? "text-emerald-300" : "text-ink-300"}`} />
      </td>
    );
  }
  if (value === false) {
    return <td className="px-5 py-3 text-ink-600">—</td>;
  }
  return <td className={`px-5 py-3 leading-snug ${highlight ? "text-white" : "text-ink-300"}`}>{value}</td>;
}
