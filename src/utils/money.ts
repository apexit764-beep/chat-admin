import { useAdminStore } from '@/store/useAdminStore';

/** Format amount in a country's local currency with Arabic symbol. */
export function formatMoney(amount: number, currency: string): string {
  // Currencies with subunits: OMR/BHD/KWD use 3 decimals usually, EGP/SAR/AED use 2
  const decimals = ['OMR', 'BHD', 'KWD', 'JOD'].includes(currency) ? 3 : 2;
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  const symbol = symbolFor(currency);
  return `${formatted} ${symbol}`;
}

function symbolFor(currency: string): string {
  const countries = useAdminStore.getState().countries;
  const country = countries.find((c) => c.currency === currency);
  return country?.symbol ?? currency;
}

/**
 * Format an amount as USD, converting from its own currency first.
 * The admin portal reports money in USD only; local currency stays for
 * client-facing documents such as the printed invoice.
 */
export function formatUSD(amount: number, currency: string): string {
  const usd = approxUSD(amount, currency);
  return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Convert a USD reference to local currency (rough estimate) */
export function usdToLocal(usd: number, currency: string): number {
  const countries = useAdminStore.getState().countries;
  const country = countries.find((c) => c.currency === currency);
  if (!country) return usd;
  return usd * country.usdRate;
}

/** Roll up MRR across all client currencies into approximate USD */
export function approxUSD(amount: number, currency: string): number {
  const countries = useAdminStore.getState().countries;
  const country = countries.find((c) => c.currency === currency);
  if (!country) return amount;
  return amount / country.usdRate;
}
