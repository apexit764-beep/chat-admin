import type { Client, ClientAccountStatus } from '@/types';

/**
 * The account state shown in the clients module. It is derived, not stored, so
 * it can never drift from the two facts behind it: whether the admin switched
 * the account off, and whether the client has ever signed in.
 */
export function accountStatusOf(client: Client): ClientAccountStatus {
  if (client.accountDisabled) return 'disabled';
  return client.lastLoginAt ? 'active' : 'pending';
}

export const accountStatusLabel: Record<ClientAccountStatus, string> = {
  active: 'نشط',
  disabled: 'معطل',
  pending: 'معلق',
};

/** what each state actually means, for the tooltip on the badge */
export const accountStatusHint: Record<ClientAccountStatus, string> = {
  active: 'تمت إضافة العميل وسجّل الدخول فعلياً',
  disabled: 'ألغى الأدمن تفعيل حساب العميل',
  pending: 'أُنشئ حساب العميل ولم يسجّل الدخول بعد',
};

export const accountStatusBadgeClass: Record<ClientAccountStatus, string> = {
  active: 'bg-success/15 text-success border-transparent',
  disabled: 'bg-muted text-muted-foreground border-transparent',
  pending: 'bg-warning/15 text-warning border-transparent',
};
