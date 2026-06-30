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

const LON_MIN = 26;
const LON_MAX = 60;
const LAT_MIN = 15;
const LAT_MAX = 34;
const W = 520;
const H = 320;

const toX = (lon: number): number => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
const toY = (lat: number): number => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;

const REGION_PATH = 'M 45,95 L 85,80 L 130,75 L 175,85 L 180,140 L 165,200 L 130,250 L 90,235 L 55,200 L 35,150 Z';
const PENINSULA_PATH = 'M 175,90 L 235,80 L 295,85 L 345,95 L 395,115 L 440,145 L 470,180 L 480,220 L 460,255 L 415,265 L 365,255 L 320,235 L 280,205 L 240,170 L 210,140 L 185,115 Z';

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
        const r = 8 + Math.sqrt(ratio) * 22;
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
          <radialGradient id="map-bg" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.04" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="land-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
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

        <rect x="0" y="0" width={W} height={H} fill="url(#map-bg)" />

        {[20, 25, 30].map((lat) => (
          <line
            key={`lat-${lat}`}
            x1={0}
            x2={W}
            y1={toY(lat)}
            y2={toY(lat)}
            stroke="currentColor"
            strokeOpacity="0.05"
            strokeDasharray="3 5"
          />
        ))}
        {[30, 40, 50].map((lon) => (
          <line
            key={`lon-${lon}`}
            x1={toX(lon)}
            x2={toX(lon)}
            y1={0}
            y2={H}
            stroke="currentColor"
            strokeOpacity="0.05"
            strokeDasharray="3 5"
          />
        ))}

        <path d={REGION_PATH} fill="url(#land-grad)" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
        <path d={PENINSULA_PATH} fill="url(#land-grad)" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />

        {items.map((it) => {
          const isHovered = hoveredCode === it.code;
          const dim = hoveredCode !== null && !isHovered;
          return (
            <g
              key={it.code}
              transform={`translate(${it.x},${it.y})`}
              style={{
                opacity: dim ? 0.35 : 1,
                transition: 'opacity 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredCode(it.code)}
              onMouseLeave={() => setHoveredCode(null)}
            >
              <circle
                r={it.r + 4}
                fill="#2563EB"
                opacity={isHovered ? 0.18 : 0.1}
                style={{ transition: 'opacity 0.2s ease' }}
              />
              <circle
                r={it.r}
                fill="#2563EB"
                fillOpacity={0.85}
                stroke="white"
                strokeWidth={isHovered ? 3 : 2}
                filter="url(#bubble-shadow)"
                style={{ transition: 'all 0.2s ease' }}
              />
              <text
                y={4}
                textAnchor="middle"
                fontSize={Math.max(10, it.r * 0.55)}
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
            transform: 'translate(-50%, calc(-100% - 16px))',
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

      <div className="absolute bottom-2 start-2 flex items-center gap-2 text-[10px] text-muted-foreground bg-background/60 backdrop-blur-sm border border-border/40 rounded-md px-2 py-1">
        <span className="h-2 w-2 rounded-full bg-primary/85 inline-block" />
        حجم الدائرة = عدد العملاء
      </div>
    </div>
  );
}
