import { create } from 'zustand';

export interface NotificationPrefs {
  newConv: boolean;
  newMsg: boolean;
  campaigns: boolean;
  browser: boolean;
  sound: boolean;
}

export interface SecurityPrefs {
  twoFactor: boolean;
  ipRestriction: boolean;
  sessionTimeoutMin: number;
}

export interface GeneralPrefs {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  language: 'ar' | 'en';
  timezone: string;
  dateFormat: string;
}

export interface CompanyInfo {
  name: string;
  nameEn: string;
  tagline: string;
  logoUrl: string;
  iconUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  country: string;
  website: string;
  taxId: string;
  registrationNumber: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  telegram: string;
  snapchat: string;
}

export interface Currency {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  usdRate: number;
}

export interface AIDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface AISettings {
  enabled: boolean;
  provider: 'chatgpt' | 'claude' | 'gemini';
  apiKey: string;
  model: string;
  maxTokens: number;
  languages: string[];
  tone: 'concise' | 'friendly' | 'formal' | 'luxury';
  dialect: 'fus7a' | 'khaleeji' | 'masri' | 'shami';
  companyPrompt: string;
  documents: AIDocument[];
  learnFromDocs: boolean;
  learnFromReplies: boolean;
  learnFromKnowledge: boolean;
  forbiddenTopics: string;
  forbiddenReply: string;
  handoffOnRequest: boolean;
  handoffOnFailure: boolean;
  handoffOnNegative: boolean;
  handoffOnRepeat: boolean;
  handoffOnPayment: boolean;
  handoffOnUrgent: boolean;
  handoffKeywords: string[];
  handoffAssignee: string;
  is24_7: boolean;
  workDays: string[];
  workFrom: string;
  workTo: string;
  offlineMessage: string;
}

export interface WidgetSettings {
  enabled: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  bubbleIcon: 'chat' | 'message' | 'help';
  welcomeMessage: string;
  teamName: string;
  responseTime: string;
  showAvatar: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  autoReply: boolean;
  autoReplyMessage: string;
  offlineMessage: string;
  brandingHidden: boolean;
}

export interface CredentialDeliveryPrefs {
  sendViaWhatsapp: boolean;
  sendViaEmail: boolean;
}

/** Every event that can send a mail. One template per event, at most. */
export const MAIL_TRIGGERS = [
  { key: 'on_client_registered', label: 'عند التسجيل', description: 'يُرسل عند تسجيل عميل جديد في النظام' },
  { key: 'on_trial_started', label: 'عند بدء الفترة التجريبية', description: 'يُرسل عند منح العميل فترته التجريبية' },
  { key: 'on_trial_ended', label: 'عند انتهاء الفترة التجريبية', description: 'يُرسل عند انتهاء التجربة دون اشتراك' },
  { key: 'on_invoice_created', label: 'عند إصدار فاتورة', description: 'يُرسل عند إنشاء فاتورة جديدة للعميل' },
  { key: 'before_renewal', label: 'قبل التجديد', description: 'تذكير تلقائي قبل تجديد الاشتراك بمدة محددة', hasDuration: true },
  { key: 'on_renewal', label: 'عند التجديد', description: 'يُرسل عند تجديد الاشتراك بنجاح' },
  { key: 'on_subscription_expired', label: 'عند انتهاء الاشتراك', description: 'يُرسل عند انتهاء صلاحية اشتراك العميل' },
  { key: 'on_subscription_extended', label: 'عند تمديد الاشتراك', description: 'يُرسل عندما يمنح الأدمن العميل أياماً إضافية' },
  { key: 'on_plan_upgraded', label: 'عند ترقية الباقة', description: 'يُرسل عند ترقية العميل لباقة أعلى' },
  { key: 'on_plan_downgraded', label: 'عند تخفيض الباقة', description: 'يُرسل عند تخفيض العميل لباقة أقل' },
  { key: 'on_downgrade_scheduled', label: 'عند جدولة تخفيض', description: 'يُرسل عند جدولة تخفيض يُطبَّق بنهاية الفترة الحالية' },
  { key: 'on_payment_success', label: 'عند نجاح الدفع', description: 'يُرسل بعد تأكيد الدفع بنجاح' },
  { key: 'on_payment_failed', label: 'عند فشل الدفع', description: 'يُرسل عند فشل عملية الدفع' },
  { key: 'on_account_disabled', label: 'عند إلغاء تفعيل الحساب', description: 'يُرسل عندما يُعطّل الأدمن حساب العميل' },
  { key: 'on_plan_request_status', label: 'عند تغيير حالة طلب الباقة', description: 'يُرسل عند تحديث حالة طلب باقة مقدَّم من العميل' },
] as const;

export type MailTriggerKey = (typeof MAIL_TRIGGERS)[number]['key'];

/** Placeholders the backend substitutes when the mail goes out. */
export const MAIL_VARIABLES = [
  'client_name', 'company_name', 'product_name', 'plan_name',
  'amount', 'currency', 'invoice_number', 'due_date',
  'period_end', 'days', 'payment_url', 'support_email',
] as const;

export interface EmailButton {
  text: string;
  url: string;
  variant: 'primary' | 'outline' | 'link';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  /** HTML — the editor writes HTML, so the seeds are HTML too */
  body: string;
  trigger: string;
  /** only for `before_renewal`: how many days ahead to send */
  triggerDays?: string;
  buttons?: EmailButton[];
}

const t = (
  id: string, name: string, trigger: string, subject: string,
  paragraphs: string[], buttons?: EmailButton[], triggerDays?: string
): EmailTemplate => ({
  id, name, trigger, subject,
  body: paragraphs.map((x) => `<p>${x}</p>`).join(''),
  ...(triggerDays ? { triggerDays } : {}),
  ...(buttons ? { buttons } : {}),
});

const PAY = (text = 'ادفع الآن'): EmailButton[] => [{ text, url: '{{payment_url}}', variant: 'primary' }];

export const defaultEmailTemplates: EmailTemplate[] = [
  t('tpl_registered', 'رسالة الترحيب', 'on_client_registered', 'مرحباً بك في {{product_name}}', [
    'مرحباً {{client_name}}،',
    'شكراً لتسجيلك في {{product_name}}. حسابك جاهز للاستخدام، ويمكنك الدخول إليه في أي وقت.',
    'إن احتجت أي مساعدة فنحن على {{support_email}}.',
    'فريق {{product_name}}',
  ]),
  t('tpl_trial_started', 'بدء الفترة التجريبية', 'on_trial_started', 'بدأت فترتك التجريبية في {{product_name}}', [
    'مرحباً {{client_name}}،',
    'فُعِّلت فترتك التجريبية وتستمر حتى {{period_end}}. جرّب كل المزايا بلا أي التزام.',
    'يمكنك الاشتراك في أي وقت قبل انتهائها لتستمر بياناتك كما هي.',
  ]),
  t('tpl_trial_ended', 'انتهاء الفترة التجريبية', 'on_trial_ended', 'انتهت فترتك التجريبية في {{product_name}}', [
    'مرحباً {{client_name}}،',
    'انتهت فترتك التجريبية اليوم. اختر الباقة المناسبة لتستأنف العمل ببياناتك المحفوظة.',
  ], [{ text: 'اختر باقتك', url: '{{payment_url}}', variant: 'primary' }]),
  t('tpl_invoice', 'إشعار فاتورة', 'on_invoice_created', 'فاتورة جديدة رقم {{invoice_number}}', [
    'مرحباً {{client_name}}،',
    'صدرت فاتورة جديدة بمبلغ {{amount}} {{currency}}، رقمها {{invoice_number}}، وموعد استحقاقها {{due_date}}.',
    'شكراً لثقتكم.',
  ], PAY()),
  t('tpl_before_renewal', 'تذكير تجديد', 'before_renewal', 'تجديد اشتراكك في {{plan_name}}', [
    'مرحباً {{client_name}}،',
    'اشتراكك في باقة {{plan_name}} سيتجدد خلال {{days}} أيام بمبلغ {{amount}} {{currency}}.',
    'إن رغبت بتعديل الباقة أو إيقاف التجديد، تواصل معنا قبل هذا الموعد.',
  ], undefined, '3'),
  t('tpl_renewal', 'تأكيد التجديد', 'on_renewal', 'تم تجديد اشتراكك في {{plan_name}}', [
    'مرحباً {{client_name}}،',
    'جُدِّد اشتراكك في باقة {{plan_name}} بنجاح، وهو سارٍ حتى {{period_end}}.',
  ]),
  t('tpl_expired', 'انتهاء الاشتراك', 'on_subscription_expired', 'انتهى اشتراكك في {{product_name}}', [
    'مرحباً {{client_name}}،',
    'انتهت صلاحية اشتراكك في باقة {{plan_name}}. بياناتك محفوظة، ويمكنك استئناف الخدمة بالتجديد في أي وقت.',
  ], PAY('جدّد اشتراكك')),
  t('tpl_extended', 'تمديد الاشتراك', 'on_subscription_extended', 'تم تمديد اشتراكك {{days}} يوماً', [
    'مرحباً {{client_name}}،',
    'مُدِّد اشتراكك {{days}} يوماً إضافية، ويستمر حتى {{period_end}}.',
    'يُرجى تسديد الفاتورة المستحقة قبل انتهاء هذه المدة حتى لا تتوقف الخدمة.',
  ], PAY()),
  t('tpl_upgraded', 'ترقية الباقة', 'on_plan_upgraded', 'ترقية باقتك إلى {{plan_name}}', [
    'مرحباً {{client_name}}،',
    'رُقِّيت باقتك إلى {{plan_name}}، وانتهت الباقة السابقة بالكامل.',
    'لتفعيل الباقة الجديدة يُرجى سداد مبلغ {{amount}} {{currency}}.',
  ], PAY()),
  t('tpl_downgraded', 'تخفيض الباقة', 'on_plan_downgraded', 'تم تغيير باقتك إلى {{plan_name}}', [
    'مرحباً {{client_name}}،',
    'أصبحت باقتك الآن {{plan_name}} بمبلغ {{amount}} {{currency}} لكل دورة.',
  ]),
  t('tpl_downgrade_sched', 'جدولة تخفيض الباقة', 'on_downgrade_scheduled', 'تغيير مجدول لباقتك', [
    'مرحباً {{client_name}}،',
    'سُجِّل طلب تغيير باقتك إلى {{plan_name}}، ويُطبَّق تلقائياً عند انتهاء فترتك الحالية في {{period_end}}.',
    'تبقى باقتك الحالية سارية حتى ذلك الموعد.',
  ]),
  t('tpl_pay_ok', 'تأكيد الدفع', 'on_payment_success', 'تم استلام دفعتك', [
    'مرحباً {{client_name}}،',
    'استلمنا مبلغ {{amount}} {{currency}} عن الفاتورة {{invoice_number}}. اشتراكك فعّال حتى {{period_end}}.',
    'شكراً لثقتكم.',
  ]),
  t('tpl_pay_fail', 'فشل الدفع', 'on_payment_failed', 'لم تتم عملية الدفع', [
    'مرحباً {{client_name}}،',
    'لم تنجح عملية دفع مبلغ {{amount}} {{currency}} عن الفاتورة {{invoice_number}}.',
    'يُرجى المحاولة مرة أخرى أو استخدام وسيلة دفع أخرى حتى لا تتوقف الخدمة.',
  ], PAY('أعد المحاولة')),
  t('tpl_disabled', 'إلغاء تفعيل الحساب', 'on_account_disabled', 'تم إيقاف حسابك في {{product_name}}', [
    'مرحباً {{client_name}}،',
    'أُوقف حساب {{company_name}} مؤقتاً. بياناتك محفوظة ولم يُحذف منها شيء.',
    'للاستفسار أو إعادة التفعيل تواصل معنا على {{support_email}}.',
  ]),
  t('tpl_request_status', 'تحديث طلب الباقة', 'on_plan_request_status', 'تحديث على طلبك لباقة {{plan_name}}', [
    'مرحباً {{client_name}}،',
    'جرى تحديث حالة طلبك لباقة {{plan_name}}.',
    'سيتواصل معك فريقنا لاستكمال الإجراءات إن لزم.',
  ]),
];

interface SettingsState {
  notifications: NotificationPrefs;
  security: SecurityPrefs;
  general: GeneralPrefs;
  company: CompanyInfo;
  social: SocialLinks;
  currencies: Currency[];
  widget: WidgetSettings;
  ai: AISettings;
  credentialDelivery: CredentialDeliveryPrefs;
  emailTemplates: EmailTemplate[];
  setNotifications: (patch: Partial<NotificationPrefs>) => void;
  setSecurity: (patch: Partial<SecurityPrefs>) => void;
  setGeneral: (patch: Partial<GeneralPrefs>) => void;
  setCompany: (patch: Partial<CompanyInfo>) => void;
  setSocial: (patch: Partial<SocialLinks>) => void;
  setWidget: (patch: Partial<WidgetSettings>) => void;
  setAI: (patch: Partial<AISettings>) => void;
  setCredentialDelivery: (patch: Partial<CredentialDeliveryPrefs>) => void;
  /** refuses when another template already claims the same trigger */
  saveEmailTemplate: (tpl: EmailTemplate) => boolean;
  deleteEmailTemplate: (id: string) => void;
  addCurrency: (c: Currency) => void;
  updateCurrency: (code: string, patch: Partial<Currency>) => void;
  removeCurrency: (code: string) => void;
  reset: () => void;
}

const KEY = 'sekaa_settings_v1';

type Persisted = Pick<SettingsState, 'notifications' | 'security' | 'general' | 'company' | 'social' | 'currencies' | 'widget' | 'ai' | 'credentialDelivery' | 'emailTemplates'>;

const defaultState: Persisted = {
  emailTemplates: defaultEmailTemplates,
  notifications: { newConv: true, newMsg: true, campaigns: true, browser: false, sound: true },
  security: { twoFactor: false, ipRestriction: false, sessionTimeoutMin: 60 },
  general: {
    siteName: 'Qhub',
    siteUrl: 'https://chat-client.apexes.click',
    supportEmail: 'support@apexes.click',
    supportPhone: '+96891234567',
    language: 'ar',
    timezone: 'Asia/Muscat',
    dateFormat: 'DD/MM/YYYY',
  },
  company: {
    name: 'Apex Solutions',
    nameEn: 'Apex Solutions',
    tagline: 'منصة CRM متكاملة للشركات',
    logoUrl: '',
    iconUrl: '',
    email: 'info@apexes.click',
    phone: '+96891234567',
    whatsapp: '+96891234567',
    address: 'مسقط، سلطنة عُمان',
    country: 'OM',
    website: 'https://apexes.click',
    taxId: '',
    registrationNumber: '',
  },
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    telegram: '',
    snapchat: '',
  },
  widget: {
    enabled: true,
    primaryColor: '#1565A0',
    position: 'bottom-right',
    bubbleIcon: 'chat',
    welcomeMessage: 'مرحباً! كيف يمكننا مساعدتك؟',
    teamName: 'فريق الدعم',
    responseTime: 'نرد عادةً خلال دقائق',
    showAvatar: true,
    collectEmail: true,
    collectPhone: false,
    autoReply: true,
    autoReplyMessage: 'شكراً لتواصلك! سيقوم أحد أفراد فريقنا بالرد عليك قريباً.',
    offlineMessage: 'نحن غير متاحين حالياً. اترك رسالتك وسنرد عليك في أقرب وقت.',
    brandingHidden: false,
  },
  ai: {
    enabled: true,
    provider: 'chatgpt',
    apiKey: '',
    model: 'gpt-4o-mini',
    maxTokens: 600,
    languages: ['ar', 'en'],
    tone: 'friendly',
    dialect: 'fus7a',
    companyPrompt: '',
    documents: [],
    learnFromDocs: true,
    learnFromReplies: true,
    learnFromKnowledge: true,
    forbiddenTopics: '',
    forbiddenReply: 'عذراً لا أستطيع المساعدة في هذا الموضوع. للحصول على إجابة دقيقة سيتواصل معك أحد موظفينا قريباً 🙏',
    handoffOnRequest: true,
    handoffOnFailure: true,
    handoffOnNegative: true,
    handoffOnRepeat: false,
    handoffOnPayment: true,
    handoffOnUrgent: true,
    handoffKeywords: ['شكوى', 'موظف', 'بشري', 'استرداد', 'مشكلة', 'speak to human'],
    handoffAssignee: '',
    is24_7: false,
    workDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
    workFrom: '09:00',
    workTo: '17:00',
    offlineMessage: 'أهلاً خارج ساعات الدوام حالياً، لكن سجّلنا طلبك وسيتواصل معك أحد الموظفين أول الدوام. ولأي استفسار سريع يمكنك الاعتماد عليّ.',
  },
  credentialDelivery: {
    sendViaWhatsapp: true,
    sendViaEmail: true,
  },
  currencies: [
    { code: 'OMR', name: 'Omani Rial', nameAr: 'ريال عُماني', symbol: 'ر.ع', usdRate: 0.385 },
    { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', usdRate: 3.673 },
    { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', usdRate: 3.75 },
    { code: 'KWD', name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', symbol: 'د.ك', usdRate: 0.307 },
    { code: 'QAR', name: 'Qatari Riyal', nameAr: 'ريال قطري', symbol: 'ر.ق', usdRate: 3.64 },
    { code: 'BHD', name: 'Bahraini Dinar', nameAr: 'دينار بحريني', symbol: 'د.ب', usdRate: 0.376 },
    { code: 'EGP', name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'ج.م', usdRate: 48.7 },
    { code: 'JOD', name: 'Jordanian Dinar', nameAr: 'دينار أردني', symbol: 'د.أ', usdRate: 0.709 },
    { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', usdRate: 1 },
  ],
};

function read(): Persisted {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      ...defaultState,
      ...parsed,
      company: { ...defaultState.company, ...(parsed.company ?? {}) },
      social: { ...defaultState.social, ...(parsed.social ?? {}) },
      widget: { ...defaultState.widget, ...(parsed.widget ?? {}) },
      ai: { ...defaultState.ai, ...(parsed.ai ?? {}) },
      credentialDelivery: { ...defaultState.credentialDelivery, ...(parsed.credentialDelivery ?? {}) },
      currencies: parsed.currencies?.length ? parsed.currencies : defaultState.currencies,
      emailTemplates: parsed.emailTemplates?.length ? parsed.emailTemplates : defaultState.emailTemplates,
    };
  } catch {
    return defaultState;
  }
}

function persist(state: Persisted): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify({
      notifications: state.notifications,
      security: state.security,
      general: state.general,
      company: state.company,
      social: state.social,
      widget: state.widget,
      ai: state.ai,
      credentialDelivery: state.credentialDelivery,
      currencies: state.currencies,
      emailTemplates: state.emailTemplates,
    }));
  } catch {/* ignore */}
}

const initial = read();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...initial,
  setNotifications: (patch) => {
    set((s) => ({ notifications: { ...s.notifications, ...patch } }));
    persist(get());
  },
  setSecurity: (patch) => {
    set((s) => ({ security: { ...s.security, ...patch } }));
    persist(get());
  },
  setGeneral: (patch) => {
    set((s) => ({ general: { ...s.general, ...patch } }));
    persist(get());
  },
  setCompany: (patch) => {
    set((s) => ({ company: { ...s.company, ...patch } }));
    persist(get());
  },
  setSocial: (patch) => {
    set((s) => ({ social: { ...s.social, ...patch } }));
    persist(get());
  },
  setWidget: (patch) => {
    set((s) => ({ widget: { ...s.widget, ...patch } }));
    persist(get());
  },
  setAI: (patch) => {
    set((s) => ({ ai: { ...s.ai, ...patch } }));
    persist(get());
  },
  setCredentialDelivery: (patch) => {
    set((s) => ({ credentialDelivery: { ...s.credentialDelivery, ...patch } }));
    persist(get());
  },
  saveEmailTemplate: (tpl) => {
    // one event, one template — otherwise which of the two actually sends?
    const clash = get().emailTemplates.some((x) => x.id !== tpl.id && x.trigger === tpl.trigger);
    if (clash) return false;
    set((s) => ({
      emailTemplates: s.emailTemplates.some((x) => x.id === tpl.id)
        ? s.emailTemplates.map((x) => (x.id === tpl.id ? tpl : x))
        : [...s.emailTemplates, tpl],
    }));
    persist(get());
    return true;
  },
  deleteEmailTemplate: (id) => {
    set((s) => ({ emailTemplates: s.emailTemplates.filter((x) => x.id !== id) }));
    persist(get());
  },
  addCurrency: (c) => {
    set((s) => ({ currencies: [...s.currencies.filter((x) => x.code !== c.code), c] }));
    persist(get());
  },
  updateCurrency: (code, patch) => {
    set((s) => ({ currencies: s.currencies.map((c) => (c.code === code ? { ...c, ...patch } : c)) }));
    persist(get());
  },
  removeCurrency: (code) => {
    set((s) => ({ currencies: s.currencies.filter((c) => c.code !== code) }));
    persist(get());
  },
  reset: () => {
    set({ ...defaultState });
    persist(defaultState);
  },
}));
