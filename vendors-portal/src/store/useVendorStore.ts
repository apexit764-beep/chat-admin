import { create } from 'zustand';
import { formatDate, planPriceUsd, toLocal, type Currency } from '@v/lib/vendorMath';

export type VendorStatus = 'نشط' | 'مجمّد' | 'دعوة مرسلة';
export type ClientState = 'اشترك' | 'دعوة مرسلة' | 'سجل' | 'استرد المبلغ';
export type CommissionState = 'معلّقة' | 'متاحة' | 'ملغاة';
export type PayoutState = 'بانتظار المراجعة' | 'تمت الموافقة' | 'مرفوض' | 'تم التحويل';
export type AccountType = 'حساب بنكي' | 'محفظة إلكترونية' | 'PayPal';

export interface TransferAccount {
  id: number;
  type: AccountType;
  details: string;
  isDefault: boolean;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  cur: Currency;
  rate: number;
  status: VendorStatus;
  password?: string;
  accounts: TransferAccount[];
  /** transfers are frozen for 48h after the transfer details change */
  bankLock: boolean;
}

export interface VendorClient {
  id: number;
  vid: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  cycle: string;
  state: ClientState;
  via?: 'رابط' | 'دعوة';
  date: string;
}

export interface Commission {
  id: number;
  vid: number;
  cid: number;
  /** first subscription value in the vendor's currency */
  base: number;
  amt: number;
  st: CommissionState;
  /** days left of the hold period */
  left: number;
}

export interface Payout {
  id: number;
  vid: number;
  amt: number;
  st: PayoutState;
  date: string;
  reason: string;
  ref: string;
  fname: string;
  acct: string;
}

interface Settings {
  rate: number;
  hold: number;
  /** minimum withdrawal in USD */
  min: number;
}

interface VendorState {
  settings: Settings;
  vendors: Vendor[];
  clients: VendorClient[];
  comms: Commission[];
  payouts: Payout[];
  meId: number | null;

  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  /** invite / reset links are single use */
  setPassword: (vendorId: number, password: string, mode: 'invite' | 'reset') => void;
  addClient: (input: { name: string; email: string; phone: string }) => { ok: true } | { ok: false; error: string };
  resendInvite: (clientId: number) => void;
  cancelInvite: (clientId: number) => void;
  requestPayout: (amt: number, accountId: number) => void;
  addAccount: (type: AccountType, details: string) => { ok: true } | { ok: false; error: string };
  setDefaultAccount: (id: number) => void;
  deleteAccount: (id: number) => void;
  refLink: () => string;
}

const round3 = (x: number): number => Math.round(x * 1000) / 1000;
const commissionOf = (base: number, rate: number, cur: Currency): number =>
  cur === 'OMR' ? Math.round(((base * rate) / 100) * 1000) / 1000 : Math.round((base * rate) / 100);

let nextId = 100;
const id = (): number => ++nextId;

const initialClients: VendorClient[] = [
  { id: 1, vid: 1, name: 'متجر نور', email: 'nour@shop.com', phone: '+20 111 222 3333', plan: 'الأعمال', cycle: 'شهري', state: 'اشترك', date: '2 أكتوبر 2026' },
  { id: 2, vid: 1, name: 'عيادة الشفاء', email: 'clinic@shifa.com', phone: '+20 122 333 4444', plan: 'الاحترافي', cycle: 'سنوي', state: 'اشترك', date: '20 أكتوبر 2026' },
  { id: 3, vid: 1, name: 'مكتب الريادة', email: 'office@riyada.com', phone: '+20 155 666 7777', plan: '—', cycle: '—', state: 'دعوة مرسلة', via: 'دعوة', date: '1 نوفمبر 2026' },
  { id: 4, vid: 2, name: 'مطعم البحر', email: 'sea@food.om', phone: '+968 9555 0000', plan: 'الأعمال', cycle: 'سنوي', state: 'اشترك', date: '15 أكتوبر 2026' },
  { id: 5, vid: 3, name: 'شركة الواحة', email: 'oasis@co.sa', phone: '+966 50 111 2222', plan: 'الأعمال', cycle: 'سنوي', state: 'اشترك', date: '5 سبتمبر 2026' },
  { id: 6, vid: 3, name: 'متجر السحاب', email: 'sahab@store.sa', phone: '+966 53 333 4444', plan: 'الأعمال', cycle: 'سنوي', state: 'اشترك', date: '12 سبتمبر 2026' },
];

const comm = (cid: number, vid: number, cur: Currency, rate: number, st: CommissionState, left = 0): Commission => {
  const c = initialClients.find((x) => x.id === cid) as VendorClient;
  const base = toLocal(planPriceUsd(c.plan, c.cycle), cur);
  return { id: id(), vid, cid, base, amt: commissionOf(base, rate, cur), st, left };
};

export const useVendorStore = create<VendorState>((set, get) => ({
  settings: { rate: 30, hold: 30, min: 10 },
  vendors: [
    {
      id: 1, name: 'محمود حسن', email: 'mahmoud@agency.com', phone: '+20 100 123 4567', country: 'مصر', cur: 'EGP', rate: 30,
      status: 'نشط', password: 'Partner2026', bankLock: false,
      accounts: [{ id: 1, type: 'حساب بنكي', details: 'بنك مصر · EG12 0002 0001 2345', isDefault: true }],
    },
    {
      id: 2, name: 'شركة الأفق للتسويق', email: 'info@ufuq.om', phone: '+968 9123 0000', country: 'عمان', cur: 'OMR', rate: 25,
      status: 'نشط', password: 'Ufuq2026', bankLock: false,
      accounts: [{ id: 2, type: 'حساب بنكي', details: 'بنك مسقط · OM81 0270 0000 1111', isDefault: true }],
    },
    {
      id: 3, name: 'وكالة المدار', email: 'hello@madar.sa', phone: '+966 55 123 4567', country: 'السعودية', cur: 'SAR', rate: 30,
      status: 'نشط', password: 'Madar2026', bankLock: false,
      accounts: [{ id: 3, type: 'حساب بنكي', details: 'مصرف الراجحي · SA44 2000 0001 2345', isDefault: true }],
    },
    {
      id: 4, name: 'وكالة النخبة', email: 'team@nukhba.com', phone: '+20 100 000 0000', country: 'مصر', cur: 'EGP', rate: 30,
      status: 'دعوة مرسلة', bankLock: false, accounts: [],
    },
  ],
  clients: initialClients,
  comms: [
    comm(1, 1, 'EGP', 30, 'متاحة'),
    comm(2, 1, 'EGP', 30, 'معلّقة', 18),
    comm(4, 2, 'OMR', 25, 'متاحة'),
    comm(5, 3, 'SAR', 30, 'متاحة'),
    comm(6, 3, 'SAR', 30, 'متاحة'),
  ],
  payouts: [
    { id: 1, vid: 2, amt: 20, st: 'بانتظار المراجعة', date: '2 نوفمبر 2026', reason: '', ref: '', fname: '', acct: 'حساب بنكي · بنك مسقط · OM81 0270 0000 1111' },
    { id: 2, vid: 1, amt: 500, st: 'مرفوض', date: '29 أكتوبر 2026', reason: 'اسم صاحب الحساب البنكي لا يطابق اسم المورد', ref: '', fname: '', acct: 'حساب بنكي · بنك مصر · EG12 0002 0001 2345' },
    { id: 3, vid: 3, amt: 300, st: 'تم التحويل', date: '20 أكتوبر 2026', reason: '', ref: 'TRX-88120', fname: 'transfer-88120.pdf', acct: 'حساب بنكي · مصرف الراجحي · SA44 2000 0001 2345' },
    { id: 4, vid: 3, amt: 200, st: 'تمت الموافقة', date: '1 نوفمبر 2026', reason: '', ref: '', fname: '', acct: 'حساب بنكي · مصرف الراجحي · SA44 2000 0001 2345' },
  ],
  meId: null,

  login: (email, password) => {
    const v = get().vendors.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!v || !password) return { ok: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    if (v.status === 'دعوة مرسلة') return { ok: false, error: 'حسابك غير مفعّل بعد. افتح بريد الدعوة وأنشئ كلمة المرور أولًا.' };
    if (v.password !== password) {
      return { ok: false, error: v.status === 'مجمّد' ? 'تم إيقاف حسابك، يرجى مراجعة الإدارة.' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    }
    if (v.status === 'مجمّد') return { ok: false, error: 'تم إيقاف حسابك، يرجى مراجعة الإدارة.' };
    set({ meId: v.id });
    return { ok: true };
  },
  logout: () => set({ meId: null }),

  setPassword: (vendorId, password, mode) =>
    set((s) => ({
      vendors: s.vendors.map((v) =>
        v.id === vendorId ? { ...v, password, status: mode === 'invite' ? 'نشط' : v.status } : v
      ),
      meId: mode === 'invite' ? vendorId : s.meId,
    })),

  addClient: ({ name, email, phone }) => {
    const { clients, meId } = get();
    if (clients.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'هذا البريد الإلكتروني مسجل مسبقًا، ولا يمكن إضافته' };
    }
    set({
      clients: [
        ...clients,
        { id: id(), vid: meId as number, name, email, phone, plan: '—', cycle: '—', state: 'دعوة مرسلة', via: 'دعوة', date: formatDate() },
      ],
    });
    return { ok: true };
  },
  resendInvite: () => undefined,
  cancelInvite: (clientId) => set((s) => ({ clients: s.clients.filter((c) => c.id !== clientId) })),

  requestPayout: (amt, accountId) => {
    const { meId, vendors, payouts } = get();
    const v = vendors.find((x) => x.id === meId) as Vendor;
    const a = v.accounts.find((x) => x.id === accountId) as TransferAccount;
    set({
      payouts: [
        { id: id(), vid: v.id, amt, st: 'بانتظار المراجعة', date: formatDate(), reason: '', ref: '', fname: '', acct: `${a.type} · ${a.details}` },
        ...payouts,
      ],
    });
  },

  addAccount: (type, details) => {
    const { meId, vendors } = get();
    const v = vendors.find((x) => x.id === meId) as Vendor;
    if (v.accounts.some((a) => a.type === type && a.details === details)) return { ok: false, error: 'هذا الحساب مضاف بالفعل' };
    const first = v.accounts.length === 0;
    set({
      vendors: vendors.map((x) =>
        x.id === v.id ? { ...x, bankLock: true, accounts: [...x.accounts, { id: id(), type, details, isDefault: first }] } : x
      ),
    });
    return { ok: true };
  },
  setDefaultAccount: (accountId) =>
    set((s) => ({
      vendors: s.vendors.map((v) =>
        v.id === s.meId ? { ...v, bankLock: true, accounts: v.accounts.map((a) => ({ ...a, isDefault: a.id === accountId })) } : v
      ),
    })),
  deleteAccount: (accountId) =>
    set((s) => ({
      vendors: s.vendors.map((v) => (v.id === s.meId ? { ...v, accounts: v.accounts.filter((a) => a.id !== accountId) } : v)),
    })),

  refLink: () => `https://qhub.chat/p/v${1000 + (get().meId ?? 0)}`,
}));

/* ---------- derived values ---------- */

export interface VendorSums {
  pending: number;
  avail: number;
  inReview: number;
  paid: number;
}

/** balances of one vendor: pending hold, available, in an open payout request, and already paid */
export function sumsFor(vid: number, comms: Commission[], payouts: Payout[]): VendorSums {
  const c = comms.filter((x) => x.vid === vid);
  const total = (st: CommissionState): number => c.filter((x) => x.st === st).reduce((a, b) => a + b.amt, 0);
  const po = payouts.filter((p) => p.vid === vid);
  const sumOf = (states: PayoutState[]): number => po.filter((p) => states.includes(p.st)).reduce((a, b) => a + b.amt, 0);
  const inReview = sumOf(['بانتظار المراجعة', 'تمت الموافقة']);
  const paid = sumOf(['تم التحويل']);
  return { pending: round3(total('معلّقة')), avail: round3(total('متاحة') - inReview - paid), inReview: round3(inReview), paid: round3(paid) };
}
