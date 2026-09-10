import type { Plan, Subscription } from '@/types';

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
