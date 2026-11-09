import { create } from 'zustand';
import { useAdminStore } from '@/store/useAdminStore';

export interface TopupPack {
  usd: number;
  active: boolean;
}

/** Settings the admin controls for the AI assistant balance (all prices in USD) */
export interface AIBalanceSettings {
  /** provider/model linked from the AI connection settings — never shown to clients */
  provider: string;
  /** name shown to clients */
  modelName: string;
  /** selling price per one million tokens, USD */
  pricePerMillion: number;
  /** top-up packs, USD. An inactive pack is hidden from new subscribers but keeps serving its current ones */
  packs: TopupPack[];
  /** free-amount top-up limits, USD */
  minTopup: number;
  maxTopup: number;
  /** lowest balance a client can reach — the assistant stops drawing tokens there. Always positive: no balance is ever negative */
  minBalance: number;
}

export interface BalanceLot {
  id: string;
  source: string;
  usd: number;
  left: number;
}

export type BalanceTxType = 'topup' | 'usage' | 'gift' | 'auto';

export interface BalanceTx {
  id: string;
  date: string;
  type: BalanceTxType;
  description: string;
  /** signed USD: positive adds balance, negative consumes it */
  usd: number;
}

export interface BalanceAccount {
  clientId: string;
  /** tokens consumed this month */
  usedMonthTokens: number;
  /** amount charged automatically, USD; null when auto-charge is off. Defines which pack (or free amount) the client subscribes to */
  autoChargeUsd: number | null;
  lots: BalanceLot[];
  tx: BalanceTx[];
}

interface AIBalanceState {
  settings: AIBalanceSettings;
  accounts: BalanceAccount[];
  updateSettings: (patch: Partial<AIBalanceSettings>) => void;
  addGift: (clientId: string, usd: number, reason: string) => void;
}

const DEFAULT_SETTINGS: AIBalanceSettings = {
  provider: 'OpenAI · gpt-4.1-mini',
  modelName: 'Qhub AI',
  pricePerMillion: 2,
  packs: [5, 10, 25, 50].map((usd) => ({ usd, active: true })),
  minTopup: 5,
  maxTopup: 200,
  minBalance: 0.5,
};

const DAY = 86_400_000;
const daysAgo = (n: number): string => new Date(Date.now() - n * DAY).toISOString();

/** Deterministic demo balances so the page is populated before the API exists */
const SEED: { id: string; left: number; used: number; auto: number | null; topup: number}[] = [
  { id: 'client_1', left: 22.4, used: 5.2e6, auto: 10, topup: 25 },
  { id: 'client_2', left: 0, used: 9.8e6, auto: null, topup: 5 },
  { id: 'client_3', left: 48.1, used: 14.3e6, auto: 25, topup: 50 },
  { id: 'client_4', left: 6.2, used: 3.8e6, auto: 15, topup: 15 },
  { id: 'client_5', left: 0, used: 2.1e6, auto: null, topup: 10 },
];

function buildAccounts(): BalanceAccount[] {
  const ids = new Set(useAdminStore.getState().clients.map((c) => c.id));
  return SEED.filter((s) => ids.has(s.id)).map((s, i) => ({
    clientId: s.id,
    usedMonthTokens: s.used,
    autoChargeUsd: s.auto,
    lots: s.left > 0 ? [{ id: `lot_${s.id}_1`, source: 'شحن', usd: s.topup, left: s.left }] : [],
    tx: [
      { id: `tx_${s.id}_2`, date: daysAgo(1), type: 'usage', description: 'ردود المساعد', usd: -(s.used / 1e6) * DEFAULT_SETTINGS.pricePerMillion },
      { id: `tx_${s.id}_1`, date: daysAgo(12 + i), type: 'topup', description: 'شحن رصيد المساعد', usd: s.topup },
    ],
  }));
}

let seq = 0;

export const useAIBalanceStore = create<AIBalanceState>((set) => ({
  settings: DEFAULT_SETTINGS,
  accounts: buildAccounts(),
  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  addGift: (clientId, usd, reason) =>
    set((s) => {
      const now = new Date().toISOString();
      const exists = s.accounts.some((a) => a.clientId === clientId);
      const base: BalanceAccount = exists
        ? (s.accounts.find((a) => a.clientId === clientId) as BalanceAccount)
        : { clientId, usedMonthTokens: 0, autoChargeUsd: null, lots: [], tx: [] };
      const next: BalanceAccount = {
        ...base,
        lots: [...base.lots, { id: `lot_gift_${++seq}`, source: 'رصيد مجاني', usd, left: usd }],
        tx: [{ id: `tx_gift_${seq}`, date: now, type: 'gift' as const, description: reason, usd }, ...base.tx],
      };
      return { accounts: exists ? s.accounts.map((a) => (a.clientId === clientId ? next : a)) : [...s.accounts, next] };
    }),
}));

/* ---------- helpers ---------- */

/** last amount the client paid for (pack or free amount) — it defines what they are subscribed to */
export function lastTopupUsd(a: BalanceAccount): number | null {
  return a.tx.find((t) => t.type === 'topup' || t.type === 'auto')?.usd ?? null;
}

/** clients whose last top-up is exactly this pack */
export function packSubscribers(accounts: BalanceAccount[], usd: number): number {
  return accounts.filter((a) => lastTopupUsd(a) === usd).length;
}

/** clients whose last top-up is a free amount, i.e. not one of the packs */
export function isFreeAmountSubscriber(a: BalanceAccount, packs: TopupPack[]): boolean {
  const last = lastTopupUsd(a);
  return last !== null && !packs.some((p) => p.usd === last);
}

export function accountBalance(a: BalanceAccount): number {
  return Math.round(a.lots.reduce((sum, l) => sum + l.left, 0) * 1e6) / 1e6;
}

/** the assistant stops once the balance reaches the minimum allowed balance */
export function isStopped(a: BalanceAccount, minBalance: number): boolean {
  return accountBalance(a) <= minBalance;
}

/** approximate remaining tokens for a USD amount at the current price */
export function tokensFor(usd: number, pricePerMillion: number): number {
  return (Math.max(0, usd) / pricePerMillion) * 1e6;
}

export function formatTokens(t: number): string {
  if (t >= 1e6) return `${(t / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 })} مليون`;
  return `${Math.round(t / 1000).toLocaleString('en-US')} ألف`;
}

/** USD amount shown in the client's own currency, with the USD reference kept by the caller */
export function localAmount(usd: number, countryCode: string): { value: string; symbol: string } {
  const country = useAdminStore.getState().countries.find((c) => c.code === countryCode);
  const rate = country?.usdRate ?? 1;
  const decimals = ['OMR', 'BHD', 'KWD', 'JOD'].includes(country?.currency ?? '') ? 3 : 2;
  return {
    value: (usd * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals }),
    symbol: country?.symbol ?? '$',
  };
}

export const formatUsd = (usd: number): string =>
  `${usd < 0 ? '-' : ''}$${Math.abs(usd).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}`;
