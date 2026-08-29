"use client";

import { cn } from "@/lib/utils";

// Real-feeling logo marks for partner registries, oracles, and infrastructure.
// All inline SVG — crisp at any resolution, brandable, no asset deps.

export function VerraLogo({ className, title = "Verra" }) {
  return (
    <svg viewBox="0 0 100 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M8 12 Q 12 6 16 12 Q 12 18 8 12 Z" fill="currentColor" opacity="0.4" />
        <text x="28" y="17" fontFamily="ui-sans-serif, system-ui" fontSize="14" fontWeight="700" letterSpacing="-0.5">Verra</text>
      </g>
    </svg>
  );
}

export function GoldStandardLogo({ className, title = "Gold Standard" }) {
  return (
    <svg viewBox="0 0 140 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 16.5 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" />
        <text x="30" y="17" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">Gold Standard</text>
      </g>
    </svg>
  );
}

export function CARLogo({ className, title = "Climate Action Reserve" }) {
  return (
    <svg viewBox="0 0 100 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <rect x="2" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="6" y="16" fontFamily="ui-mono, monospace" fontSize="10" fontWeight="800">CAR</text>
        <text x="26" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="600" opacity="0.8">Reserve</text>
      </g>
    </svg>
  );
}

export function ACRLogo({ className, title = "American Carbon Registry" }) {
  return (
    <svg viewBox="0 0 100 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M3 18 L11 4 L19 18 L15 18 L11 11 L7 18 Z" />
        <text x="26" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">ACR</text>
      </g>
    </svg>
  );
}

export function PuroLogo({ className, title = "Puro.earth" }) {
  return (
    <svg viewBox="0 0 120 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" />
        <text x="28" y="17" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">Puro.earth</text>
      </g>
    </svg>
  );
}

export function SentinelLogo({ className, title = "Sentinel-5P" }) {
  return (
    <svg viewBox="0 0 130 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M2 12 L8 4 L14 12 L8 20 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="12" r="2" />
        <text x="20" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700">Sentinel-5P</text>
      </g>
    </svg>
  );
}

export function GHGSatLogo({ className, title = "GHGSat" }) {
  return (
    <svg viewBox="0 0 110 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <rect x="3" y="6" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10" cy="12" r="2" />
        <path d="M17 12 L21 12 M19 10 L19 14" stroke="currentColor" strokeWidth="1.4" />
        <text x="26" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">GHGSat</text>
      </g>
    </svg>
  );
}

export function OpenMeteoLogo({ className, title = "Open-Meteo" }) {
  return (
    <svg viewBox="0 0 130 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M5 14 Q 5 10 9 10 Q 9 6 14 6 Q 18 6 19 10 Q 22 11 22 14 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <text x="28" y="17" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">Open-Meteo</text>
      </g>
    </svg>
  );
}

export function PolygonLogo({ className, title = "Polygon" }) {
  return (
    <svg viewBox="0 0 110 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M12 2 L19 6 L19 14 L12 18 L5 14 L5 6 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7 L15 9 L15 12 L12 14 L9 12 L9 9 Z" />
        <text x="26" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">Polygon</text>
      </g>
    </svg>
  );
}

export function ArbitrumLogo({ className, title = "Arbitrum" }) {
  return (
    <svg viewBox="0 0 120 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M3 16 L9 6 L11 9 L7 16 Z M11 9 L13 6 L21 18 L17 18 Z" />
        <text x="26" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">Arbitrum</text>
      </g>
    </svg>
  );
}

export function ChainlinkLogo({ className, title = "Chainlink" }) {
  return (
    <svg viewBox="0 0 130 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <path d="M12 3 L21 8 L21 16 L12 21 L3 16 L3 8 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" />
        <text x="28" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">Chainlink</text>
      </g>
    </svg>
  );
}

export function IPFSLogo({ className, title = "IPFS" }) {
  return (
    <svg viewBox="0 0 80 24" className={cn("h-5 w-auto", className)} aria-label={title}>
      <g fill="currentColor">
        <circle cx="6" cy="12" r="3" />
        <circle cx="14" cy="6" r="2.4" />
        <circle cx="14" cy="18" r="2.4" />
        <circle cx="22" cy="12" r="2" />
        <line x1="6" y1="12" x2="14" y2="6" stroke="currentColor" strokeWidth="1.4" />
        <line x1="6" y1="12" x2="14" y2="18" stroke="currentColor" strokeWidth="1.4" />
        <line x1="14" y1="6" x2="22" y2="12" stroke="currentColor" strokeWidth="1.4" />
        <line x1="14" y1="18" x2="22" y2="12" stroke="currentColor" strokeWidth="1.4" />
        <text x="30" y="16" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="700">IPFS</text>
      </g>
    </svg>
  );
}

export const partnerLogos = [
  { id: "verra", name: "Verra", Cmp: VerraLogo },
  { id: "gs", name: "Gold Standard", Cmp: GoldStandardLogo },
  { id: "car", name: "Climate Action Reserve", Cmp: CARLogo },
  { id: "acr", name: "American Carbon Registry", Cmp: ACRLogo },
  { id: "puro", name: "Puro.earth", Cmp: PuroLogo },
  { id: "sentinel", name: "Sentinel-5P", Cmp: SentinelLogo },
  { id: "ghgsat", name: "GHGSat", Cmp: GHGSatLogo },
  { id: "openmeteo", name: "Open-Meteo", Cmp: OpenMeteoLogo },
  { id: "polygon", name: "Polygon", Cmp: PolygonLogo },
  { id: "arbitrum", name: "Arbitrum", Cmp: ArbitrumLogo },
  { id: "chainlink", name: "Chainlink", Cmp: ChainlinkLogo },
  { id: "ipfs", name: "IPFS", Cmp: IPFSLogo },
];
