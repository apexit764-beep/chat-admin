import { create } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import type { ActivityAction } from '@/store/adminMockData';

/** the plan families that earn points (tiers of the paid plans) */
export type PlanTier = 'starter' | 'pro' | 'business';
export const TIERS: [PlanTier, string][] = [
  ['starter', 'البداية'],
  ['pro', 'الاحترافية'],
  ['business', 'الأعمال'],
];

export interface CyclePoints {
  monthly: number;
  yearly: number;
}

export interface ReferralSettings {
  on: boolean;
  /** points the referrer earns when the new subscriber pays for a plan of this tier, by billing cycle */
  points: Record<PlanTier, CyclePoints>;
  /** points a referrer must have collected to subscribe to a plan with them, by plan id (absent = not available with points) */
  redeem: Record<string, Partial<CyclePoints>>;
}

export type ReferralState = 'اشترك' | 'سجل';

/** a person who signed up through a client's referral link */
export interface Referral {
  id: string;
  referrerId: string;
  clientId: string;
  /** registration date, or subscription date for a paying subscriber */
  at: string;
  state: ReferralState;
  /** the plan tier the new subscriber paid for */
  tier?: PlanTier;
  cycle?: 'شهري' | 'سنوي';
  /** what the new subscriber paid, USD */
  paid?: number;
  /** points earned from this subscriber (0 until they subscribe) */
  points: number;
}

/** points a referrer spent to subscribe to a plan with them */
export interface Redemption {
  id: string;
  referrerId: string;
  planId: string;
  cycle: 'شهري' | 'سنوي';
  points: number;
  at: string;
}

const daysAgo = (d: number): string => new Date(Date.now() - d * 86400000).toISOString();
export const referralLink = (clientId: string): string => `qhub.chat/r/c${clientId.replace(/\D/g, '')}`;

interface State {
  settings: ReferralSettings;
  referrals: Referral[];
  /** points the referrers spent on plans (redemption is not built yet, so this is demo data) */
  redemptions: Redemption[];
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
    settings: { on: true, points: { starter: { monthly: 500, yearly: 1500 }, pro: { monthly: 1000, yearly: 3000 }, business: { monthly: 1500, yearly: 4500 } }, redeem: { plan_starter: { monthly: 3000, yearly: 9000 }, plan_pro: { monthly: 6000, yearly: 18000 }, plan_business: { monthly: 9000, yearly: 27000 } } },
    referrals: [
      { id: 'rf1', referrerId: REFERRER, clientId: 'client_17', at: daysAgo(2), state: 'اشترك', tier: 'business', cycle: 'سنوي', paid: 387.6, points: 4500 },
      { id: 'rf2', referrerId: REFERRER, clientId: 'client_18', at: daysAgo(7), state: 'اشترك', tier: 'starter', cycle: 'شهري', paid: 6, points: 500 },
      { id: 'rf3', referrerId: REFERRER, clientId: 'client_13', at: daysAgo(10), state: 'سجل', points: 0 },
      { id: 'rf4', referrerId: REFERRER, clientId: 'client_16', at: daysAgo(50), state: 'اشترك', tier: 'pro', cycle: 'شهري', paid: 16, points: 1000 },
      { id: 'rf5', referrerId: 'client_3', clientId: 'client_7', at: daysAgo(4), state: 'اشترك', tier: 'pro', cycle: 'شهري', paid: 16, points: 1000 },
      { id: 'rf6', referrerId: 'client_3', clientId: 'client_8', at: daysAgo(9), state: 'سجل', points: 0 },
      { id: 'rf7', referrerId: 'client_5', clientId: 'client_11', at: daysAgo(14), state: 'اشترك', tier: 'starter', cycle: 'سنوي', paid: 57.6, points: 1500 },
      { id: 'rf8', referrerId: 'client_5', clientId: 'client_12', at: daysAgo(20), state: 'اشترك', tier: 'starter', cycle: 'شهري', paid: 6, points: 500 },
      { id: 'rf9', referrerId: 'client_6', clientId: 'client_14', at: daysAgo(3), state: 'سجل', points: 0 },
      { id: 'rf10', referrerId: 'client_6', clientId: 'client_15', at: daysAgo(30), state: 'اشترك', tier: 'business', cycle: 'شهري', paid: 32, points: 1500 },
    ],
    redemptions: [
      { id: 'rd1', referrerId: 'client_2', planId: 'plan_starter', cycle: 'شهري', points: 3000, at: daysAgo(6) },
    ],
    saveSettings: (next) => {
      const old = get().settings;
      set({ settings: next });
      if (old.on !== next.on) addLog('referral_program_toggled', 'برنامج المروّجين', next.on ? 'تشغيل البرنامج' : 'إيقاف البرنامج');
      const parts: string[] = [];
      TIERS.forEach(([k, name]) => {
        (['monthly', 'yearly'] as const).forEach((c) => {
          if (old.points[k][c] !== next.points[k][c]) parts.push(`نقاط باقة ${name} (${c === 'monthly' ? 'شهري' : 'سنوي'}): ${old.points[k][c]} → ${next.points[k][c]}`);
        });
      });
      if (parts.length) addLog('referral_settings_updated', 'برنامج المروّجين', `تعديل النقاط · ${parts.join(' · ')}`);
      const planName = (id: string): string => useAdminStore.getState().plans.find((p) => p.id === id)?.nameAr ?? id;
      const rparts = [...new Set([...Object.keys(old.redeem), ...Object.keys(next.redeem)])].flatMap((id) =>
        (['monthly', 'yearly'] as const)
          .filter((c) => old.redeem[id]?.[c] !== next.redeem[id]?.[c])
          .map((c) => `نقاط الاشتراك في ${planName(id)} (${c === 'monthly' ? 'شهري' : 'سنوي'}): ${old.redeem[id]?.[c] ?? '—'} → ${next.redeem[id]?.[c] ?? '—'}`),
      );
      if (rparts.length) addLog('referral_settings_updated', 'برنامج المروّجين', `تعديل نقاط الاشتراك · ${rparts.join(' · ')}`);
    },
  };
});

export interface ReferralStats {
  registered: number;
  subscribed: number;
  /** all the points the referrer earned */
  points: number;
  /** points spent on plans */
  spent: number;
  /** points not used yet: earned minus spent */
  remaining: number;
}

export function statsFor(referrerId: string, referrals: Referral[], redemptions: Redemption[] = []): ReferralStats {
  const mine = referrals.filter((r) => r.referrerId === referrerId);
  const points = mine.reduce((sum, r) => sum + r.points, 0);
  const spent = redemptions.filter((d) => d.referrerId === referrerId).reduce((sum, d) => sum + d.points, 0);
  return {
    registered: mine.length,
    subscribed: mine.filter((r) => r.state === 'اشترك').length,
    points,
    spent,
    remaining: Math.max(0, points - spent),
  };
}
