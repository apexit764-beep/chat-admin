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

interface SettingsState {
  notifications: NotificationPrefs;
  security: SecurityPrefs;
  general: GeneralPrefs;
  company: CompanyInfo;
  social: SocialLinks;
  currencies: Currency[];
  widget: WidgetSettings;
  setNotifications: (patch: Partial<NotificationPrefs>) => void;
  setSecurity: (patch: Partial<SecurityPrefs>) => void;
  setGeneral: (patch: Partial<GeneralPrefs>) => void;
  setCompany: (patch: Partial<CompanyInfo>) => void;
  setSocial: (patch: Partial<SocialLinks>) => void;
  setWidget: (patch: Partial<WidgetSettings>) => void;
  addCurrency: (c: Currency) => void;
  updateCurrency: (code: string, patch: Partial<Currency>) => void;
  removeCurrency: (code: string) => void;
  reset: () => void;
}

const KEY = 'sekaa_settings_v1';

type Persisted = Pick<SettingsState, 'notifications' | 'security' | 'general' | 'company' | 'social' | 'currencies' | 'widget'>;

const defaultState: Persisted = {
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
      currencies: parsed.currencies?.length ? parsed.currencies : defaultState.currencies,
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
      currencies: state.currencies,
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
