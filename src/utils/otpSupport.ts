import type { Plan } from '@/types';
import { isGranted } from '@/data/planFeatures';

/**
 * Demo data for the «المطورين» tab of a client: what the support team needs to
 * answer «verification codes do not reach my users» without asking the client
 * for screenshots. Real data comes from the OTP API logs once the backend exists.
 *
 * Deliberately NOT here: the code itself (it is never stored readable), and the
 * clients' end-users' numbers in full (third-party data, always masked).
 */

export type OtpStatus = 'verified' | 'delivered' | 'failed' | 'rejected';

export const OTP_STATUS_LABEL: Record<OtpStatus, string> = {
  verified: 'تم التحقق',
  delivered: 'وصل ولم يُتحقَّق منه',
  failed: 'فشل من ميتا',
  rejected: 'رُفض في الـAPI',
};

export interface OtpFailure {
  /** Meta error code, or an internal code when the API rejected the request before reaching Meta */
  code: string;
  text: string;
}

export interface OtpRequest {
  id: string;
  /** end-user's number, always masked */
  phone: string;
  status: OtpStatus;
  at: string;
  failure?: OtpFailure;
}

export interface OtpKey {
  id: string;
  name: string;
  env: 'production' | 'test';
  lastUsed: string | null;
}

export interface OtpSupport {
  /** the plan includes the service */
  enabled: boolean;
  /** monthly quota; -1 unlimited, -2 custom */
  quota: number;
  used: number;
  /** share of requests that reached the end-user's phone (0..1) */
  reachRate: number;
  /** share of delivered codes that were verified (0..1) */
  verifyRate: number;
  keys: OtpKey[];
  requests: OtpRequest[];
}

/** +96892345678 → +9689****567 */
export function maskPhone(phone: string): string {
  const p = phone.replace(/\s/g, '');
  if (p.length < 9) return p;
  return `${p.slice(0, 5)}****${p.slice(-3)}`;
}

const FAILURES: OtpFailure[] = [
  { code: '131026', text: 'الرقم غير مسجّل على واتساب أو لا يستقبل الرسائل' },
  { code: '132015', text: 'قالب رسالة OTP موقوف من ميتا' },
  { code: '132001', text: 'القالب غير موجود بهذه اللغة' },
  { code: '131042', text: 'مشكلة في وسيلة الدفع بحساب ميتا الخاص بالعميل' },
];
const REJECTED: OtpFailure = { code: 'INVALID_PHONE', text: 'صيغة الرقم خاطئة، رُفض الطلب قبل الوصول لميتا' };

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // final avalanche so neighbouring inputs do not give neighbouring outputs
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
};

const minutesAgo = (m: number): string => new Date(Date.now() - m * 60000).toISOString();

export function getOtpSupport(clientId: string, plan: Plan | undefined): OtpSupport {
  const quota = plan?.limits.otpMessages ?? 0;
  const enabled = !!plan && isGranted(plan.features.dev_otp_api) && quota !== 0;
  if (!enabled) return { enabled: false, quota, used: 0, reachRate: 0, verifyRate: 0, keys: [], requests: [] };

  const h = hash(clientId);
  const base = quota > 0 ? quota : 10000;
  const used = Math.round(base * (0.08 + (h % 55) / 100));
  const reachRate = 0.93 + (h % 5) / 100;
  const verifyRate = 0.78 + (h % 12) / 100;

  const keys: OtpKey[] = [
    { id: 'k1', name: 'تطبيق الموبايل', env: 'production', lastUsed: minutesAgo(3 + (h % 40)) },
    { id: 'k2', name: 'الموقع الإلكتروني', env: 'production', lastUsed: minutesAgo(60 * 5 + (h % 90)) },
    { id: 'k3', name: 'بيئة التجربة', env: 'test', lastUsed: minutesAgo(60 * 24 * 6) },
  ];

  const statuses: OtpStatus[] = ['verified', 'verified', 'delivered', 'verified', 'failed', 'verified', 'rejected', 'verified'];
  const requests: OtpRequest[] = statuses.map((status, i) => {
    const n = hash(`${clientId}:${i}`);
    const digits = String(10000000 + (n % 89999999));
    const phone = maskPhone(`+9689${digits}`);
    const failure = status === 'failed' ? FAILURES[n % FAILURES.length] : status === 'rejected' ? REJECTED : undefined;
    return { id: `otp_${(n % 0xffffff).toString(16).padStart(6, '0')}`, phone, status, at: minutesAgo(4 + i * 17 + (n % 9)), failure };
  });

  return { enabled: true, quota, used, reachRate, verifyRate, keys, requests };
}
