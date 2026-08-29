"use client";

import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ size = 32, withWordmark = true, className }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative grid shrink-0 place-items-center overflow-hidden rounded-[9px] shadow-[0_0_24px_-6px_rgba(16,185,129,0.5)]"
        style={{
          width: size,
          height: size,
          background:
            "conic-gradient(from 220deg at 50% 50%, #6ee7b7, #10b981, #047857, #6ee7b7)",
        }}
      >
        <div className="absolute inset-[1.5px] rounded-[7.5px] bg-ink-1000" />
        <Leaf
          className="relative text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          style={{ width: size * 0.55, height: size * 0.55 }}
          strokeWidth={2.2}
        />
      </div>
      {withWordmark && (
        <div className="flex flex-col leading-none gap-0.5">
          <span className="font-display text-[14.5px] font-semibold tracking-[-0.01em] text-white leading-none">
            Metric<span className="text-emerald-400">Green</span>
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-ink-500 leading-none">
            Programmable Carbon
          </span>
        </div>
      )}
    </div>
  );
}
