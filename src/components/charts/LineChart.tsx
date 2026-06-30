import { useMemo, useState, useCallback, useRef } from 'react';

interface Series {
  name: string;
  color: string;
  data: number[];
}

interface LineChartProps {
  labels: string[];
  series: Series[];
  height?: number;
  areaFill?: boolean;
  rtl?: boolean;
  formatValue?: (v: number) => string;
}

export function LineChart({ labels, series, height = 240, areaFill = true, rtl = true, formatValue }: LineChartProps): JSX.Element {
  const width = 600;
  const padding = { top: 20, right: 40, bottom: 32, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const displayLabels = useMemo(() => rtl ? [...labels].reverse() : labels, [labels, rtl]);
  const displaySeries = useMemo(() =>
    rtl ? series.map((s) => ({ ...s, data: [...s.data].reverse() })) : series,
    [series, rtl]
  );

  const maxY = useMemo(
    () => Math.max(...displaySeries.flatMap((s) => s.data), 10),
    [displaySeries]
  );
  const stepX = innerW / Math.max(displayLabels.length - 1, 1);
  const yGrid = [0, 0.25, 0.5, 0.75, 1];

  const point = (i: number, v: number): { x: number; y: number } => ({
    x: padding.left + i * stepX,
    y: padding.top + innerH - (v / maxY) * innerH,
  });

  const smoothPath = (data: number[]): string => {
    if (data.length < 2) return '';
    const points = data.map((v, i) => point(i, v));
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const fmt = formatValue ?? ((v: number) => v.toLocaleString());


  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const relX = mouseX - padding.left;
    const idx = Math.round(relX / stepX);
    if (idx >= 0 && idx < displayLabels.length) {
      setHoveredIdx(idx);
    } else {
      setHoveredIdx(null);
    }
  }, [stepX, displayLabels.length]);

  return (
    <div ref={containerRef} className="w-full relative" onMouseMove={handleContainerMouseMove} onMouseLeave={() => setHoveredIdx(null)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {displaySeries.map((s) => (
            <linearGradient key={`grad-${s.name}`} id={`area-${s.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {yGrid.map((g) => (
          <line
            key={g}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - g)}
            y2={padding.top + innerH * (1 - g)}
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeDasharray="4 4"
          />
        ))}
        {yGrid.map((g) => (
          <text
            key={`yl-${g}`}
            x={rtl ? width - padding.right + 6 : padding.left - 6}
            y={padding.top + innerH * (1 - g) + 4}
            fontSize="10"
            textAnchor={rtl ? 'start' : 'end'}
            fill="currentColor"
            opacity="0.45"
          >
            {Math.round(maxY * g).toLocaleString()}
          </text>
        ))}
        {displayLabels.map((lbl, i) => (
          <text
            key={lbl + i}
            x={padding.left + i * stepX}
            y={height - 8}
            fontSize="10"
            textAnchor="middle"
            fill="currentColor"
            opacity={hoveredIdx === i ? 1 : 0.55}
            fontWeight={hoveredIdx === i ? 600 : 400}
          >
            {lbl}
          </text>
        ))}

        {hoveredIdx !== null && (
          <line
            x1={padding.left + hoveredIdx * stepX}
            x2={padding.left + hoveredIdx * stepX}
            y1={padding.top}
            y2={padding.top + innerH}
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        )}

        {displaySeries.map((s) => {
          const d = smoothPath(s.data);
          const lastPt = point(s.data.length - 1, s.data[s.data.length - 1]);
          const firstPt = point(0, s.data[0]);
          const area = d + ` L${lastPt.x},${padding.top + innerH} L${firstPt.x},${padding.top + innerH} Z`;
          return (
            <g key={s.name}>
              {areaFill && (
                <path d={area} fill={`url(#area-${s.name})`}>
                  <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
                </path>
              )}
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <animate attributeName="stroke-dashoffset" from="2000" to="0" dur="1s" fill="freeze" />
                <animate attributeName="stroke-dasharray" from="2000" to="2000" dur="0.01s" fill="freeze" />
              </path>
              {s.data.map((v, i) => {
                const p = point(i, v);
                const isHovered = hoveredIdx === i;
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? s.color : 'white'}
                    stroke={s.color}
                    strokeWidth={isHovered ? 3 : 2}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {hoveredIdx !== null && (() => {
        const pctX = ((padding.left + hoveredIdx * stepX) / width) * 100;
        const topVal = displaySeries[0]?.data[hoveredIdx] ?? 0;
        const pctY = ((padding.top + innerH - (topVal / maxY) * innerH) / height) * 100;
        return (
          <div
            className="absolute z-50 pointer-events-none bg-popover text-popover-foreground border border-border rounded-xl shadow-lg px-3 py-2.5 text-xs whitespace-nowrap"
            style={{
              left: `${pctX}%`,
              top: `${Math.max(pctY - 4, 0)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-semibold text-center mb-1.5 text-[11px]">{displayLabels[hoveredIdx]}</p>
            {displaySeries.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4 py-0.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-bold" style={{ color: s.color }}>{fmt(s.data[hoveredIdx])}</span>
              </div>
            ))}
          </div>
        );
      })()}

      <div className="flex flex-wrap justify-center gap-4 px-2 mt-2">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}
