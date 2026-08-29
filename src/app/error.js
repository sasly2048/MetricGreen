"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-rose-500/20 bg-rose-500/[0.05]">
            <AlertTriangle className="h-6 w-6 text-rose-300" />
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-rose-300">Runtime Error</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-bold tracking-[-0.025em] text-white">Something went wrong.</h1>
          <p className="mt-2 text-[13.5px] text-ink-400">
            {error?.message || "An unexpected error occurred while rendering this page."}
          </p>
          <div className="mt-6 flex gap-2">
            <Button onClick={() => reset()}>Try again</Button>
            <Button as={Link} href="/" variant="secondary">Go home</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
