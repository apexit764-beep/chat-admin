import { create } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore';

export type VCurrency = 'EGP' | 'OMR' | 'SAR';
export type VendorStatus = 'نشط' | 'مجمّد' | 'دعوة مرسلة';
export type VClientState = 'اشترك' | 'دعوة مرسلة' | 'سجل' | 'استرد المبلغ';
export type CommissionState = 'معلّقة' | 'متاحة' | 'ملغاة';
export type PayoutState = 'بانتظار المراجعة' | 'تمت الموافقة' | 'مرفوض' | 'تم التحويل';

export const FX: Record<VCurrency, { sym: string; rate: number; country: string }> = {
  EGP: { sym: 'ج.م', rate: 48.5, country: 'مصر' },
  OMR: { sym: 'ر.ع', rate: 0.385, country: 'عمان' },
  SAR: { sym: 'ر.س', rate: 3.75, country: 'السعودية' },
};
export const PLAN_USD: Record<string, number> = { المبتدئ: 6, الاحترافي: 16, الأعمال: 38 };

export interface TransferAccount {
  id: number;
  type: 'حساب بنكي' | 'محفظة إلكترونية' | 'PayPal';
  details: string;
  isDefault: boolean;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  cur: VCurrency;
  rate: number;
  status: VendorStatus;
  accounts: TransferAccount[];
  /** transfers are frozen for 48h after the vendor changes the transfer details */
  bankLock: boolean;
}

export interface VendorClient {
  id: number;
  vid: number;
  name: string;
  email: string;
  plan: string;
  cycle: string;
  state: VClientState;
  via: 'رابط' | 'دعوة';
  date: string;
}

export interface Commission {
  id: number;
  vid: number;
  cid: number;
  base: number;
  amt: number;
  st: CommissionState;
  left: number;
}

export interface Payout {
  id: number;
  vid: number;
  amt: number;
  st: PayoutState;
  date: string;
  acct: string;
  reason: string;
  ref: string;
  fileName: string;
  /** receipt image as a data URL, when an image was uploaded */
  img: string;
  reviewedBy: string;
  executedBy: string;
}

export interface LogEntry {
  id: number;
  who: string;
  text: string;
  at: string;
}

export interface VendorSettings {
  rate: number;
  hold: number;
  /** minimum withdrawal, USD */
  min: number;
}

interface State {
  settings: VendorSettings;
  vendors: Vendor[];
  clients: VendorClient[];
  comms: Commission[];
  payouts: Payout[];
  log: LogEntry[];

  addVendor: (v: { name: string; email: string; phone: string; cur: VCurrency; rate: number }) => { ok: true } | { ok: false; error: string };
  editVendor: (id: number, v: { name: string; email: string; phone: string; cur: VCurrency; rate: number }) => { ok: true } | { ok: false; error: string };
  toggleFreeze: (id: number) => void;
  resendInvite: (id: number) => void;
  cancelCommission: (id: number, reason: string) => { ok: true } | { ok: false; error: string };
  approvePayout: (id: number) => void;
  rejectPayout: (id: number, reason: string) => void;
  executePayout: (id: number, ref: string, fileName: string, img: string) => void;
  saveSettings: (s: VendorSettings) => void;
}

const round3 = (x: number): number => Math.round(x * 1000) / 1000;
export const toLocal = (usd: number, cur: VCurrency): number => round3(usd * FX[cur].rate);
export const minLocal = (usd: number, cur: VCurrency): number => toLocal(usd, cur);
export const poNo = (id: number): string => `PO-${String(id).padStart(4, '0')}`;

const nowTime = (): string => new Date().toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' });
const today = (): string => new Date().toLocaleDateString('ar-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
const actor = (): string => useAuthStore.getState().user?.name ?? 'مسؤول النظام';

const planUsd = (plan: string, cycle: string): number => {
  const m = PLAN_USD[plan] ?? 0;
  return cycle === 'سنوي' ? m * 12 * 0.85 : m;
};
const commissionOf = (base: number, rate: number, cur: VCurrency): number =>
  cur === 'OMR' ? Math.round(((base * rate) / 100) * 1000) / 1000 : Math.round((base * rate) / 100);

let seq = 100;
const nid = (): number => ++seq;

/** the clients shown here match real admin clients (same names), so both pages tell one story */
const SEED_CLIENTS: VendorClient[] = [
  { id: 1, vid: 1, name: 'TechFlow Egypt', email: 'info@techflow.eg', plan: 'الأعمال', cycle: 'شهري', state: 'اشترك', via: 'دعوة', date: '2 أكتوبر 2026' },
  { id: 2, vid: 1, name: 'مكتبة المعرفة', email: 'info@maarefa.com', plan: 'الاحترافي', cycle: 'سنوي', state: 'اشترك', via: 'رابط', date: '20 أكتوبر 2026' },
  { id: 3, vid: 1, name: 'مكتب النيل', email: 'hello@nile-office.com', plan: '—', cycle: '—', state: 'دعوة مرسلة', via: 'دعوة', date: '1 نوفمبر 2026' },
  { id: 4, vid: 2, name: 'مطعم البيت العماني', email: 'info@omani-house.om', plan: 'الأعمال', cycle: 'سنوي', state: 'اشترك', via: 'دعوة', date: '15 أكتوبر 2026' },
  { id: 5, vid: 3, name: 'مدرسة الفجر الذهبي', email: 'info@goldendawn.sa', plan: 'الأعمال', cycle: 'سنوي', state: 'اشترك', via: 'دعوة', date: '5 سبتمبر 2026' },
  { id: 6, vid: 3, name: 'عيادة الحياة الطبية', email: 'care@hayat-clinic.sa', plan: 'الأعمال', cycle: 'سنوي', state: 'اشترك', via: 'رابط', date: '12 سبتمبر 2026' },
];

const seedComm = (cid: number, vid: number, cur: VCurrency, rate: number, st: CommissionState, left = 0): Commission => {
  const c = SEED_CLIENTS.find((x) => x.id === cid) as VendorClient;
  const base = toLocal(planUsd(c.plan, c.cycle), cur);
  return { id: nid(), vid, cid, base, amt: commissionOf(base, rate, cur), st, left };
};

const emptyPayout = { reason: '', ref: '', fileName: '', img: '', reviewedBy: '', executedBy: '' };

export const useVendorsAdminStore = create<State>((set, get) => {
  const addLog = (text: string, who = actor()): void =>
    set((s) => ({ log: [{ id: nid(), who, text, at: `${today()} · ${nowTime()}` }, ...s.log] }));

  return {
    settings: { rate: 30, hold: 30, min: 10 },
    vendors: [
      { id: 1, name: 'محمود حسن', email: 'mahmoud@agency.com', phone: '+20 100 123 4567', country: 'مصر', cur: 'EGP', rate: 30, status: 'نشط', bankLock: false,
        accounts: [{ id: 1, type: 'حساب بنكي', details: 'بنك مصر · EG12 0002 0001 2345', isDefault: true }] },
      { id: 2, name: 'شركة الأفق للتسويق', email: 'info@ufuq.om', phone: '+968 9123 0000', country: 'عمان', cur: 'OMR', rate: 25, status: 'نشط', bankLock: false,
        accounts: [{ id: 2, type: 'حساب بنكي', details: 'بنك مسقط · OM81 0270 0000 1111', isDefault: true }] },
      { id: 3, name: 'وكالة المدار', email: 'hello@madar.sa', phone: '+966 55 123 4567', country: 'السعودية', cur: 'SAR', rate: 30, status: 'نشط', bankLock: false,
        accounts: [{ id: 3, type: 'حساب بنكي', details: 'مصرف الراجحي · SA44 2000 0001 2345', isDefault: true }] },
    ],
    clients: SEED_CLIENTS,
    comms: [
      seedComm(1, 1, 'EGP', 30, 'متاحة'),
      seedComm(2, 1, 'EGP', 30, 'معلّقة', 18),
      seedComm(4, 2, 'OMR', 25, 'متاحة'),
      seedComm(5, 3, 'SAR', 30, 'متاحة'),
      seedComm(6, 3, 'SAR', 30, 'متاحة'),
    ],
    payouts: [
      { id: 1, vid: 2, amt: 20, st: 'بانتظار المراجعة', date: '2 نوفمبر 2026', acct: 'حساب بنكي · بنك مسقط · OM81 0270 0000 1111', ...emptyPayout },
      { id: 2, vid: 1, amt: 500, st: 'مرفوض', date: '29 أكتوبر 2026', acct: 'حساب بنكي · بنك مصر · EG12 0002 0001 2345', ...emptyPayout,
        reason: 'اسم صاحب الحساب البنكي لا يطابق اسم المورد', reviewedBy: 'محمد الكندي' },
      { id: 3, vid: 3, amt: 300, st: 'تم التحويل', date: '20 أكتوبر 2026', acct: 'حساب بنكي · مصرف الراجحي · SA44 2000 0001 2345', ...emptyPayout,
        ref: 'TRX-88120', fileName: 'transfer-88120.pdf', reviewedBy: 'محمد الكندي', executedBy: 'محمد الكندي' },
      { id: 4, vid: 3, amt: 200, st: 'تمت الموافقة', date: '1 نوفمبر 2026', acct: 'حساب بنكي · مصرف الراجحي · SA44 2000 0001 2345', ...emptyPayout, reviewedBy: 'محمد الكندي' },
    ],
    log: [{ id: 1, who: 'النظام', text: 'تم تسجيل عمولة TechFlow Egypt لمحمود حسن', at: '2 أكتوبر 2026 · 10:30' }],

    addVendor: (v) => {
      if (get().vendors.some((x) => x.email.toLowerCase() === v.email.toLowerCase())) {
        return { ok: false, error: 'هذا البريد الإلكتروني مسجل لمورد آخر' };
      }
      set((s) => ({
        vendors: [...s.vendors, { id: nid(), ...v, country: FX[v.cur].country, status: 'دعوة مرسلة', bankLock: false, accounts: [] }],
      }));
      addLog(`أضاف موردًا جديدًا وأرسل له دعوة: ${v.name}`);
      return { ok: true };
    },
    editVendor: (id, v) => {
      if (get().vendors.some((x) => x.id !== id && x.email.toLowerCase() === v.email.toLowerCase())) {
        return { ok: false, error: 'هذا البريد الإلكتروني مسجل لمورد آخر' };
      }
      const old = get().vendors.find((x) => x.id === id) as Vendor;
      set((s) => ({ vendors: s.vendors.map((x) => (x.id === id ? { ...x, ...v, country: FX[v.cur].country } : x)) }));
      addLog(`عدّل بيانات المورد ${v.name}${old.rate !== v.rate ? ` · النسبة من ${old.rate}% إلى ${v.rate}%` : ''}`);
      return { ok: true };
    },
    toggleFreeze: (id) => {
      const v = get().vendors.find((x) => x.id === id) as Vendor;
      const freezing = v.status === 'نشط';
      set((s) => ({ vendors: s.vendors.map((x) => (x.id === id ? { ...x, status: freezing ? 'مجمّد' : 'نشط' } : x)) }));
      addLog(`${freezing ? 'جمّد' : 'ألغى تجميد'} المورد ${v.name}`);
    },
    resendInvite: (id) => {
      const v = get().vendors.find((x) => x.id === id) as Vendor;
      addLog(`أعاد إرسال الدعوة للمورد ${v.name}`);
    },
    cancelCommission: (id, reason) => {
      const { comms, payouts, clients } = get();
      const k = comms.find((x) => x.id === id) as Commission;
      const avail = sumsFor(k.vid, comms, payouts).avail;
      if (k.st === 'متاحة' && avail < k.amt) return { ok: false, error: 'لا يمكن إلغاؤها، فالمبلغ ضمن طلب سحب أو تم تحويله' };
      set((s) => ({ comms: s.comms.map((x) => (x.id === id ? { ...x, st: 'ملغاة' } : x)) }));
      addLog(`ألغى عمولة ${clients.find((c) => c.id === k.cid)?.name} · السبب: ${reason}`);
      return { ok: true };
    },
    approvePayout: (id) => {
      set((s) => ({ payouts: s.payouts.map((p) => (p.id === id ? { ...p, st: 'تمت الموافقة', reviewedBy: actor() } : p)) }));
      addLog(`وافق على طلب ${poNo(id)}`);
    },
    rejectPayout: (id, reason) => {
      set((s) => ({ payouts: s.payouts.map((p) => (p.id === id ? { ...p, st: 'مرفوض', reason, reviewedBy: actor() } : p)) }));
      addLog(`رفض طلب ${poNo(id)} · ${reason}`);
    },
    executePayout: (id, ref, fileName, img) => {
      set((s) => ({
        payouts: s.payouts.map((p) => (p.id === id ? { ...p, st: 'تم التحويل', ref, fileName, img, executedBy: actor() } : p)),
      }));
      addLog(`نفّذ تحويل ${poNo(id)} · رقم العملية ${ref}`);
    },
    saveSettings: (settings) => {
      set({ settings });
      addLog('عدّل إعدادات الموردين');
    },
  };
});

export interface Sums {
  pending: number;
  avail: number;
  inReview: number;
  paid: number;
}

/** pending hold, available, inside an open payout request, and already transferred */
export function sumsFor(vid: number, comms: Commission[], payouts: Payout[]): Sums {
  const c = comms.filter((x) => x.vid === vid);
  const total = (st: CommissionState): number => c.filter((x) => x.st === st).reduce((a, b) => a + b.amt, 0);
  const po = payouts.filter((p) => p.vid === vid);
  const sumOf = (l: PayoutState[]): number => po.filter((p) => l.includes(p.st)).reduce((a, b) => a + b.amt, 0);
  const inReview = sumOf(['بانتظار المراجعة', 'تمت الموافقة']);
  const paid = sumOf(['تم التحويل']);
  return { pending: round3(total('معلّقة')), avail: round3(total('متاحة') - inReview - paid), inReview: round3(inReview), paid: round3(paid) };
}
