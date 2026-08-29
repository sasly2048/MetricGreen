"use client";

// Polls a fake verification endpoint so the UI feels alive on the marketing site.
// Cosmetic only — does not modify any on-chain state.

import { useEffect } from "react";

export function VerificationPoller() {
  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: "PING", claimedAmount: "0" }),
          cache: "no-store",
        });
      } catch {
        // expected to error in static contexts
      }
      if (!cancelled) {
        const next = 30_000 + Math.random() * 20_000;
        setTimeout(tick, next);
      }
    }

    const t = setTimeout(tick, 6_000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return null;
}
