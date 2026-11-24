import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Payout, VendorClient } from '@v/store/useVendorStore';
import { AR_MONTHS, FX, parseArDate, type Currency } from '@v/lib/vendorMath';

const RANGES: [string, string, number][] = [
  ['3', 'آخر 3 أشهر', 3],
  ['6', 'آخر 6 أشهر', 6],
];

/** monthly received payouts + new clients, in the shadcn "chart-area-interactive" style */
export function EarningsChart({ payouts, clients, cur }: { payouts: Payout[]; clients: VendorClient[]; cur: Currency }): JSX.Element {
  const [range, setRange] = useState('6');
  const months = RANGES.find((r) => r[0] === range)?.[2] ?? 6;

  const config = {
    paid: { label: `المبالغ المستلمة (${FX[cur].sym})`, color: 'hsl(var(--chart-1))' },
    clients: { label: 'عملاء جدد', color: 'hsl(var(--chart-2))' },
  } satisfies ChartConfig;

  const data = useMemo(() => {
    // anchor on the latest dated activity so the demo data always shows
    const dates = [...payouts.map((p) => parseArDate(p.date)), ...clients.map((c) => parseArDate(c.date))].filter((d): d is Date => !!d);
    const last = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();
    const rows = Array.from({ length: months }, (_, i) => {
      const d = new Date(last.getFullYear(), last.getMonth() - (months - 1 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, month: AR_MONTHS[d.getMonth()], paid: 0, clients: 0 };
    });
    const at = (d: Date | null): (typeof rows)[number] | undefined => (d ? rows.find((r) => r.key === `${d.getFullYear()}-${d.getMonth()}`) : undefined);
    payouts.filter((p) => p.st === 'تم التحويل').forEach((p) => {
      const r = at(parseArDate(p.date));
      if (r) r.paid = Math.round((r.paid + p.amt) * 1000) / 1000;
    });
    clients.forEach((c) => {
      const r = at(parseArDate(c.date));
      if (r) r.clients += 1;
    });
    return rows;
  }, [payouts, clients, months]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-3 space-y-0 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">نشاطك الشهري</CardTitle>
          <CardDescription>المبالغ المحوّلة إليك وعدد العملاء الجدد لكل شهر</CardDescription>
        </div>
        <Tabs value={range} onValueChange={setRange} dir="rtl">
          <TabsList className="h-8">
            {RANGES.map(([k, t]) => (
              <TabsTrigger key={k} value={k} className="h-6 text-xs">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-2 pb-4 pt-0 sm:px-5">
        <ChartContainer config={config} className="aspect-auto h-[260px] w-full" dir="ltr">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-paid)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-paid)" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="fillClients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-clients)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--color-clients)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} reversed />
            <YAxis yAxisId="paid" orientation="right" tickLine={false} axisLine={false} width={84} tickFormatter={(v: number) => `${v.toLocaleString('en-US')} ${FX[cur].sym}`} />
            <YAxis yAxisId="clients" orientation="left" hide allowDecimals={false} domain={[0, (max: number) => Math.max(4, max * 2)]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area yAxisId="clients" dataKey="clients" type="natural" fill="url(#fillClients)" stroke="var(--color-clients)" />
            <Area yAxisId="paid" dataKey="paid" type="natural" fill="url(#fillPaid)" stroke="var(--color-paid)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
        <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted-foreground">
          {Object.entries(config).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
