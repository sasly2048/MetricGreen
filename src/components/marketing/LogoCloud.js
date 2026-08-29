"use client";

import { motion } from "framer-motion";
import { partnerLogos } from "@/components/ui/Logos";

export function LogoCloud() {
  const items = [...partnerLogos, ...partnerLogos, ...partnerLogos];
  return (
    <section className="border-y border-white/[0.04] bg-ink-1000/40 py-12">
      <div className="container-page">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500">
          Integrated with the registries, oracles, and infrastructure you already trust
        </p>

        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <motion.div
            className="flex items-center gap-16 whitespace-nowrap"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          >
            {items.map((p, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center text-ink-400 transition-colors hover:text-ink-100"
              >
                <p.Cmp className="h-5" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
