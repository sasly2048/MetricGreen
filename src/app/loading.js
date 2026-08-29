import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-ink-400">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">Loading…</p>
      </div>
    </div>
  );
}
