import React, { useLayoutEffect, useRef, useState } from 'react';
import { fmtDay, fmtNum } from './ui';

// Validated categorical slots (light surface): blue, orange. See dataviz palette.
export const SERIES_COLORS = ['#2a78d6', '#eb6834'] as const;
const GRID = '#0B192C14';
const AXIS_TEXT = '#0B192C99';

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceScale(max: number) {
  const target = Math.max(max, 4);
  const raw = target / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  const top = Math.ceil(target / step) * step;
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

/** Column with 4px rounded top corners and a square base. */
function topRoundedRect(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

export interface Series<K extends string> {
  key: K;
  label: string;
  color: string;
}

export function Legend<K extends string>({ series }: { series: Series<K>[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-[#0B192C]/80">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color }} aria-hidden />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/** Daily stacked columns sharing one y-axis, with a per-day hover/focus tooltip. */
export function StackedColumns<K extends string>({
  data,
  series,
  height = 220,
}: {
  data: ({ date: string } & Record<K, number>)[];
  series: Series<K>[];
  height?: number;
}) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const m = { top: 10, right: 6, bottom: 24, left: 30 };
  const innerW = Math.max(0, width - m.left - m.right);
  const innerH = height - m.top - m.bottom;
  const totals = data.map((d) => series.reduce((sum, s) => sum + d[s.key], 0));
  const { top, ticks } = niceScale(Math.max(0, ...totals));
  const band = data.length ? innerW / data.length : 0;
  const barW = Math.max(2, Math.min(24, band * 0.68));
  const y = (v: number) => m.top + innerH - (v / top) * innerH;
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(innerW / 70)));

  const tip = active !== null ? data[active] : null;
  const tipLeft = active !== null ? Math.min(Math.max(m.left + band * active + band / 2, 80), width - 80) : 0;

  return (
    <div ref={wrapRef} className="relative w-full" onMouseLeave={() => setActive(null)}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="দৈনিক ডেমো রিকোয়েস্ট ও বুকিং">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} stroke={GRID} />
              <text x={m.left - 6} y={y(t)} dy="0.32em" textAnchor="end" fontSize="10" fill={AXIS_TEXT}>
                {fmtNum(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = m.left + band * i + (band - barW) / 2;
            let acc = 0;
            const segs = series
              .map((s) => ({ s, v: d[s.key] }))
              .filter((seg) => seg.v > 0)
              .map((seg, j, arr) => {
                const y0 = y(acc);
                acc += seg.v;
                const y1 = y(acc);
                // 2px surface gap between stacked segments.
                const gap = j > 0 ? 2 : 0;
                const h = Math.max(0, y0 - y1 - gap);
                const isTop = j === arr.length - 1;
                return isTop ? (
                  <path key={seg.s.key} d={topRoundedRect(x, y1, barW, h)} fill={seg.s.color} />
                ) : (
                  <rect key={seg.s.key} x={x} y={y1 + 0} width={barW} height={h} fill={seg.s.color} />
                );
              });
            return (
              <g key={d.date}>
                {active === i && (
                  <rect x={m.left + band * i} y={m.top} width={band} height={innerH} fill="#0B192C" opacity={0.05} />
                )}
                {segs}
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={height - 6} textAnchor="middle" fontSize="10" fill={AXIS_TEXT}>
                    {fmtDay(d.date, false)}
                  </text>
                )}
                {/* Hit target: the whole column band, larger than the mark. */}
                <rect
                  x={m.left + band * i}
                  y={m.top}
                  width={band}
                  height={innerH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${fmtDay(d.date)}: ${series.map((s) => `${s.label} ${fmtNum(d[s.key])}`).join(', ')}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  style={{ outline: 'none' }}
                />
              </g>
            );
          })}
          <line x1={m.left} x2={width - m.right} y1={y(0)} y2={y(0)} stroke="#0B192C40" />
        </svg>
      )}

      {tip && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-[#0B192C]/10 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: tipLeft }}
        >
          <div className="mb-1 font-bold text-[#0B192C]">{fmtDay(tip.date)}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4 font-medium text-[#0B192C]/80">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[2px]" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-bold text-[#0B192C]">{fmtNum(tip[s.key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Single-series horizontal bars with the value printed at the bar end. */
export function HBars({
  rows,
  color = SERIES_COLORS[0],
  labelFor = (l: string) => l,
}: {
  rows: { label: string; value: number }[];
  color?: string;
  labelFor?: (label: string) => string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (!rows.length) return <p className="py-6 text-center text-xs font-semibold text-[#0B192C]/50">এই সময়ে কোনো ডেটা নেই</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li
          key={r.label}
          className="group"
          title={`${labelFor(r.label)}: ${fmtNum(r.value)} (${fmtNum(Math.round((r.value / total) * 100))}%)`}
        >
          <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
            <span className="truncate font-semibold text-[#0B192C]/80">{labelFor(r.label)}</span>
            <span className="font-bold text-[#0B192C]">{fmtNum(r.value)}</span>
          </div>
          <div className="h-3 w-full">
            <div
              className="h-3 rounded-r-[4px] transition-opacity group-hover:opacity-80"
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
