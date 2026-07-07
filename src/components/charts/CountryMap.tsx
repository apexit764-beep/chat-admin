import { useState, useMemo } from 'react';

interface CountryDatum {
  code: string;
  name: string;
  flag: string;
  count: number;
  mrr?: number;
}

interface CountryMapProps {
  data: CountryDatum[];
  height?: number;
}

const COUNTRY_COORDS: Record<string, { lon: number; lat: number }> = {
  EG: { lon: 30.5, lat: 26.5 },
  JO: { lon: 36.5, lat: 31.2 },
  SA: { lon: 45.5, lat: 24.5 },
  KW: { lon: 47.7, lat: 29.4 },
  BH: { lon: 50.55, lat: 26.05 },
  QA: { lon: 51.25, lat: 25.3 },
  AE: { lon: 54.3, lat: 24.4 },
  OM: { lon: 56.5, lat: 21.5 },
};

const W = 1000;
const H = 500;

const toX = (lon: number): number => ((lon + 180) / 360) * W;
const toY = (lat: number): number => ((90 - lat) / 180) * H;

const CONTINENTS = `
M 83 56 L 175 45 L 260 42 L 320 50 L 347 78 L 350 115 L 330 140 L 290 175 L 250 200 L 220 195 L 195 175 L 165 145 L 135 105 L 100 78 Z
M 230 200 L 258 218 L 275 240 L 268 248 L 248 232 L 232 212 Z
M 285 240 L 320 232 L 370 248 L 405 278 L 395 320 L 360 365 L 322 400 L 305 405 L 290 380 L 282 330 L 278 285 Z
M 361 28 L 425 25 L 445 48 L 432 72 L 388 82 L 365 65 Z
M 478 144 L 510 92 L 555 65 L 605 75 L 680 80 L 695 120 L 670 145 L 612 152 L 560 152 L 510 152 Z
M 478 155 L 540 152 L 595 162 L 625 185 L 642 220 L 632 260 L 612 305 L 580 340 L 545 350 L 520 332 L 508 295 L 510 252 L 490 222 L 460 205 L 455 185 Z
M 600 145 L 680 82 L 770 56 L 900 60 L 970 75 L 990 90 L 970 110 L 935 122 L 890 150 L 855 175 L 825 200 L 795 222 L 760 235 L 720 235 L 695 210 L 685 178 L 660 172 L 615 158 Z
M 700 175 L 728 195 L 745 222 L 730 240 L 710 230 L 695 205 Z
M 795 235 L 875 240 L 882 252 L 845 258 L 800 252 Z
M 805 263 L 870 268 L 860 280 L 820 275 Z
M 814 285 L 870 278 L 925 285 L 922 322 L 895 352 L 845 355 L 815 340 L 810 312 Z
M 940 365 L 968 360 L 972 378 L 952 388 L 938 378 Z
`;

export function CountryMap({ data, height = 320 }: CountryMapProps): JSX.Element {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const items = useMemo(() => {
    const max = Math.max(...data.map((d) => d.count), 1);
    return data
      .filter((d) => COUNTRY_COORDS[d.code])
      .map((d) => {
        const c = COUNTRY_COORDS[d.code];
        const x = toX(c.lon);
        const y = toY(c.lat);
        const ratio = d.count / max;
        const r = 7 + Math.sqrt(ratio) * 16;
        return { ...d, x, y, r, ratio };
      });
  }, [data]);

  const total = useMemo(() => data.reduce((a, d) => a + d.count, 0), [data]);
  const hovered = hoveredCode ? items.find((i) => i.code === hoveredCode) ?? null : null;

  return (
    <div className="w-full relative" style={{ minHeight: height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ocean-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.02" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="land-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.10" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.07" />
          </linearGradient>
          <filter id="bubble-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#ocean-bg)" />

        {[0, 30, 60, -30, -60].map((lat) => (
          <line
            key={`lat-${lat}`}
            x1={0}
            x2={W}
            y1={toY(lat)}
            y2={toY(lat)}
            stroke="currentColor"
            strokeOpacity="0.04"
            strokeDasharray="2 6"
          />
        ))}
        {[-120, -60, 0, 60, 120].map((lon) => (
          <line
            key={`lon-${lon}`}
            x1={toX(lon)}
            x2={toX(lon)}
            y1={0}
            y2={H}
            stroke="currentColor"
            strokeOpacity="0.04"
            strokeDasharray="2 6"
          />
        ))}

        <path
          d={CONTINENTS}
          fill="url(#land-grad)"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="0.75"
          fillRule="evenodd"
        />

        {items.map((it) => {
          const isHovered = hoveredCode === it.code;
          const dim = hoveredCode !== null && !isHovered;
          return (
            <g
              key={it.code}
              transform={`translate(${it.x},${it.y})`}
              style={{
                opacity: dim ? 0.3 : 1,
                transition: 'opacity 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredCode(it.code)}
              onMouseLeave={() => setHoveredCode(null)}
            >
              <circle
                r={it.r + 5}
                fill="#2563EB"
                opacity={isHovered ? 0.22 : 0.12}
                style={{ transition: 'opacity 0.2s ease' }}
              />
              <circle
                r={it.r}
                fill="#2563EB"
                fillOpacity={0.9}
                stroke="white"
                strokeWidth={isHovered ? 2.5 : 2}
                filter="url(#bubble-shadow)"
                style={{ transition: 'all 0.2s ease' }}
              />
              <text
                y={3.5}
                textAnchor="middle"
                fontSize={Math.max(9, it.r * 0.65)}
                fontWeight={700}
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {it.count}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="absolute z-50 pointer-events-none bg-popover text-popover-foreground border border-border rounded-xl shadow-lg px-3 py-2.5 text-xs whitespace-nowrap"
          style={{
            left: `${(hovered.x / W) * 100}%`,
            top: `${(hovered.y / H) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 14px))',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base leading-none">{hovered.flag}</span>
            <span className="font-bold">{hovered.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">العملاء</span>
            <span className="font-bold text-primary">{hovered.count}</span>
          </div>
          {typeof hovered.mrr === 'number' && hovered.mrr > 0 && (
            <div className="flex items-center justify-between gap-4 mt-0.5">
              <span className="text-muted-foreground">MRR</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">${hovered.mrr.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 mt-0.5">
            <span className="text-muted-foreground">من الإجمالي</span>
            <span className="font-semibold">{total ? Math.round((hovered.count / total) * 100) : 0}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
