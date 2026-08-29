"use client";

import { cn } from "@/lib/utils";

// Hand-crafted SVG illustrations that are cohesive and distinctive.
// No placeholder boxes, no empty-state icons. Every illustration tells a
// specific story about the product.

// -------------------------------------------------------------------------
// ForestCanopy — used in hero, refiestation project art, empty states.
// -------------------------------------------------------------------------
export function ForestCanopyIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="canopy-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1e1a" />
          <stop offset="100%" stopColor="#06231c" />
        </linearGradient>
        <linearGradient id="canopy-fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="canopy-glow" cx="0.7" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="280" fill="url(#canopy-sky)" />
      <rect width="400" height="280" fill="url(#canopy-glow)" />

      {/* Sun/moon */}
      <circle cx="290" cy="78" r="34" fill="#34d399" opacity="0.18" />
      <circle cx="290" cy="78" r="22" fill="#6ee7b7" opacity="0.6" />

      {/* Far trees (silhouettes) */}
      {[40, 90, 140, 200, 250, 330, 370].map((x, i) => (
        <path
          key={`far-${i}`}
          d={`M${x} 200 L${x - 14} ${200 + (i % 2 === 0 ? 20 : 28)} L${x + 14} ${200 + (i % 2 === 0 ? 20 : 28)} Z`}
          fill="#022c22"
          opacity="0.85"
        />
      ))}

      {/* Mid trees */}
      {[20, 70, 130, 180, 240, 300, 350, 390].map((x, i) => (
        <g key={`mid-${i}`} transform={`translate(${x}, 0)`}>
          <path d={`M0 220 L-22 250 L22 250 Z`} fill="#064e3b" />
          <path d={`M0 200 L-26 240 L26 240 Z`} fill="#047857" />
          <path d={`M0 180 L-22 220 L22 220 Z`} fill="#059669" />
        </g>
      ))}

      {/* Foreground */}
      <rect x="0" y="248" width="400" height="32" fill="url(#canopy-fg)" />

      {/* Subtle particle dots */}
      {[
        [60, 60], [120, 40], [200, 90], [260, 50], [320, 100], [180, 130], [80, 110],
        [340, 140], [40, 160], [220, 60],
      ].map(([x, y], i) => (
        <circle key={`p-${i}`} cx={x} cy={y} r="1.2" fill="#6ee7b7" opacity="0.5" />
      ))}

      {/* Orbits / proof rings */}
      <ellipse cx="200" cy="240" rx="180" ry="20" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.25" strokeDasharray="2 3" />
      <ellipse cx="200" cy="240" rx="120" ry="14" fill="none" stroke="#34d399" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3" />
    </svg>
  );
}

// -------------------------------------------------------------------------
// SatelliteDish — used for satellite dMRV / market / audit illustrations.
// -------------------------------------------------------------------------
export function SatelliteDishIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="dish-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f24" />
          <stop offset="100%" stopColor="#03060f" />
        </linearGradient>
        <radialGradient id="dish-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="280" fill="url(#dish-sky)" />
      <rect width="400" height="280" fill="url(#dish-glow)" />

      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i * 37) % 400;
        const y = (i * 23) % 200;
        return <circle key={i} cx={x} cy={y} r="0.8" fill="#94a3b8" opacity={0.3 + (i % 3) * 0.2} />;
      })}

      {/* Earth horizon */}
      <ellipse cx="200" cy="380" rx="220" ry="120" fill="#0a1a2e" />
      <path d="M 0 250 Q 100 230 200 240 Q 300 250 400 240" fill="none" stroke="#10b981" strokeWidth="0.6" opacity="0.3" />

      {/* Satellite */}
      <g transform="translate(280, 70)">
        <rect x="-12" y="-8" width="24" height="16" rx="2" fill="#1e293b" stroke="#22d3ee" strokeWidth="0.5" />
        <rect x="-26" y="-4" width="12" height="8" fill="#22d3ee" opacity="0.4" />
        <rect x="14" y="-4" width="12" height="8" fill="#22d3ee" opacity="0.4" />
        <circle cx="0" cy="0" r="2" fill="#22d3ee" />
        <line x1="0" y1="0" x2="-60" y2="60" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.7" />
        <line x1="0" y1="0" x2="-90" y2="120" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.4" />
      </g>

      {/* Ground dish */}
      <g transform="translate(140, 200)">
        <ellipse cx="0" cy="0" rx="40" ry="32" fill="#0f172a" stroke="#94a3b8" strokeWidth="0.8" />
        <ellipse cx="0" cy="0" rx="30" ry="22" fill="none" stroke="#22d3ee" strokeWidth="0.4" opacity="0.6" />
        <ellipse cx="0" cy="0" rx="20" ry="13" fill="none" stroke="#22d3ee" strokeWidth="0.4" opacity="0.4" />
        <line x1="-50" y1="40" x2="50" y2="40" stroke="#334155" strokeWidth="2" />
        <line x1="-15" y1="0" x2="-25" y2="40" stroke="#334155" strokeWidth="1" />
        <line x1="15" y1="0" x2="25" y2="40" stroke="#334155" strokeWidth="1" />
      </g>

      {/* Data beam */}
      <path d="M 140 200 L 200 100 L 280 70" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

      {/* Pulse ring */}
      <circle cx="140" cy="200" r="60" fill="none" stroke="#22d3ee" strokeWidth="0.4" opacity="0.3" />
      <circle cx="140" cy="200" r="40" fill="none" stroke="#22d3ee" strokeWidth="0.4" opacity="0.5" />
    </svg>
  );
}

// -------------------------------------------------------------------------
// DACTower — for Direct Air Capture project art.
// -------------------------------------------------------------------------
export function DACTowerIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="dac-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1929" />
          <stop offset="100%" stopColor="#03060f" />
        </linearGradient>
        <linearGradient id="dac-stack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#dac-sky)" />

      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={(i * 47) % 400} cy={(i * 23) % 100} r="0.8" fill="#cbd5e1" opacity="0.3" />
      ))}

      {/* Mountains */}
      <path d="M 0 200 L 60 160 L 120 180 L 180 140 L 260 170 L 320 150 L 400 180 L 400 280 L 0 280 Z" fill="#0a1228" />
      <path d="M 0 220 L 80 200 L 160 210 L 240 190 L 320 200 L 400 210 L 400 280 L 0 280 Z" fill="#070d1e" opacity="0.7" />

      {/* Ground */}
      <rect x="0" y="240" width="400" height="40" fill="#020610" />

      {/* DAC Tower */}
      <g transform="translate(160, 70)">
        <rect x="0" y="0" width="80" height="180" rx="2" fill="url(#dac-stack)" />
        <rect x="0" y="0" width="80" height="20" fill="#0a1228" />
        <rect x="0" y="40" width="80" height="2" fill="#22d3ee" opacity="0.5" />
        <rect x="0" y="80" width="80" height="2" fill="#22d3ee" opacity="0.5" />
        <rect x="0" y="120" width="80" height="2" fill="#22d3ee" opacity="0.5" />
        <rect x="0" y="160" width="80" height="2" fill="#22d3ee" opacity="0.5" />

        {/* Windows */}
        {[15, 55, 95, 135].map((y, i) => (
          <g key={i}>
            <rect x="10" y={y} width="6" height="6" fill="#fbbf24" opacity="0.4" />
            <rect x="22" y={y} width="6" height="6" fill="#fbbf24" opacity="0.3" />
            <rect x="34" y={y} width="6" height="6" fill="#fbbf24" opacity="0.4" />
            <rect x="52" y={y} width="6" height="6" fill="#fbbf24" opacity="0.3" />
            <rect x="64" y={y} width="6" height="6" fill="#fbbf24" opacity="0.4" />
          </g>
        ))}

        {/* Chimney */}
        <rect x="30" y="-30" width="20" height="30" fill="#1e293b" />

        {/* CO2 particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={`co2-${i}`}
            cx={40 + Math.sin(i) * 5}
            cy={-30 - i * 6}
            r={1.5 + (i % 3)}
            fill="#94a3b8"
            opacity={0.4 - i * 0.03}
          />
        ))}

        {/* Logo / brand */}
        <text x="40" y="170" textAnchor="middle" fontSize="8" fontFamily="ui-mono, monospace" fontWeight="700" fill="#22d3ee" opacity="0.7">DAC-01</text>
      </g>

      {/* Pipe */}
      <path d="M 80 240 L 80 220 L 160 220" fill="none" stroke="#1e293b" strokeWidth="4" />
      <path d="M 80 240 L 80 220 L 160 220" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />

      {/* Side tanks */}
      <g transform="translate(60, 180)">
        <rect width="40" height="60" rx="20" fill="#0a1228" />
        <rect width="40" height="60" rx="20" fill="none" stroke="#1e293b" strokeWidth="1" />
        <rect x="6" y="20" width="28" height="20" rx="2" fill="#22d3ee" opacity="0.15" />
      </g>
      <g transform="translate(280, 180)">
        <rect width="40" height="60" rx="20" fill="#0a1228" />
        <rect width="40" height="60" rx="20" fill="none" stroke="#1e293b" strokeWidth="1" />
        <rect x="6" y="10" width="28" height="30" rx="2" fill="#22d3ee" opacity="0.15" />
      </g>

      {/* Data overlay */}
      <g transform="translate(20, 30)">
        <rect width="100" height="36" rx="4" fill="#0a0f24" stroke="#22d3ee" strokeWidth="0.5" opacity="0.7" />
        <text x="6" y="14" fontSize="7" fontFamily="ui-mono, monospace" fill="#94a3b8">CO₂ CAPTURE</text>
        <text x="6" y="28" fontSize="11" fontFamily="ui-mono, monospace" fontWeight="700" fill="#22d3ee">3.42 tCO₂/hr</text>
      </g>
    </svg>
  );
}

// -------------------------------------------------------------------------
// MangroveRoots — for Blue Carbon / wetland projects.
// -------------------------------------------------------------------------
export function MangroveIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="mangrove-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c4a3a" />
          <stop offset="50%" stopColor="#082e2a" />
          <stop offset="100%" stopColor="#03060f" />
        </linearGradient>
        <linearGradient id="mangrove-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a52" />
          <stop offset="100%" stopColor="#0c4a3a" />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill="url(#mangrove-sky)" />
      <rect y="160" width="400" height="120" fill="url(#mangrove-water)" />

      {/* Sun */}
      <circle cx="320" cy="60" r="22" fill="#fbbf24" opacity="0.5" />
      <circle cx="320" cy="60" r="14" fill="#fde68a" opacity="0.7" />

      {/* Reflections */}
      <ellipse cx="320" cy="170" rx="14" ry="3" fill="#fbbf24" opacity="0.3" />
      <ellipse cx="320" cy="180" rx="10" ry="2" fill="#fbbf24" opacity="0.2" />

      {/* Distant islands */}
      <path d="M 0 160 Q 50 145 100 155 Q 150 165 200 150 L 200 160 L 0 160 Z" fill="#082e2a" />

      {/* Mangrove trees */}
      {[40, 100, 170, 240, 320, 370].map((x, i) => (
        <g key={`tree-${i}`} transform={`translate(${x}, 0)`}>
          {/* Roots */}
          <path d={`M 0 160 Q -10 ${180 + (i % 2) * 10} -8 ${200 + (i % 3) * 8}`} fill="none" stroke="#022c22" strokeWidth="1.5" />
          <path d={`M 0 160 Q 10 ${180 + (i % 2) * 10} 8 ${200 + (i % 3) * 8}`} fill="none" stroke="#022c22" strokeWidth="1.5" />
          <path d={`M 0 160 Q -5 ${185} -2 ${210}`} fill="none" stroke="#022c22" strokeWidth="1.5" />
          <path d={`M 0 160 Q 5 ${185} 2 ${210}`} fill="none" stroke="#022c22" strokeWidth="1.5" />
          {/* Trunk */}
          <path d={`M -1 160 L -1 ${100 - (i % 2) * 10} L 1 ${100 - (i % 2) * 10} L 1 160 Z`} fill="#1e4d3a" />
          {/* Canopy */}
          <ellipse cx="0" cy={90 - (i % 2) * 10} rx={22 + (i % 2) * 6} ry={18 + (i % 2) * 4} fill="#065f46" />
          <ellipse cx="-5" cy={85 - (i % 2) * 10} rx={14 + (i % 2) * 3} ry={12 + (i % 2) * 3} fill="#047857" opacity="0.7" />
        </g>
      ))}

      {/* Water ripples */}
      {[200, 220, 240, 260, 280].map((y, i) => (
        <path
          key={`r-${i}`}
          d={`M 0 ${y} Q 100 ${y - 2} 200 ${y} Q 300 ${y + 2} 400 ${y}`}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="0.4"
          opacity={0.3 - i * 0.04}
        />
      ))}

      {/* Fish */}
      <g transform="translate(180, 230)">
        <path d="M 0 0 Q 4 -3 8 0 Q 4 3 0 0 Z" fill="#22d3ee" opacity="0.6" />
        <path d="M 8 0 L 11 -2 L 11 2 Z" fill="#22d3ee" opacity="0.6" />
      </g>
      <g transform="translate(280, 250)">
        <path d="M 0 0 Q 3 -2 6 0 Q 3 2 0 0 Z" fill="#22d3ee" opacity="0.5" />
        <path d="M 6 0 L 8 -1.5 L 8 1.5 Z" fill="#22d3ee" opacity="0.5" />
      </g>
    </svg>
  );
}

// -------------------------------------------------------------------------
// SolarField — for renewable energy projects.
// -------------------------------------------------------------------------
export function SolarFieldIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="solar-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0d2e" />
          <stop offset="100%" stopColor="#3d1846" />
        </linearGradient>
        <linearGradient id="solar-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1024" />
          <stop offset="100%" stopColor="#080412" />
        </linearGradient>
        <linearGradient id="solar-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f0a2e" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#solar-sky)" />
      <rect y="180" width="400" height="100" fill="url(#solar-ground)" />

      {/* Sun */}
      <circle cx="320" cy="60" r="36" fill="#a78bfa" opacity="0.3" />
      <circle cx="320" cy="60" r="24" fill="#c4b5fd" opacity="0.6" />

      {/* Mountains */}
      <path d="M 0 180 L 80 130 L 160 165 L 240 120 L 320 150 L 400 135 L 400 180 Z" fill="#0f0a2e" opacity="0.8" />

      {/* Solar panels grid */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
          const x = 20 + col * 50;
          const y = 200 + row * 24;
          return (
            <g key={`p-${row}-${col}`} transform={`translate(${x}, ${y}) skewX(-20)`}>
              <rect width="40" height="20" fill="url(#solar-panel)" stroke="#6366f1" strokeWidth="0.4" />
              <line x1="13" y1="0" x2="13" y2="20" stroke="#6366f1" strokeWidth="0.3" opacity="0.5" />
              <line x1="26" y1="0" x2="26" y2="20" stroke="#6366f1" strokeWidth="0.3" opacity="0.5" />
              <line x1="0" y1="10" x2="40" y2="10" stroke="#6366f1" strokeWidth="0.3" opacity="0.5" />
              <line x1="-2" y1="22" x2="6" y2="22" stroke="#334155" strokeWidth="1" />
            </g>
          );
        }),
      )}

      {/* Sun rays on panels */}
      <path d="M 320 60 L 60 240" stroke="#fbbf24" strokeWidth="0.4" opacity="0.4" strokeDasharray="3 4" />
      <path d="M 320 60 L 200 250" stroke="#fbbf24" strokeWidth="0.4" opacity="0.4" strokeDasharray="3 4" />
      <path d="M 320 60 L 340 250" stroke="#fbbf24" strokeWidth="0.4" opacity="0.4" strokeDasharray="3 4" />

      {/* Data overlay */}
      <g transform="translate(20, 30)">
        <rect width="120" height="40" rx="4" fill="#0a0a1e" stroke="#a78bfa" strokeWidth="0.5" opacity="0.8" />
        <text x="6" y="14" fontSize="7" fontFamily="ui-mono, monospace" fill="#94a3b8">SOLAR OUTPUT</text>
        <text x="6" y="30" fontSize="11" fontFamily="ui-mono, monospace" fontWeight="700" fill="#a78bfa">187.4 MWh/day</text>
      </g>
    </svg>
  );
}

// -------------------------------------------------------------------------
// MethaneCapture — for methane / industrial projects.
// -------------------------------------------------------------------------
export function MethaneCaptureIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="ch4-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#0a1228" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#ch4-sky)" />
      <rect y="220" width="400" height="60" fill="#060a18" />

      {/* Sun */}
      <circle cx="80" cy="50" r="20" fill="#fbbf24" opacity="0.4" />

      {/* Distant horizon */}
      <line x1="0" y1="180" x2="400" y2="180" stroke="#1e293b" strokeWidth="0.5" />

      {/* Storage tanks */}
      <g transform="translate(40, 130)">
        <ellipse cx="30" cy="0" rx="30" ry="8" fill="#1e293b" />
        <rect x="0" y="0" width="60" height="70" fill="#1e293b" />
        <ellipse cx="30" cy="70" rx="30" ry="8" fill="#0f172a" />
        <rect x="0" y="0" width="60" height="70" fill="none" stroke="#334155" strokeWidth="1" />
        <text x="30" y="40" textAnchor="middle" fontSize="9" fontFamily="ui-mono, monospace" fontWeight="700" fill="#94a3b8">CH₄</text>
      </g>

      {/* Pipeline */}
      <path d="M 100 200 L 200 200 L 200 170 L 280 170" fill="none" stroke="#334155" strokeWidth="6" />
      <path d="M 100 200 L 200 200 L 200 170 L 280 170" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.4" strokeDasharray="6 4" />

      {/* Compressor */}
      <g transform="translate(200, 130)">
        <rect width="60" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="0.6" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#10b981" strokeWidth="1" />
        <circle cx="20" cy="20" r="3" fill="#10b981" />
        <rect x="36" y="14" width="18" height="12" fill="#10b981" opacity="0.2" />
        <text x="30" y="56" textAnchor="middle" fontSize="7" fontFamily="ui-mono, monospace" fill="#94a3b8">COMPRESSOR</text>
      </g>

      {/* Capture flare */}
      <g transform="translate(280, 60)">
        <path d="M 0 110 L 0 30" stroke="#1e293b" strokeWidth="3" />
        <ellipse cx="0" cy="20" rx="14" ry="20" fill="#fbbf24" opacity="0.5" />
        <ellipse cx="0" cy="15" rx="8" ry="14" fill="#fde68a" />
        <ellipse cx="0" cy="10" rx="4" ry="8" fill="#fffbeb" />
        {/* CO2 arrow */}
        <path d="M 0 30 L 30 30" stroke="#10b981" strokeWidth="1.4" markerEnd="url(#arrow)" />
        <text x="36" y="33" fontSize="8" fontFamily="ui-mono, monospace" fill="#10b981">→ captured</text>
      </g>

      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
      </defs>

      {/* Data overlay */}
      <g transform="translate(160, 30)">
        <rect width="140" height="40" rx="4" fill="#0a0a1e" stroke="#fbbf24" strokeWidth="0.5" opacity="0.8" />
        <text x="6" y="14" fontSize="7" fontFamily="ui-mono, monospace" fill="#94a3b8">METHANE CAPTURED</text>
        <text x="6" y="30" fontSize="11" fontFamily="ui-mono, monospace" fontWeight="700" fill="#fbbf24">12.6 kSCFM</text>
      </g>
    </svg>
  );
}

// -------------------------------------------------------------------------
// SoilLayers — for soil sequestration projects.
// -------------------------------------------------------------------------
export function SoilLayersIllustration({ className }) {
  return (
    <svg viewBox="0 0 400 280" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="soil-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0f24" />
          <stop offset="100%" stopColor="#3d1f2e" />
        </linearGradient>
      </defs>
      <rect width="400" height="100" fill="url(#soil-sky)" />

      {/* Sun */}
      <circle cx="320" cy="40" r="22" fill="#fb7185" opacity="0.4" />
      <circle cx="320" cy="40" r="14" fill="#fda4af" opacity="0.6" />

      {/* Plants on top */}
      {[40, 80, 130, 180, 240, 310, 360].map((x, i) => (
        <g key={i} transform={`translate(${x}, 100)`}>
          <path d="M 0 0 L 0 -16" stroke="#22c55e" strokeWidth="1" />
          <ellipse cx="-4" cy="-10" rx="6" ry="3" fill="#16a34a" />
          <ellipse cx="4" cy="-14" rx="6" ry="3" fill="#22c55e" />
        </g>
      ))}

      {/* Soil layers */}
      <rect y="100" width="400" height="20" fill="#92400e" />
      <rect y="120" width="400" height="25" fill="#78350f" />
      <rect y="145" width="400" height="30" fill="#451a03" />
      <rect y="175" width="400" height="35" fill="#292524" />
      <rect y="210" width="400" height="70" fill="#1c1917" />

      {/* Roots */}
      {[60, 120, 200, 270, 340].map((x, i) => (
        <g key={`root-${i}`} transform={`translate(${x}, 100)`}>
          <path d="M 0 0 Q -5 20 0 40 Q 5 50 -3 70" fill="none" stroke="#78350f" strokeWidth="0.8" />
          <path d="M 0 0 Q 5 25 3 50 Q -2 60 5 80" fill="none" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="-3" cy="40" r="1.2" fill="#22c55e" />
          <circle cx="3" cy="55" r="1.2" fill="#22c55e" />
        </g>
      ))}

      {/* Sensor probe */}
      <g transform="translate(280, 100)">
        <rect x="-3" y="-12" width="6" height="14" fill="#94a3b8" />
        <rect x="-8" y="2" width="16" height="40" rx="2" fill="#0f172a" stroke="#fb7185" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="0" y2="42" stroke="#fb7185" strokeWidth="0.4" />
        <text x="0" y="56" textAnchor="middle" fontSize="6" fontFamily="ui-mono, monospace" fill="#fb7185">SOC SENSOR</text>
      </g>

      {/* Data overlay */}
      <g transform="translate(20, 30)">
        <rect width="140" height="40" rx="4" fill="#0a0a1e" stroke="#fb7185" strokeWidth="0.5" opacity="0.8" />
        <text x="6" y="14" fontSize="7" fontFamily="ui-mono, monospace" fill="#94a3b8">SOIL CARBON</text>
        <text x="6" y="30" fontSize="11" fontFamily="ui-mono, monospace" fontWeight="700" fill="#fb7185">+1.42 % SOC</text>
      </g>
    </svg>
  );
}

// -------------------------------------------------------------------------
// Logo / wordmark for use in hero mockup & empty states.
// -------------------------------------------------------------------------
export function MetricGreenMark({ className }) {
  return (
    <svg viewBox="0 0 80 80" className={cn("h-12 w-12", className)} aria-hidden>
      <defs>
        <linearGradient id="mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="20" fill="#03060f" />
      <rect x="1" y="1" width="78" height="78" rx="19" fill="none" stroke="url(#mark-grad)" strokeWidth="1" opacity="0.5" />
      <g transform="translate(40, 40)">
        <path
          d="M -2 -22 C -2 -22 -16 -10 -16 4 C -16 14 -8 22 2 22 C 12 22 18 14 18 4 C 18 -8 8 -16 -2 -22 Z"
          fill="url(#mark-grad)"
          opacity="0.9"
        />
        <path d="M -2 -22 C -2 -22 -16 -10 -16 4" fill="none" stroke="#03060f" strokeWidth="0.5" />
        <line x1="-2" y1="-22" x2="-2" y2="22" stroke="#03060f" strokeWidth="0.6" opacity="0.5" />
      </g>
    </svg>
  );
}

// -------------------------------------------------------------------------
// Credential / Certificate illustration for empty/connected states.
// -------------------------------------------------------------------------
export function CredentialBadge({ className }) {
  return (
    <svg viewBox="0 0 200 140" className={cn("h-auto w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="cred-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" rx="8" fill="url(#cred-bg)" stroke="#10b981" strokeWidth="0.6" />
      <rect x="8" y="8" width="184" height="124" rx="4" fill="none" stroke="#10b981" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.5" />
      <circle cx="100" cy="50" r="20" fill="none" stroke="#34d399" strokeWidth="1.5" />
      <path d="M 92 50 L 98 56 L 108 44" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
      <text x="100" y="90" textAnchor="middle" fontSize="9" fontFamily="ui-sans-serif, system-ui" fontWeight="800" fill="#fff" letterSpacing="1">VERIFIED</text>
      <text x="100" y="104" textAnchor="middle" fontSize="7" fontFamily="ui-mono, monospace" fill="#6ee7b7" letterSpacing="2">VCS001</text>
      <text x="100" y="118" textAnchor="middle" fontSize="6" fontFamily="ui-mono, monospace" fill="#6ee7b7" opacity="0.6">0x8f7b…7f8a</text>
    </svg>
  );
}
