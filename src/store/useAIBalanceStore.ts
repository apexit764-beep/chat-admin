import { create } from 'zustand';
import { useAdminStore } from '@/store/useAdminStore';

/** Settings the admin controls for the AI assistant balance (all prices in USD) */
export interface AIBalanceSettings {
  /** provider/model linked from the AI connection settings — never shown to clients */
  provider: string;
  /** name shown to clients */
  modelName: string;
  /** selling price per one million tokens, USD */
  pricePerMillion: number;
  /** top-up packs offered to clients, USD */
  packs: number[];
  /** free-amount top-up limits, USD */
  minTopup: number;
  maxTopup: number;
  /** lowest balance a client can reach (as a positive number) — the assistant stops there */
  negativeLimit: number;
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
  autoCharge: boolean;
  /** negative part of the balance, USD (always >= 0) */
  negative: number;
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
  packs: [5, 10, 25, 50],
  minTopup: 5,
  maxTopup: 200,
  negativeLimit: 0.5,
};

const DAY = 86_400_000;
const daysAgo = (n: number): string => new Date(Date.now() - n * DAY).toISOString();

/** Deterministic demo balances so the page is populated before the API exists */
const SEED: { id: string; left: number; used: number; auto: boolean; negative?: number }[] = [
  { id: 'client_1', left: 22.4, used: 5.2e6, auto: true },
  { id: 'client_2', left: 0, used: 9.8e6, auto: false },
  { id: 'client_3', left: 48.1, used: 14.3e6, auto: true },
  { id: 'client_4', left: 6.2, used: 3.8e6, auto: false },
  { id: 'client_5', left: 0, used: 2.1e6, auto: false, negative: 0.004 },
];

function buildAccounts(): BalanceAccount[] {
  const ids = new Set(useAdminStore.getState().clients.map((c) => c.id));
  return SEED.filter((s) => ids.has(s.id)).map((s, i) => ({
    clientId: s.id,
    usedMonthTokens: s.used,
    autoCharge: s.auto,
    negative: s.negative ?? 0,
    lots: s.left > 0 ? [{ id: `lot_${s.id}_1`, source: 'شحن', usd: Math.max(10, s.left), left: s.left }] : [],
    tx: [
      { id: `tx_${s.id}_2`, date: daysAgo(1), type: 'usage', description: 'ردود المساعد', usd: -(s.used / 1e6) * DEFAULT_SETTINGS.pricePerMillion },
      { id: `tx_${s.id}_1`, date: daysAgo(12 + i), type: 'topup', description: 'شحن رصيد المساعد', usd: Math.max(10, s.left) },
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
        : { clientId, usedMonthTokens: 0, autoCharge: false, negative: 0, lots: [], tx: [] };
      const settle = Math.min(base.negative, usd);
      const add = Math.round((usd - settle) * 1e6) / 1e6;
      const next: BalanceAccount = {
        ...base,
        negative: Math.round((base.negative - settle) * 1e6) / 1e6,
        lots: [...base.lots, { id: `lot_gift_${++seq}`, source: 'رصيد مجاني', usd, left: add }],
        tx: [{ id: `tx_gift_${seq}`, date: now, type: 'gift' as const, description: reason, usd }, ...base.tx],
      };
      return { accounts: exists ? s.accounts.map((a) => (a.clientId === clientId ? next : a)) : [...s.accounts, next] };
    }),
}));

/* ---------- helpers ---------- */

export function accountBalance(a: BalanceAccount): number {
  return Math.round((a.lots.reduce((sum, l) => sum + l.left, 0) - a.negative) * 1e6) / 1e6;
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
