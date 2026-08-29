"use client";

import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Compass className="h-6 w-6 text-emerald-300" />
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300 leading-none">404</p>
      <h1 className="mt-2 font-display text-[1.875rem] font-bold leading-[1.1] tracking-[-0.025em] text-white">This page is off the grid.</h1>
      <p className="mt-2 text-[13.5px] leading-snug text-ink-400">
        We couldn&apos;t find the page you were looking for. The address may have changed or never existed.
      </p>
      <div className="mt-6 flex gap-2">
        <Button as={Link} href="/" leftIcon={<Home className="h-3.5 w-3.5" />}>Back to Home</Button>
        <Button as={Link} href="/dashboard" variant="secondary">Dashboard</Button>
      </div>
    </div>
  );
}
