import { useState, useMemo } from 'react';

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  data: Slice[];
  size?: number;
  centerLabel?: string;
}

export function DoughnutChart({ data, size = 200, centerLabel = 'المجموع' }: DoughnutChartProps): JSX.Element {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const radius = size / 2 - 12;
  const innerRadius = radius * 0.62;
  const cx = size / 2;
  const cy = size / 2;

  const arcs = useMemo(() => {
    let angle = -Math.PI / 2;
    return data.map((slice) => {
      const fraction = total ? slice.value / total : 0;
      const sweep = fraction * Math.PI * 2;
      const startAngle = angle;
      const endAngle = angle + sweep;
      const midAngle = startAngle + sweep / 2;
      angle = endAngle;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const ix1 = cx + innerRadius * Math.cos(endAngle);
      const iy1 = cy + innerRadius * Math.sin(endAngle);
      const ix2 = cx + innerRadius * Math.cos(startAngle);
      const iy2 = cy + innerRadius * Math.sin(startAngle);
      const largeArc = sweep > Math.PI ? 1 : 0;
      return {
        path: `M${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} L${ix1},${iy1} A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${ix2},${iy2} Z`,
        color: slice.color,
        label: slice.label,
        value: slice.value,
        fraction,
        midAngle,
      };
    });
  }, [data, total, cx, cy, radius, innerRadius]);

  const centerDisplay = hoveredIdx !== null
    ? { value: arcs[hoveredIdx].value, label: arcs[hoveredIdx].label }
    : { value: total, label: centerLabel };

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="select-none"
        >
          {arcs.map((arc, i) => {
            const isHovered = hoveredIdx === i;
            const tx = Math.cos(arc.midAngle) * (isHovered ? 5 : 0);
            const ty = Math.sin(arc.midAngle) * (isHovered ? 5 : 0);
            return (
              <path
                key={i}
                d={arc.path}
                fill={arc.color}
                opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
                transform={`translate(${tx},${ty})`}
                style={{ transition: 'opacity 0.2s ease, transform 0.2s ease' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold leading-none transition-all duration-200"
            style={{ color: hoveredIdx !== null ? arcs[hoveredIdx].color : undefined }}
          >
            {centerDisplay.value}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{centerDisplay.label}</p>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {arcs.map((arc, i) => (
          <div
            key={arc.label}
            className="flex items-center justify-between gap-3 py-1 px-2 rounded-lg transition-colors duration-150 cursor-pointer"
            style={{ backgroundColor: hoveredIdx === i ? `${arc.color}12` : 'transparent' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-3 w-3 rounded flex-shrink-0 transition-transform duration-150"
                style={{ background: arc.color, transform: hoveredIdx === i ? 'scale(1.3)' : 'scale(1)' }}
              />
              <span className="text-sm truncate">{arc.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-semibold">{arc.value}</span>
              <span className="text-[11px] text-muted-foreground">
                {Math.round(arc.fraction * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
