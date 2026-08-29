"use client";

import { motion } from "framer-motion";
import { Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "MetricGreen is the first carbon market infrastructure that lets our auditors trust the data without trusting us. That changes the entire dynamic for registries and project developers alike.",
    name: "Dr. Anya Lindgren",
    role: "Chief Carbon Officer",
    org: "Atmospheric Reforestation Trust",
    initials: "AL",
    location: "São Paulo, BR",
    social: "linkedin",
  },
  {
    quote:
      "We retired 12,400 tCO₂e in 38 seconds. With the legacy registries, that quote took 11 weeks. The entire corporate offset workflow has been compressed into a single transaction.",
    name: "Marcus Reyes",
    role: "Head of Sustainability",
    org: "Polaris Logistics",
    initials: "MR",
    location: "New York, US",
    social: "twitter",
  },
  {
    quote:
      "The ZK-proofing layer is what finally let us share factory telemetry. Our IP stays private, but the data is still verifiable. That was the missing piece for industrial-scale adoption.",
    name: "Yuki Tanaka",
    role: "VP Climate Engineering",
    org: "Sora Cement Group",
    initials: "YT",
    location: "Tokyo, JP",
    social: "linkedin",
  },
  {
    quote:
      "As a verifier, I now spend my time validating real discrepancies instead of chasing PDFs. The signal-to-noise ratio is a hundred times better than anything else we've used.",
    name: "Eleanor Voss",
    role: "Lead Verifier",
    org: "Terra Audit Cooperative",
    initials: "EV",
    location: "London, UK",
    social: "linkedin",
  },
  {
    quote:
      "We tokenized a 7,200 hectare blue carbon project in three weeks. With the legacy system, we would still be waiting for the verifier to return our calls.",
    name: "Pakai Wirajaya",
    role: "Director of Marine Programs",
    org: "Pacific Blue Carbon",
    initials: "PW",
    location: "Jakarta, ID",
    social: "twitter",
  },
  {
    quote:
      "The protocol's reputation bond system is the most elegant alignment mechanism I've seen in any climate-finance primitive. The economics just work.",
    name: "Sarah Chen",
    role: "Climate Tech Investor",
    org: "Cascade Capital",
    initials: "SC",
    location: "San Francisco, US",
    social: "linkedin",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-amber-300/90">
            <span className="h-px w-6 bg-current opacity-40" />
            Trusted by Operators
          </p>
          <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem]">
            What the people building the <span className="italic font-normal text-amber-300" style={{ fontFamily: "var(--font-serif)" }}>climate economy</span> say.
          </h2>
        </div>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group mb-5 break-inside-avoid rounded-xl border border-white/[0.06] bg-ink-900/40 p-6 backdrop-blur-md transition hover:border-white/10 hover:bg-ink-900/60"
            >
              <p className="serif text-[15.5px] italic leading-[1.55] text-ink-100">
                &ldquo;{t.quote}&rdquo;
              </p>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.05] pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-emerald-500/30 to-cyan-500/10 font-mono text-[11px] font-semibold text-white">
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
                    {t.name}
                    {t.social === "linkedin" && <Linkedin className="h-3 w-3 text-ink-500" />}
                    {t.social === "twitter" && <Twitter className="h-3 w-3 text-ink-500" />}
                  </p>
                  <p className="text-[11px] text-ink-400">{t.role} · {t.org}</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-ink-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
