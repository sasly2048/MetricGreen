"use client";

export function Sparkline({ data, color = "#10b981", height = 40, className }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * stepX},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(" ");
  const area = `M0,${height} L${points} L${width},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`h-[${height}px] w-full ${className || ""}`}
      style={{ height }}
    >
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.replace("#", "")})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function AreaChart({ data, color = "#10b981", height = 160, className }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data) * 1.05;
  const min = 0;
  const range = max - min || 1;
  const width = 600;
  const heightPx = height;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = heightPx - ((v - min) / range) * (heightPx - 12) - 4;
    return [x, y];
  });
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${heightPx} L0,${heightPx} Z`;
  const id = `area-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${heightPx}`}
      preserveAspectRatio="none"
      className={`h-[${heightPx}px] w-full ${className || ""}`}
      style={{ height: heightPx }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={width}
          y1={heightPx * p}
          y2={heightPx * p}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path d={areaPath} fill={`url(#${id})`} />
      <path
        d={linePath}
        fill="none"
        stroke={`url(#${id}-line)`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DonutChart({ data, size = 200, thickness = 24, className }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  const segments = data.reduce((acc, d) => {
    const length = (d.value / total) * c;
    acc.items.push({
      ...d,
      dasharray: `${length} ${c - length}`,
      dashoffset: -acc.total,
    });
    acc.total += length;
    return acc;
  }, { items: [], total: 0 }).items;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} style={{ width: size, height: size }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={thickness}
      />
      {segments.map((d, i) => (
        <circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={d.color}
          strokeWidth={thickness}
          strokeDasharray={d.dasharray}
          strokeDashoffset={d.dashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}

export function BarChart({ data, height = 160, color = "#10b981", className }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value));
  const width = 600;
  const barW = (width / data.length) * 0.7;
  const gap = (width / data.length) * 0.3;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className} style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 8);
        const x = i * (barW + gap) + gap / 2;
        const y = height - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} fill={color} opacity="0.6" rx="2" />
            <rect x={x} y={y} width={barW} height={Math.min(2, h)} fill={color} rx="1" />
            <text
              x={x + barW / 2}
              y={height + 12}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(255,255,255,0.3)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
