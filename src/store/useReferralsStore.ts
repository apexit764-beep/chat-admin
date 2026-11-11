import { create } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import type { ActivityAction } from '@/store/adminMockData';

export interface ReferralSettings {
  on: boolean;
  /** reward months for a monthly subscriber */
  mM: number;
  /** reward months for an annual subscriber */
  mA: number;
  /** discount % of the referrer's monthly plan price, in a reward month */
  pct: number;
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
  months: number;
  /** discount value of one reward month, USD */
  val: number;
  /** the value was capped to what the new subscriber paid */
  cap: boolean;
}

/** one earned reward month */
export interface MonthLot {
  id: string;
  referrerId: string;
  fromClientId: string;
  val: number;
  earnedAt: string;
  st: LotState;
  inv?: string;
}

/** monthly plan prices, USD */
export const PLAN_USD: Record<string, number> = { plan_starter: 6, plan_pro: 16, plan_business: 38 };

const daysAgo = (d: number): string => new Date(Date.now() - d * 86400000).toISOString();
export const referralLink = (clientId: string): string => `qhub.chat/r/c${clientId.replace(/\D/g, '')}`;

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
    settings: { on: true, mM: 1, mA: 3, pct: 50 },
    referrals: [
      { id: 'rf1', referrerId: REFERRER, clientId: 'client_17', at: daysAgo(2), state: 'اشترك', cycle: 'سنوي', paid: 387.6, months: 3, val: 8, cap: false },
      { id: 'rf2', referrerId: REFERRER, clientId: 'client_18', at: daysAgo(7), state: 'اشترك', cycle: 'شهري', paid: 6, months: 1, val: 6, cap: true },
      { id: 'rf3', referrerId: REFERRER, clientId: 'client_13', at: daysAgo(10), state: 'سجل', months: 0, val: 0, cap: false },
      { id: 'rf4', referrerId: REFERRER, clientId: 'client_16', at: daysAgo(50), state: 'اشترك', cycle: 'شهري', paid: 16, months: 1, val: 8, cap: false },
    ],
    lots: [
      { id: 'l1', referrerId: REFERRER, fromClientId: 'client_16', val: 8, earnedAt: daysAgo(50), st: 'مستخدم', inv: 'INV-2026-00201' },
      { id: 'l2', referrerId: REFERRER, fromClientId: 'client_18', val: 6, earnedAt: daysAgo(7), st: 'متاح' },
      { id: 'l3', referrerId: REFERRER, fromClientId: 'client_17', val: 8, earnedAt: daysAgo(2), st: 'متاح' },
      { id: 'l4', referrerId: REFERRER, fromClientId: 'client_17', val: 8, earnedAt: daysAgo(2), st: 'متاح' },
      { id: 'l5', referrerId: REFERRER, fromClientId: 'client_17', val: 8, earnedAt: daysAgo(2), st: 'متاح' },
    ],
    saveSettings: (next) => {
      const old = get().settings;
      set({ settings: next });
      if (old.on !== next.on) addLog('referral_program_toggled', 'برنامج المروّجين', next.on ? 'تشغيل البرنامج' : 'إيقاف البرنامج');
      const parts: string[] = [];
      if (old.mM !== next.mM) parts.push(`شهور المشترك الشهري: ${old.mM} → ${next.mM}`);
      if (old.mA !== next.mA) parts.push(`شهور المشترك السنوي: ${old.mA} → ${next.mA}`);
      if (old.pct !== next.pct) parts.push(`نسبة الخصم: ${old.pct}% → ${next.pct}%`);
      if (parts.length) addLog('referral_settings_updated', 'برنامج المروّجين', `تعديل المكافأة · ${parts.join(' · ')}`);
    },
  };
});

export interface ReferralStats {
  registered: number;
  subscribed: number;
  /** reward months still available to use */
  remaining: number;
  /** total value of reward months already used on invoices, USD */
  usedValue: number;
}

export function statsFor(referrerId: string, referrals: Referral[], lots: MonthLot[]): ReferralStats {
  const mine = referrals.filter((r) => r.referrerId === referrerId);
  const l = lots.filter((x) => x.referrerId === referrerId);
  return {
    registered: mine.length,
    subscribed: mine.filter((r) => r.state === 'اشترك').length,
    remaining: l.filter((x) => x.st === 'متاح').length,
    usedValue: Math.round(l.filter((x) => x.st === 'مستخدم').reduce((a, b) => a + b.val, 0) * 100) / 100,
  };
}
