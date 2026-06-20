import { useMemo } from "react";
import { cn } from "../utils/cn";

/* -------------------- Donut / Ring -------------------- */

export function Ring({
  value,
  size = 160,
  stroke = 12,
  label,
  sublabel,
  tone = "emerald",
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  tone?: "emerald" | "cyan" | "amber" | "rose";
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const tones: Record<string, string> = {
    emerald: "#34d399",
    cyan: "#22d3ee",
    amber: "#fbbf24",
    rose: "#fb7185",
  };
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${tone}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tones[tone]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={tones[tone]} stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1f2434" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#ring-${tone})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold tabular-nums text-ink-50">{Math.round(v)}</div>
        {label ? <div className="mt-0.5 text-[11px] uppercase tracking-widest text-ink-400">{label}</div> : null}
        {sublabel ? <div className="text-[10px] text-ink-500">{sublabel}</div> : null}
      </div>
    </div>
  );
}

/* -------------------- Sparkline -------------------- */

export function Sparkline({
  data,
  width = 240,
  height = 64,
  color = "#34d399",
  fill = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}) {
  const { path, area } = useMemo(() => {
    if (data.length === 0) return { path: "", area: "" };
    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = max - min || 1;
    const step = width / (data.length - 1 || 1);
    const pts = data.map((d, i) => {
      const x = i * step;
      const y = height - ((d - min) / span) * (height - 8) - 4;
      return [x, y] as const;
    });
    const p = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(" ");
    const a = `${p} L${width.toFixed(1)},${height} L0,${height} Z`;
    return { path: p, area: a };
  }, [data, width, height]);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? <path d={area} fill={`url(#spark-${color})`} /> : null}
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------- Bar chart -------------------- */

export function Bars({
  data,
  width = 520,
  height = 220,
}: {
  data: { label: string; commits: number; reviews: number; incidents: number }[];
  width?: number;
  height?: number;
}) {
  const padding = { top: 16, right: 12, bottom: 32, left: 32 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = Math.max(...data.flatMap((d) => [d.commits, d.reviews])) * 1.1;
  const groupW = plotW / data.length;
  const barW = Math.max(8, groupW * 0.28);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {yTicks.map((t) => {
        const y = padding.top + plotH - (t / max) * plotH;
        return (
          <g key={t}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#1f2434" strokeDasharray="3 4" />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize={10} fill="#656e82">
              {t}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const xBase = padding.left + i * groupW + groupW / 2;
        const hC = (d.commits / max) * plotH;
        const hR = (d.reviews / max) * plotH;
        return (
          <g key={d.label}>
            <rect
              x={xBase - barW - 2}
              y={padding.top + plotH - hC}
              width={barW}
              height={hC}
              rx={3}
              fill="url(#bar-commit)"
            />
            <rect
              x={xBase + 2}
              y={padding.top + plotH - hR}
              width={barW}
              height={hR}
              rx={3}
              fill="url(#bar-review)"
            />
            {d.incidents > 0 ? (
              <circle
                cx={xBase}
                cy={padding.top + plotH - hC - 8}
                r={3}
                fill="#fb7185"
              />
            ) : null}
            <text x={xBase} y={height - 12} textAnchor="middle" fontSize={10} fill="#8891a3">
              {d.label}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="bar-commit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bar-review" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* -------------------- Radar chart -------------------- */

export function Radar({
  skills,
  size = 280,
}: {
  skills: { name: string; score: number }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 38;
  const n = skills.length;

  const point = (idx: number, value: number) => {
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
    const r = (value / 100) * radius;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} className="mx-auto">
      {rings.map((r) => (
        <polygon
          key={r}
          points={skills
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
              return `${cx + Math.cos(angle) * radius * r},${cy + Math.sin(angle) * radius * r}`;
            })
            .join(" ")}
          fill="none"
          stroke="#1f2434"
          strokeWidth={1}
        />
      ))}
      {skills.map((s, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + Math.cos(angle) * (radius + 18);
        const y = cy + Math.sin(angle) * (radius + 18);
        return (
          <text
            key={s.name}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#b2b9c6"
          >
            {s.name}
          </text>
        );
      })}
      <polygon
        points={skills.map((s, i) => point(i, s.score).join(",")).join(" ")}
        fill="rgba(16,185,129,0.2)"
        stroke="#34d399"
        strokeWidth={1.5}
      />
      {skills.map((s, i) => {
        const [x, y] = point(i, s.score);
        return <circle key={s.name} cx={x} cy={y} r={3} fill="#34d399" />;
      })}
    </svg>
  );
}

/* -------------------- Knowledge dependency graph -------------------- */

export function KnowledgeGraph({
  nodes,
  edges,
  width = 880,
  height = 560,
  onSelect,
  selectedId,
}: {
  nodes: { id: string; label: string; type: string; risk: number; ownerCount: number; x: number; y: number }[];
  edges: { from: string; to: string; weight: number }[];
  width?: number;
  height?: number;
  onSelect?: (id: string | null) => void;
  selectedId?: string | null;
}) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const typeColor = (t: string) => {
    switch (t) {
      case "service":
        return "#34d399";
      case "db":
        return "#22d3ee";
      case "queue":
        return "#a78bfa";
      case "api":
        return "#fbbf24";
      default:
        return "#b2b9c6";
    }
  };

  const riskColor = (r: number) => {
    if (r >= 0.75) return "#fb7185";
    if (r >= 0.5) return "#fbbf24";
    return "#34d399";
  };

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="select-none">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5368" />
        </marker>
      </defs>

      {edges.map((e, idx) => {
        const a = nodeMap.get(e.from);
        const b = nodeMap.get(e.to);
        if (!a || !b) return null;
        const highlight = selectedId === e.from || selectedId === e.to;
        return (
          <line
            key={idx}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={highlight ? "#8891a3" : "#343a4c"}
            strokeWidth={Math.max(1, e.weight * 0.6)}
            opacity={highlight ? 1 : 0.55}
            markerEnd="url(#arrow)"
          />
        );
      })}

      {nodes.map((n) => {
        const radius = 22 + n.ownerCount * 2;
        const selected = selectedId === n.id;
        const dimmed = selectedId && !selected;
        return (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            onClick={() => onSelect?.(selectedId === n.id ? null : n.id)}
            opacity={dimmed ? 0.45 : 1}
          >
            <circle r={radius + 6} fill={riskColor(n.risk)} opacity={0.12} />
            <circle r={radius} fill="#121624" stroke={typeColor(n.type)} strokeWidth={2} />
            <circle r={radius - 6} fill={typeColor(n.type)} opacity={0.15} />
            <text textAnchor="middle" dominantBaseline="middle" y={-2} fontSize={11} fontWeight={600} fill="#eceef2">
              {n.label}
            </text>
            <text textAnchor="middle" y={12} fontSize={9} fill="#b2b9c6">
              {n.ownerCount} {n.ownerCount === 1 ? "owner" : "owners"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------- Contribution heatmap -------------------- */

export function Heatmap({
  weeks = 24,
  seed = 42,
}: {
  weeks?: number;
  seed?: number;
}) {
  // deterministic pseudo-random so heatmap doesn't flicker
  const rand = (i: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 233280;
    return x - Math.floor(x);
  };
  const days = weeks * 7;
  const cells = Array.from({ length: days }, (_, i) => {
    const r = rand(i);
    const level = r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.94 ? 3 : 4;
    return level;
  });

  const cellSize = 11;
  const gap = 3;
  const cols = weeks;
  const rows = 7;

  const tones = ["#0f1320", "#065f46", "#059669", "#10b981", "#34d399"];

  return (
    <div className="no-scrollbar overflow-x-auto">
      <svg width={cols * (cellSize + gap)} height={rows * (cellSize + gap)}>
        {cells.map((lvl, i) => {
          const col = Math.floor(i / 7);
          const row = i % 7;
          return (
            <rect
              key={i}
              x={col * (cellSize + gap)}
              y={row * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={tones[lvl]}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------- Legend -------------------- */

export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-ink-300">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: it.color }} />
          {it.label}
        </div>
      ))}
    </div>
  );
}

export function InlineSparkline({
  value,
  tone = "emerald",
}: {
  value: number;
  tone?: "emerald" | "cyan" | "amber" | "rose";
}) {
  const tones: Record<string, string> = {
    emerald: "#34d399",
    cyan: "#22d3ee",
    amber: "#fbbf24",
    rose: "#fb7185",
  };
  const series = Array.from({ length: 12 }, (_, i) =>
    Math.max(5, value + Math.sin(i + value / 7) * 10 + (i / 12) * 8),
  );
  return <Sparkline data={series} width={120} height={36} color={tones[tone]} />;
}

export { cn };
