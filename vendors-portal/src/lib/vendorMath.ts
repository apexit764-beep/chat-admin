export type Currency = 'EGP' | 'OMR' | 'SAR';

/** USD → vendor currency, for display only (same rates as the admin demo) */
export const FX: Record<Currency, { sym: string; rate: number; decimals: number }> = {
  EGP: { sym: 'ج.م', rate: 48.5, decimals: 2 },
  OMR: { sym: 'ر.ع', rate: 0.385, decimals: 3 },
  SAR: { sym: 'ر.س', rate: 3.75, decimals: 2 },
};

export const PLANS: Record<string, number> = { المبتدئ: 6, الاحترافي: 16, الأعمال: 38 };

const round3 = (x: number): number => Math.round(x * 1000) / 1000;

export const toLocal = (usd: number, cur: Currency): number => round3(usd * FX[cur].rate);

/** price of a client's first subscription, in USD (yearly = 12 months with 15% off) */
export const planPriceUsd = (plan: string, cycle: string): number => {
  const monthly = PLANS[plan] ?? 0;
  return cycle === 'سنوي' ? monthly * 12 * 0.85 : monthly;
};

export const money = (v: number, cur: Currency): string =>
  `${v.toLocaleString('en-US', { maximumFractionDigits: 3 })} ${FX[cur].sym}`;

export const formatDate = (d: Date = new Date()): string =>
  d.toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
