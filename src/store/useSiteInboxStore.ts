import { create } from 'zustand';
import type { InboxItem, InboxStatus } from '@/types/siteContent';

/**
 * الوارد من الموقع (CMS-PROMPT §7.14): رسائل التواصل، Leads المساعد، وطلبات
 * المؤسسات. في الديمو بيانات نموذجية تُحفظ حالتها في المتصفّح؛ في النسخة
 * الحقيقية تصل من الموقع إلى `POST /api/v1/contact|leads|enterprise-requests`.
 */

const KEY = 'qhub_site_inbox_v1';
const ago = (minutes: number): string => new Date(Date.now() - minutes * 60_000).toISOString();

const SAMPLE: InboxItem[] = [
  { id: 'c1', kind: 'contact', name: 'ريم الحارثي', company: 'متجر نسمة', email: 'reem@nasma.om', phone: '+96891234567', subject: 'الأسعار والباقات', message: 'عندنا 4 موظفين خدمة عملاء وقناتين واتساب وإنستغرام. أي باقة تناسبنا؟ وهل فيه خصم سنوي؟', locale: 'ar', page: '/pricing', at: ago(18), status: 'new', notes: [] },
  { id: 'c2', kind: 'contact', name: 'Omar Haddad', company: 'Haddad Clinics', email: 'omar@haddadclinics.jo', phone: '+962791112233', subject: 'Demo request', message: 'We run 3 clinics and get most bookings over WhatsApp. Could we book a demo this week?', locale: 'en', page: '/solutions', at: ago(95), status: 'new', notes: [] },
  { id: 'c3', kind: 'contact', name: 'سلطان الكعبي', email: 'sultan@example.ae', phone: '+971501234567', subject: 'الدعم الفني', message: 'ربطت رقم الواتساب لكن الرسائل ما توصل للصندوق. أحتاج مساعدة.', locale: 'ar', page: '/contact', at: ago(240), status: 'open', assignee: 'محمد الكندي', notes: [{ by: 'محمد الكندي', at: ago(200), text: 'طلبت منه لقطة لإعدادات الويب هوك.' }] },
  { id: 'c4', kind: 'contact', name: 'نورة القحطاني', company: 'دار الفخامة للعقار', email: 'noura@fakhama.sa', phone: '+966551234567', subject: 'شراكة', message: 'نبحث عن شراكة لتسويق المنصة لعملائنا في قطاع العقار.', locale: 'ar', page: '/', at: ago(60 * 26), status: 'closed', notes: [] },
  {
    id: 'l1', kind: 'lead', name: 'خالد المعمري', phone: '+96899887766', locale: 'ar', page: '/features/ai-assistant', at: ago(35), status: 'new', notes: [],
    transcript: [
      { from: 'visitor', text: 'هل المساعد يفهم اللهجة العمانية؟', at: ago(38) },
      { from: 'assistant', text: 'نعم، يفهم اللهجات الخليجية والمصرية والشامية ويرد بلغة عميلك.', at: ago(38) },
      { from: 'visitor', text: 'كم سعر الباقة اللي فيها المساعد؟', at: ago(37) },
      { from: 'assistant', text: 'المساعد متاح من الباقة الاحترافية. أترك رقمك ويتواصل معك فريق المبيعات بالتفاصيل لدولتك.', at: ago(36) },
    ],
  },
  {
    id: 'l2', kind: 'lead', name: 'Sara Ali', email: 'sara@bloomstore.com', locale: 'en', page: '/pricing', at: ago(60 * 5), status: 'open', assignee: 'محمد الكندي', notes: [],
    transcript: [
      { from: 'visitor', text: 'Do you integrate with Shopify?', at: ago(60 * 5 + 4) },
      { from: 'assistant', text: 'Yes — Shopify, Salla, Zid and WooCommerce. Order questions land in the same inbox.', at: ago(60 * 5 + 3) },
      { from: 'visitor', text: 'Great, please contact me.', at: ago(60 * 5 + 1) },
    ],
  },
  { id: 'e1', kind: 'enterprise', name: 'م. فهد العتيبي', company: 'مجموعة الرواد للتجزئة', email: 'fahad@alrowad.sa', phone: '+966501112222', teamSize: '60 موظفاً', channels: 'واتساب ×3، إنستغرام، الإيميل', convos: '40,000 شهرياً', note: 'نحتاج ربطاً مع نظام ERP عندنا وتقارير لكل فرع.', locale: 'ar', page: '/pricing', at: ago(60 * 3), status: 'new', notes: [] },
  { id: 'e2', kind: 'enterprise', name: 'Layla Mansour', company: 'Gulf Air Travel', email: 'layla@gulfairtravel.bh', phone: '+97333112233', teamSize: '25 agents', convos: '15,000 / month', note: 'Looking for dedicated hosting and an SLA.', locale: 'en', page: '/pricing', at: ago(60 * 30), status: 'open', assignee: 'محمد الكندي', notes: [] },
];

function read(): InboxItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SAMPLE;
  } catch {
    return SAMPLE;
  }
}

interface InboxState {
  items: InboxItem[];
  setStatus: (id: string, status: InboxStatus) => void;
  assign: (id: string, assignee: string | null) => void;
  addNote: (id: string, by: string, text: string) => void;
  /** فتح عنصر جديد ينقله من «جديد» إلى «قيد المتابعة» */
  markOpened: (id: string) => void;
}

export const useSiteInboxStore = create<InboxState>((set, get) => {
  const save = (items: InboxItem[]): void => {
    set({ items });
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {/* ignore */}
  };
  const patch = (id: string, fn: (i: InboxItem) => InboxItem): void => save(get().items.map((i) => (i.id === id ? fn(i) : i)));

  return {
    items: read(),
    setStatus: (id, status) => patch(id, (i) => ({ ...i, status })),
    assign: (id, assignee) => patch(id, (i) => ({ ...i, assignee })),
    addNote: (id, by, text) => patch(id, (i) => ({ ...i, notes: [...i.notes, { by, at: new Date().toISOString(), text }] })),
    markOpened: (id) => patch(id, (i) => (i.status === 'new' ? { ...i, status: 'open' } : i)),
  };
});
