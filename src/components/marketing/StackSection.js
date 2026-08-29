"use client";

import { motion } from "framer-motion";
import { Code, Server, Network, Boxes, ArrowUpRight } from "lucide-react";

const stack = [
  {
    layer: "Application",
    title: "Producer & verifier surfaces",
    items: [
      { name: "MetricGreen dApp", detail: "Producer console, marketplace, retirement flow" },
      { name: "Verifier Console", detail: "Challenge window attestations & disputes" },
      { name: "Public Audit Trail", detail: "Real-time queryable event log" },
    ],
    icon: Boxes,
  },
  {
    layer: "Computation",
    title: "Off-chain proof & aggregation",
    items: [
      { name: "zk-SNARK Prover", detail: "Local, private compliance proof generation" },
      { name: "Sensor Aggregator", detail: "Multi-source telemetry reconciliation" },
      { name: "Satellite dMRV", detail: "Sentinel-2, GHGSat, Open-Meteo feeds" },
    ],
    icon: Code,
  },
  {
    layer: "Settlement",
    title: "On-chain protocol",
    items: [
      { name: "MetricGreen.sol", detail: "ERC-721 issuance & irreversible retirement" },
      { name: "Reputation Bonds", detail: "Stake-aligned producer registry" },
      { name: "Registry Bridges", detail: "Verra, Gold Standard, CAR, ACR adapters" },
    ],
    icon: Server,
  },
  {
    layer: "Network",
    title: "L1 / L2 infrastructure",
    items: [
      { name: "Polygon", detail: "Low-cost primary chain" },
      { name: "Arbitrum", detail: "High-throughput fallback" },
      { name: "IPFS + Filecoin", detail: "Encrypted metadata pinning" },
    ],
    icon: Network,
  },
];

export function StackSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-cyan-300/90">
            <span className="h-px w-6 bg-current opacity-40" />
            Architecture
          </p>
          <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]">
            Four clean layers. <span className="italic font-normal text-cyan-300" style={{ fontFamily: "var(--font-serif)" }}>Zero magic</span>.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-ink-300">
            Every component is open-source, audited, and replaceable. You can build,
            integrate, or fork any layer without permission.
          </p>
        </div>

        <div className="mt-14 space-y-3">
          {stack.map((layer, i) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group surface-1 grid gap-6 rounded-2xl p-6 transition hover:border-white/10 sm:grid-cols-[220px_1fr] sm:items-start"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                    <layer.icon className="h-4 w-4 text-white" strokeWidth={1.6} />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">{layer.layer}</p>
                </div>
                <h3 className="mt-3 font-display text-[14.5px] font-semibold leading-tight tracking-tight text-white">{layer.title}</h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {layer.items.map((it) => (
                  <div
                    key={it.name}
                    className="rounded-lg border border-white/[0.05] bg-black/20 p-3"
                  >
                    <p className="font-mono text-[12.5px] font-medium leading-tight text-white">{it.name}</p>
                    <p className="mt-1.5 text-[11.5px] leading-[1.5] text-ink-400">{it.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
