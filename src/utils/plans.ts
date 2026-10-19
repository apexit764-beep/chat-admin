import type { Plan, PlanPrice, Subscription } from '@/types';
import { DEFAULT_PRICE_KEY } from '@/types';

/** plan tiers from cheapest to richest, used to label a switch as upgrade or downgrade */
export const TIER_RANK: Record<string, number> = { starter: 1, pro: 2, business: 3, enterprise: 4 };

export function tierRank(tier?: string): number {
  return tier ? (TIER_RANK[tier] ?? 0) : 0;
}

/** true while the subscription is waiting on a scheduled switch to a cheaper plan */
export function hasPendingDowngrade(sub: Subscription | undefined, plans: Plan[]): boolean {
  if (!sub?.scheduledPlanId) return false;
  const current = plans.find((p) => p.id === sub.planId);
  const next = plans.find((p) => p.id === sub.scheduledPlanId);
  if (!current || !next) return false;
  return tierRank(next.tier) < tierRank(current.tier);
}

/**
 * A plan's price in a country, falling back to the rest-of-world row.
 *
 * The approved sheet prices nine countries explicitly and bills everyone else
 * in USD, so a missing country is normal and must not read as "free".
 */
export function planPrice(plan: Plan, countryCode: string): PlanPrice | undefined {
  return plan.pricesPerCountry[countryCode] ?? plan.pricesPerCountry[DEFAULT_PRICE_KEY];
}

/** the amount for one billing cycle */
export function planAmount(plan: Plan, countryCode: string, cycle: 'monthly' | 'yearly'): number | undefined {
  const p = planPrice(plan, countryCode);
  return p ? (cycle === 'yearly' ? p.yearly : p.monthly) : undefined;
}
