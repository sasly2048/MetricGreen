"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Cpu, Satellite, Database } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Page, PageHeader, Section } from "@/components/ui/Page";
import {
  ForestCanopyIllustration,
  SatelliteDishIllustration,
  DACTowerIllustration,
  MangroveIllustration,
  SolarFieldIllustration,
  MethaneCaptureIllustration,
  SoilLayersIllustration,
} from "@/components/ui/Illustrations";

const phases = [
  {
    id: "01",
    title: "Registry Integration",
    summary: "Producers anchor their VCS001 certification on-chain. The contract actively rejects non-registered wallets from minting.",
    details: [
      "Verifiable cross-check against the Verra, Gold Standard, CAR, and ACR registry batches",
      "Producer reputation bond (1–5 ETH) staked at registration",
      "Reputation score initialized at 100; updated automatically based on attestation outcomes",
      "Wallet ownership verified against ENS reverse record",
    ],
    icon: ShieldCheck,
    Illust: ForestCanopyIllustration,
  },
  {
    id: "02",
    title: "Data Ingestion & ZK-Verification",
    summary: "IoT sensors and satellite feeds are streamed, hashed, and verified through a local zero-knowledge proof.",
    details: [
      "Producers' IoT gateways sign each reading with a hardware-bound key",
      "Open-Meteo and Sentinel-5P orbital data cross-check ground readings every 6 hours",
      "zk-SNARK proof generated locally in under 2 seconds, attesting to compliance without revealing raw data",
      "Proofs are submitted to chain with a SHA-256 hash of the original payload for later verification",
    ],
    icon: Cpu,
    Illust: DACTowerIllustration,
  },
  {
    id: "03",
    title: "Automated Minting & Challenge Window",
    summary: "The contract mints a unique ERC-721 credit and opens a 7-day challenge window for verifier attestation.",
    details: [
      "Each credit is serialized with project ID, vintage, and registry batch",
      "Smart contract enforces maximum batch size of 5,000 tCO₂e per transaction",
      "Challenge window: 7 days, during which any registered verifier can dispute issuance",
      "Sensors are continuously monitored; minting pauses automatically on degraded readings",
    ],
    icon: Database,
    Illust: SatelliteDishIllustration,
  },
  {
    id: "04",
    title: "Marketplace Exchange & Permanent Retirement",
    summary: "Buyers purchase credits on the public marketplace and either hold or permanently retire them.",
    details: [
      "Marketplace routes orders across listed batches for best execution",
      "Retirement is a single transaction that cryptographically destroys the credit",
      "A retirement certificate is anchored to the buyer's wallet, tied to the original mint's ZK proof",
      "Total supply is decremented permanently — there is no path to re-mint or fractionalize",
    ],
    icon: ShieldCheck,
    Illust: MangroveIllustration,
  },
];

export default function HowItWorksPage() {
  return (
    <Page>
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-emerald-300/90 justify-center">How it works</p>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3rem]">
          The full lifecycle, <span className="italic font-normal text-emerald-300" style={{ fontFamily: "var(--font-serif)" }}>end-to-end</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.6] text-ink-300">
          From sensor reading to permanent retirement — every step is verifiable, every state transition is auditable, and no human intermediary is required.
        </p>
      </div>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          {phases.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="relative h-full overflow-hidden p-0">
                <div className="relative h-40">
                  <p.Illust className="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-1000 via-ink-1000/40 to-transparent" />
                  <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-widest text-ink-200 backdrop-blur-md leading-none">
                      Phase {p.id}
                    </span>
                    <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 bg-black/30 text-white backdrop-blur-md">
                      <p.icon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-[17px] font-semibold leading-tight tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-300">{p.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {p.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-200">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Sensors at the edge</h2>
        <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
          Every credit starts with a sensor reading. Here&apos;s the full stack that powers our dMRV layer.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TechCard icon={Cpu} title="Ground sensors" body="Hardware-bound keys sign every reading. Tampering invalidates the entire batch." Illust={ForestCanopyIllustration} />
          <TechCard icon={Satellite} title="Satellite dMRV" body="Sentinel-5P, GHGSat, and Open-Meteo cross-check ground readings every 6 hours." Illust={SatelliteDishIllustration} />
          <TechCard icon={Database} title="IPFS anchoring" body="Encrypted metadata is pinned across the IPFS network with deterministic content addressing." Illust={SolarFieldIllustration} />
        </div>
      </Section>

      <Card className="overflow-hidden p-10 text-center sm:p-12">
        <h2 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.025em] text-white">Ready to try it?</h2>
        <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-snug text-ink-300">
          Connect a wallet to see the protocol in action with seeded demo data.
        </p>
        <Button as={Link} href="/" className="mt-6" leftIcon={<ArrowRight className="h-4 w-4" />}>
          Open the App
        </Button>
      </Card>
    </Page>
  );
}

function TechCard({ icon: Icon, title, body, Illust }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-28">
        <Illust className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-1000 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-black/30 backdrop-blur-md">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-[15px] font-semibold leading-tight tracking-tight text-white">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-ink-300">{body}</p>
      </div>
    </Card>
  );
}
