"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, ExternalLink, Copy, Check, Book, Code, Server, Shield, FileText, Boxes, ArrowRight, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Page, PageHeader } from "@/components/ui/Page";

const sections = [
  { id: "intro", label: "Introduction", icon: Book },
  { id: "architecture", label: "Architecture", icon: Boxes },
  { id: "contracts", label: "Smart Contracts", icon: Code },
  { id: "api", label: "API Reference", icon: Server },
  { id: "security", label: "Security Model", icon: Shield },
  { id: "methodology", label: "Methodology", icon: FileText },
  { id: "faq", label: "FAQ", icon: Book },
  { id: "whitepaper", label: "Whitepaper", icon: FileText },
  { id: "about", label: "About", icon: Book },
  { id: "contact", label: "Contact", icon: FileText },
  { id: "careers", label: "Careers", icon: Book },
  { id: "legal", label: "Legal", icon: Shield },
];

export default function DocsPage() {
  const [active, setActive] = useState("intro");

  return (
    <div className="mx-auto flex w-full max-w-[88rem] gap-10 px-4 py-10 sm:px-6 lg:px-10">
      <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
        <p className="mb-3 px-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-500">Documentation</p>
        <ul className="space-y-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => {
                  setActive(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition",
                  active === s.id
                    ? "bg-white/[0.06] text-white"
                    : "text-ink-400 hover:bg-white/[0.03] hover:text-white",
                )}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
          <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-emerald-300 leading-none">
            <Sparkles className="h-3 w-3" />
            v1.0
          </div>
          <p className="mt-2 text-[12px] leading-snug text-ink-300">
            Looking for v0.9 docs? <Link href="#" className="text-emerald-300 hover:text-emerald-200">View archive →</Link>
          </p>
        </div>
      </aside>

      <article className="min-w-0 max-w-3xl flex-1 space-y-16">
        <PageHeader
          eyebrow="Documentation"
          title="Build on MetricGreen"
          description="Everything you need to integrate, audit, and extend the protocol. Open-source, open-spec, open to everyone."
          action={
            <>
              <Button as={Link} href="/dashboard" leftIcon={<ArrowRight className="h-4 w-4" />} size="md">
                Open dashboard
              </Button>
              <Button as={Link} href="/marketplace" variant="secondary" size="md">Browse marketplace</Button>
            </>
          }
        />

        <Section id="intro" title="Introduction">
          <p>
            MetricGreen is a protocol for issuing, trading, and permanently retiring
            verifiable carbon credits on a public blockchain. It is designed to be the
            trust layer for the voluntary carbon market — eliminating greenwashing,
            double-counting, and slow manual verification through cryptographic
            primitives and decentralized infrastructure.
          </p>
          <h3 className="mt-8 font-display text-[18px] font-semibold leading-tight tracking-tight text-white">What you&apos;ll find here</h3>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <DocLi>A high-level tour of the system architecture</DocLi>
            <DocLi>Smart contract reference for producers, verifiers, and integrators</DocLi>
            <DocLi>API documentation for the off-chain verification layer</DocLi>
            <DocLi>Security model, audit reports, and disclosure policy</DocLi>
            <DocLi>Methodology catalogue and registry adapter details</DocLi>
          </ul>
        </Section>

        <Section id="architecture" title="Architecture">
          <p>
            The protocol is organized into four clean layers. Each can be replaced or
            forked without breaking the others.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Layer title="Application" desc="Producer console, marketplace, verifier UI, audit trail." />
            <Layer title="Computation" desc="zk-SNARK prover, sensor aggregator, satellite dMRV feeds." />
            <Layer title="Settlement" desc="Smart contracts: ERC-721 mint, retirement, reputation bonds." />
            <Layer title="Network" desc="Polygon / Arbitrum, IPFS, Chainlink Functions, ENS." />
          </div>
        </Section>

        <Section id="contracts" title="Smart Contracts">
          <p>
            The on-chain surface is a single canonical contract, <CodeInline>MetricGreen.sol</CodeInline>, deployed on Polygon with a mirrored instance on Arbitrum.
          </p>
          <CodeBlock
            language="solidity"
            code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MetricGreen {
    struct Credit {
        string projectName;
        string registryName;
        string projectId;
        uint256 amount;
        address producer;
        uint256 issuedAt;
        uint256 challengeEndsAt;
        bool retired;
    }

    Credit[] public credits;
    mapping(address => bytes32) public certByProducer;
    mapping(address => uint256) public bondByProducer;
    mapping(address => uint256) public reputation;

    event Minted(uint256 indexed id, address indexed producer, uint256 amount);
    event Retired(uint256 indexed id, address indexed retiree, bytes32 proof);
    event Challenged(uint256 indexed id, address indexed challenger, string reason);

    function registerVCS001(bytes32 certId) external payable;
    function mintCredit(MintParams calldata) external returns (uint256);
    function attest(uint256 creditId) external;
    function challenge(uint256 creditId, string calldata reason) external;
    function retire(uint256 creditId) external;
}`}
          />
          <p className="mt-4">
            <Link href="#" className="inline-flex items-center gap-1 text-[13px] text-emerald-300 hover:text-emerald-200">
              View full source on GitHub
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </Section>

        <Section id="api" title="API Reference">
          <p>
            The verification API is a stateless endpoint that producers and integrators can call to issue ZK proofs.
          </p>
          <CodeBlock
            language="bash"
            code={`POST /api/verify
Content-Type: application/json

{
  "projectId": "VCS-9341",
  "claimedAmount": 500,
  "iotPayload": { ... },
  "satellitePayload": { ... }
}`}
          />
          <CodeBlock
            language="json"
            code={`// Response (200)
{
  "verified": true,
  "zkProof": "0x8f7b3a4c2d1e...",
  "iotHash": "0xa1b2c3d4e5f6...",
  "satelliteHash": "0x9f8e7d6c5b4a...",
  "challengeWindowEnds": "2026-09-05T10:24:00Z"
}`}
          />
        </Section>

        <Section id="security" title="Security Model">
          <p>
            Security is treated as a protocol-level invariant, not a feature. The full
            security model and audit reports are public.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <SecurityCard title="Audits" body="Trail of Bits (Q1 2026) and OpenZeppelin (Q2 2026) completed. Reports linked in the whitepaper." />
            <SecurityCard title="Formal Verification" body="Retirement logic formally verified using Certora. All edge cases enumerated." />
            <SecurityCard title="Bug Bounty" body="$500k maximum payout via Immunefi. Critical-severity findings paid within 24h." />
            <SecurityCard title="Disclosure" body="security@metricgreen.xyz · PGP key in the whitepaper. Responsible disclosure policy applies." />
          </div>
        </Section>

        <Section id="methodology" title="Methodology">
          <p>
            Each supported methodology is encoded as a separate circuit in the
            Circom library. The full catalogue is open-source.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "VM0007 v1.6 — Reforestation",
              "VM0033 v2.0 — Blue Carbon",
              "VM0042 v1.0 — Soil Sequestration",
              "AMS-III.H — Methane Capture",
              "Puro.earth — Geologic Storage",
              "ACM0002 — Renewable Generation",
            ].map((m) => (
              <li key={m} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[13px] leading-snug text-ink-200">
                {m}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="faq" title="Frequently Asked Questions">
          <p>For common questions, see our <Link href="/#faq" className="text-emerald-300 hover:text-emerald-200">FAQ on the homepage</Link> or the more detailed FAQ in the whitepaper.</p>
        </Section>

        <Section id="whitepaper" title="Whitepaper">
          <p>The full technical whitepaper is available as a PDF and on ArXiv.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[{ label: "Download PDF", href: "#" }, { label: "Read on ArXiv", href: "#" }].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-ink-200 transition hover:border-white/20 hover:text-white"
              >
                {l.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </Section>

        <Section id="about" title="About MetricGreen Labs">
          <p>
            MetricGreen Labs is a research-engineering collective building
            institutional-grade climate infrastructure. The team includes former
            engineers from the IPCC, Verra, Chainalysis, and the Ethereum Foundation.
          </p>
        </Section>

        <Section id="contact" title="Contact">
          <p>For partnerships, integrations, and general inquiries:</p>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            <DocLi><strong className="text-white">Partnerships:</strong> partners@metricgreen.xyz</DocLi>
            <DocLi><strong className="text-white">Press:</strong> press@metricgreen.xyz</DocLi>
            <DocLi><strong className="text-white">Security:</strong> security@metricgreen.xyz</DocLi>
            <DocLi><strong className="text-white">General:</strong> hello@metricgreen.xyz</DocLi>
          </ul>
        </Section>

        <Section id="careers" title="Careers">
          <p>We&apos;re hiring across research, engineering, and policy. See open roles below.</p>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            <DocLi>Senior Solidity Engineer · Remote</DocLi>
            <DocLi>ZK Researcher (Cryptography) · Remote / NYC</DocLi>
            <DocLi>Climate Policy Lead · Geneva / Remote</DocLi>
            <DocLi>Full-stack Engineer (Dashboard) · Remote</DocLi>
          </ul>
        </Section>

        <Section id="legal" title="Legal">
          <p>
            MetricGreen Labs is incorporated in Delaware, USA. The protocol smart
            contracts are released under MIT. Off-chain components are released under
            Apache 2.0. See the whitepaper appendix for full license details.
          </p>
        </Section>
      </article>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-[14.5px] leading-[1.65] text-ink-300">{children}</div>
    </section>
  );
}

function DocLi({ children }) {
  return (
    <li className="flex items-start gap-2 text-[13.5px] leading-snug">
      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
      <span>{children}</span>
    </li>
  );
}

function Layer({ title, desc }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <p className="font-display text-[14px] font-semibold leading-tight tracking-tight text-white">{title}</p>
      <p className="mt-1 text-[13px] leading-snug text-ink-400">{desc}</p>
    </div>
  );
}

function SecurityCard({ title, body }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <p className="font-display text-[14px] font-semibold leading-tight tracking-tight text-white">{title}</p>
      <p className="mt-1 text-[13px] leading-snug text-ink-400">{body}</p>
    </div>
  );
}

function CodeInline({ children }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12.5px] text-emerald-300">
      {children}
    </code>
  );
}

function CodeBlock({ code, language = "text" }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="group relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0a1020]">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-widest text-ink-500">
        <span>{language}</span>
        <button onClick={onCopy} className="flex items-center gap-1 text-ink-400 transition hover:text-white">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.6] text-ink-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
