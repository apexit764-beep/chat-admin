import { create } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { approxUSD } from '@/utils/money';
import type { ActivityAction } from '@/store/adminMockData';

export interface ReferralSettings {
  on: boolean;
  /** free months the referrer earns for a monthly subscriber */
  mM: number;
  /** free months the referrer earns for an annual subscriber */
  mA: number;
}

export type ReferralState = 'اشترك' | 'سجل';
export type LotState = 'متاح' | 'مستخدم' | 'منتهي';

/** a person who signed up through a client's referral link */
export interface Referral {
  id: string;
  referrerId: string;
  clientId: string;
  /** registration date, or subscription date for a paying subscriber */
  at: string;
  state: ReferralState;
  cycle?: 'شهري' | 'سنوي';
  /** what the new subscriber paid, USD */
  paid?: number;
  /** free months earned from this subscriber */
  months: number;
}

/** one earned free month */
export interface MonthLot {
  id: string;
  referrerId: string;
  fromClientId: string;
  earnedAt: string;
  st: LotState;
  inv?: string;
}

const daysAgo = (d: number): string => new Date(Date.now() - d * 86400000).toISOString();
export const referralLink = (clientId: string): string => `qhub.chat/r/c${clientId.replace(/\D/g, '')}`;

/** a free month is worth one month of the referrer's own plan, in USD */
export function monthValueUsd(referrerId: string): number {
  const { clients, plans } = useAdminStore.getState();
  const c = clients.find((x) => x.id === referrerId);
  if (!c) return 0;
  const price = plans.find((p) => p.id === c.planId)?.pricesPerCountry[c.country]?.monthly ?? c.mrr;
  return Math.round(approxUSD(price, c.currency) * 100) / 100;
}

interface State {
  settings: ReferralSettings;
  referrals: Referral[];
  lots: MonthLot[];
  saveSettings: (s: ReferralSettings) => void;
}

let seq = 100;
const nid = (): number => ++seq;

const REFERRER = 'client_2';

export const useReferralsStore = create<State>((set, get) => {
  const addLog = (action: ActivityAction, target: string, details: string): void => {
    const user = useAuthStore.getState().user;
    useAdminStore.setState((s) => ({
      activityLog: [
        {
          id: `act_r_${nid()}`,
          action,
          actor: user?.name ?? 'مسؤول النظام',
          actorEmail: user?.email ?? '',
          actorRole: 'admin' as const,
          target,
          details,
          timestamp: new Date().toISOString(),
        },
        ...s.activityLog,
      ],
    }));
  };

  return {
    settings: { on: true, mM: 1, mA: 3 },
    referrals: [
      { id: 'rf1', referrerId: REFERRER, clientId: 'client_17', at: daysAgo(2), state: 'اشترك', cycle: 'سنوي', paid: 387.6, months: 3 },
      { id: 'rf2', referrerId: REFERRER, clientId: 'client_18', at: daysAgo(7), state: 'اشترك', cycle: 'شهري', paid: 6, months: 1 },
      { id: 'rf3', referrerId: REFERRER, clientId: 'client_13', at: daysAgo(10), state: 'سجل', months: 0 },
      { id: 'rf4', referrerId: REFERRER, clientId: 'client_16', at: daysAgo(50), state: 'اشترك', cycle: 'شهري', paid: 16, months: 1 },
    ],
    lots: [
      { id: 'l1', referrerId: REFERRER, fromClientId: 'client_16', earnedAt: daysAgo(50), st: 'مستخدم', inv: 'INV-2026-00201' },
      { id: 'l2', referrerId: REFERRER, fromClientId: 'client_18', earnedAt: daysAgo(7), st: 'متاح' },
      { id: 'l3', referrerId: REFERRER, fromClientId: 'client_17', earnedAt: daysAgo(2), st: 'متاح' },
      { id: 'l4', referrerId: REFERRER, fromClientId: 'client_17', earnedAt: daysAgo(2), st: 'متاح' },
      { id: 'l5', referrerId: REFERRER, fromClientId: 'client_17', earnedAt: daysAgo(2), st: 'متاح' },
    ],
    saveSettings: (next) => {
      const old = get().settings;
      set({ settings: next });
      if (old.on !== next.on) addLog('referral_program_toggled', 'برنامج المروّجين', next.on ? 'تشغيل البرنامج' : 'إيقاف البرنامج');
      const parts: string[] = [];
      if (old.mM !== next.mM) parts.push(`شهور المشترك الشهري: ${old.mM} → ${next.mM}`);
      if (old.mA !== next.mA) parts.push(`شهور المشترك السنوي: ${old.mA} → ${next.mA}`);
      if (parts.length) addLog('referral_settings_updated', 'برنامج المروّجين', `تعديل المكافأة · ${parts.join(' · ')}`);
    },
  };
});

export interface ReferralStats {
  registered: number;
  subscribed: number;
  /** free months still available to use */
  remaining: number;
  /** free months already applied to invoices */
  usedMonths: number;
}

export function statsFor(referrerId: string, referrals: Referral[], lots: MonthLot[]): ReferralStats {
  const mine = referrals.filter((r) => r.referrerId === referrerId);
  const l = lots.filter((x) => x.referrerId === referrerId);
  return {
    registered: mine.length,
    subscribed: mine.filter((r) => r.state === 'اشترك').length,
    remaining: l.filter((x) => x.st === 'متاح').length,
    usedMonths: l.filter((x) => x.st === 'مستخدم').length,
  };
}
