"use client";

import { Leaf, Wind, Flame, Sun, Sprout, TreePine, Waves } from "lucide-react";
import {
  ForestCanopyIllustration,
  SatelliteDishIllustration,
  DACTowerIllustration,
  MangroveIllustration,
  SolarFieldIllustration,
  MethaneCaptureIllustration,
  SoilLayersIllustration,
} from "./Illustrations";
import { cn } from "@/lib/utils";

const categoryStyles = {
  Reforestation: { icon: TreePine, hue: "142 76% 36%", Illust: ForestCanopyIllustration },
  "Direct Air Capture": { icon: Wind, hue: "187 86% 43%", Illust: DACTowerIllustration },
  DAC: { icon: Wind, hue: "187 86% 43%", Illust: DACTowerIllustration },
  "Renewable Energy": { icon: Sun, hue: "262 83% 58%", Illust: SolarFieldIllustration },
  "Blue Carbon": { icon: Waves, hue: "200 90% 50%", Illust: MangroveIllustration },
  "Methane Capture": { icon: Flame, hue: "38 92% 50%", Illust: MethaneCaptureIllustration },
  Methane: { icon: Flame, hue: "38 92% 50%", Illust: MethaneCaptureIllustration },
  "Soil Sequestration": { icon: Sprout, hue: "350 89% 60%", Illust: SoilLayersIllustration },
  Soil: { icon: Sprout, hue: "350 89% 60%", Illust: SoilLayersIllustration },
};

export function CategoryArt({ category, className, height = 160, variant = "default" }) {
  const style = categoryStyles[category] || {
    icon: Leaf,
    hue: "160 84% 39%",
    Illust: ForestCanopyIllustration,
  };
  const Icon = style.icon;
  const Illust = style.Illust;

  if (variant === "minimal") {
    return (
      <div
        className={cn("relative w-full overflow-hidden", className)}
        style={{ height, background: `linear-gradient(135deg, hsl(${style.hue} / 0.18), hsl(${style.hue} / 0.04))` }}
      >
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: `linear-gradient(180deg, transparent, hsl(${style.hue} / 0.18))` }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/30 backdrop-blur-md"
            style={{ boxShadow: `0 0 30px hsl(${style.hue} / 0.4)` }}
          >
            <Icon className="h-6 w-6 text-white" strokeWidth={1.6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
    >
      <Illust className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/70">{category}</p>
        </div>
        <div
          className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 bg-black/40 backdrop-blur-md"
          style={{ boxShadow: `0 0 16px hsl(${style.hue} / 0.4)` }}
        >
          <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
