import type {
  AdminUser,
  Client,
  Country,
  Industry,
  Invoice,
  KnowledgeArticle,
  KnowledgeCategory,
  LiveChatConversation,
  PaymobConfig,
  Plan,
  PlanRequest,
  Subscription,
  Transaction,
} from '@/types';

const nowMinus = (min: number): string =>
  new Date(Date.now() - min * 60 * 1000).toISOString();

const nowPlusDays = (days: number): string =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

// =====================================================================
// Countries
// =====================================================================
export const countries: Country[] = [
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', dialCode: '+968', currency: 'OMR', symbol: 'ر.ع', usdRate: 0.385, active: true },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', dialCode: '+971', currency: 'AED', symbol: 'د.إ', usdRate: 3.67, active: true },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', dialCode: '+966', currency: 'SAR', symbol: 'ر.س', usdRate: 3.75, active: true },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', dialCode: '+965', currency: 'KWD', symbol: 'د.ك', usdRate: 0.31, active: true },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', dialCode: '+974', currency: 'QAR', symbol: 'ر.ق', usdRate: 3.64, active: true },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', dialCode: '+973', currency: 'BHD', symbol: 'د.ب', usdRate: 0.377, active: true },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', dialCode: '+20', currency: 'EGP', symbol: 'ج.م', usdRate: 49, active: true },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', dialCode: '+962', currency: 'JOD', symbol: 'د.أ', usdRate: 0.71, active: true },
];

// =====================================================================
// Plans — multi-country pricing
// =====================================================================
// Base USD prices: Starter 19, Pro 49, Business 99, Enterprise 249
function pricesFromUSD(usd: number): Record<string, { monthly: number; yearly: number }> {
  const out: Record<string, { monthly: number; yearly: number }> = {};
  countries.forEach((c) => {
    const monthly = Math.max(1, Math.round(usd * c.usdRate * (c.code === 'EG' ? 1 : c.code === 'JO' || c.code === 'OM' || c.code === 'KW' || c.code === 'BH' ? 1 : 1)));
    out[c.code] = { monthly, yearly: Math.round(monthly * 10) };
  });
  return out;
}

export const industries: Industry[] = [
  { id: 'ind_1', name: 'عقارات' },
  { id: 'ind_2', name: 'مطاعم' },
  { id: 'ind_3', name: 'تعليم' },
  { id: 'ind_4', name: 'صحة' },
  { id: 'ind_5', name: 'تقنية' },
  { id: 'ind_6', name: 'سياحة' },
  { id: 'ind_7', name: 'سيارات' },
  { id: 'ind_8', name: 'تجزئة' },
  { id: 'ind_9', name: 'لوجستيات' },
  { id: 'ind_10', name: 'تجميل' },
  { id: 'ind_11', name: 'زراعة' },
  { id: 'ind_12', name: 'تمويل وبنوك' },
  { id: 'ind_13', name: 'إعلام ونشر' },
  { id: 'ind_14', name: 'بناء ومقاولات' },
  { id: 'ind_15', name: 'تصنيع' },
];

export const plans: Plan[] = [
  {
    id: 'plan_starter',
    tier: 'starter',
    name: 'Starter',
    nameAr: 'المبتدئ',
    tagline: 'للمشاريع الناشئة وفرق العمل الصغيرة',
    features: [
      'حتى 3 موظفين',
      'رقم واتساب واحد',
      '1000 محادثة/شهر',
      '500 جهة اتصال',
      'الردود المحفوظة الأساسية',
      'دعم عبر البريد',
    ],
    limits: { agents: 3, channels: 1, conversations: 1000, contacts: 500 },
    pricesPerCountry: pricesFromUSD(19),
    active: true,
    createdAt: nowMinus(60 * 24 * 200),
  },
  {
    id: 'plan_pro',
    tier: 'pro',
    name: 'Pro',
    nameAr: 'الاحترافي',
    tagline: 'للشركات النامية مع فريق دعم',
    features: [
      'حتى 10 موظفين',
      '3 أرقام واتساب',
      '10,000 محادثة/شهر',
      'جهات اتصال غير محدودة',
      'الحملات والقوالب المتقدمة',
      'تقارير تفصيلية',
      'تكامل Messenger وInstagram',
      'دعم عبر الواتساب',
    ],
    limits: { agents: 10, channels: 3, conversations: 10000, contacts: -1 },
    pricesPerCountry: pricesFromUSD(49),
    popular: true,
    active: true,
    createdAt: nowMinus(60 * 24 * 200),
  },
  {
    id: 'plan_business',
    tier: 'business',
    name: 'Business',
    nameAr: 'الأعمال',
    tagline: 'لفرق متوسطة وكبيرة مع أقسام متعددة',
    features: [
      'حتى 25 موظف',
      '10 قنوات (واتساب + غيرها)',
      '50,000 محادثة/شهر',
      'الأقسام والتقارير المتقدمة',
      'Live Chat Widget',
      'كل التكاملات (Telegram, X, Webhook)',
      'API كامل',
      'دعم مخصص',
    ],
    limits: { agents: 25, channels: 10, conversations: 50000, contacts: -1 },
    pricesPerCountry: pricesFromUSD(99),
    active: true,
    createdAt: nowMinus(60 * 24 * 180),
  },
  {
    id: 'plan_enterprise',
    tier: 'enterprise',
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    tagline: 'حلول مخصصة للشركات الكبرى',
    features: [
      'موظفون غير محدودين',
      'قنوات غير محدودة',
      'محادثات غير محدودة',
      'SLA مضمون 99.9%',
      'مدير حساب مخصص',
      'تدريب مجاني للفريق',
      'تخصيص العلامة التجارية',
      'استضافة خاصة (Dedicated)',
    ],
    limits: { agents: -1, channels: -1, conversations: -1, contacts: -1 },
    pricesPerCountry: pricesFromUSD(249),
    requiresContact: true,
    active: true,
    createdAt: nowMinus(60 * 24 * 150),
  },
];

// =====================================================================
// Clients
// =====================================================================
export const clients: Client[] = [
  {
    id: 'client_1',
    companyName: 'Qhub',
    contactName: 'محمد الكندي',
    email: 'admin@qhub.com',
    phone: '+96891234567',
    country: 'OM',
    industry: 'عقارات وتأجير',
    status: 'active',
    planId: 'plan_business',
    subscriptionId: 'sub_1',
    agentCount: 5,
    channelCount: 8,
    conversationCount: 312,
    mrr: 38,
    currency: 'OMR',
    username: 'admin@qhub.com',
    password: 'Qh#2024!xK',
    dashboardUrl: 'https://chat-client.apexes.click',
    joinedAt: nowMinus(60 * 24 * 90),
    lastActiveAt: nowMinus(5),
  },
  {
    id: 'client_2',
    companyName: 'مطعم البيت العماني',
    contactName: 'سالم البلوشي',
    email: 'salim@albeit.om',
    phone: '+96892345678',
    country: 'OM',
    industry: 'مطاعم',
    status: 'active',
    planId: 'plan_pro',
    subscriptionId: 'sub_2',
    agentCount: 4,
    channelCount: 2,
    conversationCount: 845,
    mrr: 19,
    currency: 'OMR',
    username: 'salim@albeit.om',
    password: 'Ab#7mPq!9z',
    dashboardUrl: 'https://albeit.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 60),
    lastActiveAt: nowMinus(30),
  },
  {
    id: 'client_3',
    companyName: 'Dubai Real Estate Co.',
    contactName: 'Khalid Al Maktoum',
    email: 'k.almaktoum@dre.ae',
    phone: '+971501234567',
    country: 'AE',
    industry: 'عقارات',
    status: 'active',
    planId: 'plan_business',
    subscriptionId: 'sub_3',
    agentCount: 18,
    channelCount: 6,
    conversationCount: 2841,
    mrr: 363,
    currency: 'AED',
    username: 'k.almaktoum@dre.ae',
    password: 'Hy#6tRm!2q',
    dashboardUrl: 'https://dre.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 120),
    lastActiveAt: nowMinus(120),
  },
  {
    id: 'client_4',
    companyName: 'مدرسة الفجر الذهبي',
    contactName: 'أ. منى الفارسي',
    email: 'admin@alfajr.sa',
    phone: '+966501112222',
    country: 'SA',
    industry: 'تعليم',
    status: 'trial',
    planId: null,
    subscriptionId: null,
    trialEndsAt: nowPlusDays(8),
    agentCount: 2,
    channelCount: 1,
    conversationCount: 47,
    mrr: 0,
    currency: 'SAR',
    username: 'admin@alfajr.sa',
    password: 'Tf#5jWk!7v',
    dashboardUrl: 'https://alfajr.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 6),
    lastActiveAt: nowMinus(60),
  },
  {
    id: 'client_5',
    companyName: 'عيادة الحياة الطبية',
    contactName: 'د. أحمد السعد',
    email: 'a.alsaad@hayat.sa',
    phone: '+966503334444',
    country: 'SA',
    industry: 'صحة',
    status: 'active',
    planId: 'plan_pro',
    subscriptionId: 'sub_5',
    agentCount: 6,
    channelCount: 2,
    conversationCount: 1203,
    mrr: 184,
    currency: 'SAR',
    username: 'a.alsaad@hayat.sa',
    password: 'Ft#3bNx!6s',
    dashboardUrl: 'https://hayat.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 200),
    lastActiveAt: nowMinus(15),
  },
  {
    id: 'client_6',
    companyName: 'TechFlow Egypt',
    contactName: 'Ahmed Mostafa',
    email: 'ahmed@techflow.eg',
    phone: '+201001234567',
    country: 'EG',
    industry: 'تقنية',
    status: 'past_due',
    planId: 'plan_starter',
    subscriptionId: 'sub_6',
    agentCount: 3,
    channelCount: 1,
    conversationCount: 234,
    mrr: 931,
    currency: 'EGP',
    username: 'ahmed@techflow.eg',
    password: 'Ra#8cDf!4p',
    dashboardUrl: 'https://techflow.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 45),
    lastActiveAt: nowMinus(60 * 24 * 3),
  },
  {
    id: 'client_7',
    companyName: 'الفجيرة للسياحة',
    contactName: 'علياء النعيمي',
    email: 'a.alnuaimi@fuj-tourism.ae',
    phone: '+971502223333',
    country: 'AE',
    industry: 'سياحة',
    status: 'active',
    planId: 'plan_pro',
    subscriptionId: 'sub_7',
    agentCount: 7,
    channelCount: 3,
    conversationCount: 1542,
    mrr: 180,
    currency: 'AED',
    username: 'a.alnuaimi@fuj-tourism.ae',
    password: 'Mr#2gKh!9n',
    dashboardUrl: 'https://fuj-tourism.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 150),
    lastActiveAt: nowMinus(45),
  },
  {
    id: 'client_8',
    companyName: 'Royal Auto Kuwait',
    contactName: 'عبدالعزيز السبيعي',
    email: 'a.alsubaie@royal-auto.kw',
    phone: '+965999888777',
    country: 'KW',
    industry: 'سيارات',
    status: 'active',
    planId: 'plan_enterprise',
    subscriptionId: 'sub_8',
    agentCount: 42,
    channelCount: 12,
    conversationCount: 8421,
    mrr: 77,
    currency: 'KWD',
    username: 'a.alsubaie@royal-auto.kw',
    password: 'Ql#7aZr!5j',
    dashboardUrl: 'https://royalauto.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 300),
    lastActiveAt: nowMinus(2),
  },
  {
    id: 'client_9',
    companyName: 'مكتبة المعرفة',
    contactName: 'يوسف الزدجالي',
    email: 'y.alzadjali@maarifa.om',
    phone: '+96893334444',
    country: 'OM',
    industry: 'تجزئة',
    status: 'suspended',
    planId: 'plan_starter',
    subscriptionId: 'sub_9',
    agentCount: 1,
    channelCount: 1,
    conversationCount: 89,
    mrr: 7,
    currency: 'OMR',
    username: 'y.alzadjali@maarifa.om',
    password: 'Lm#4wXb!8t',
    dashboardUrl: 'https://maarifa.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 30),
    lastActiveAt: nowMinus(60 * 24 * 10),
  },
  {
    id: 'client_10',
    companyName: 'Qatar Logistics Group',
    contactName: 'Hamad Al Thani',
    email: 'hamad@qlg.qa',
    phone: '+97455667788',
    country: 'QA',
    industry: 'لوجستيات',
    status: 'active',
    planId: 'plan_business',
    subscriptionId: 'sub_10',
    agentCount: 15,
    channelCount: 5,
    conversationCount: 3201,
    mrr: 360,
    currency: 'QAR',
    username: 'hamad@qlg.qa',
    password: 'Bk#6rPv!3m',
    dashboardUrl: 'https://qlg.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 80),
    lastActiveAt: nowMinus(8),
  },
  {
    id: 'client_11',
    companyName: 'صالون لمسة جمال',
    contactName: 'هدى الجابري',
    email: 'h.aljabri@lamsa.bh',
    phone: '+97333445566',
    country: 'BH',
    industry: 'تجميل',
    status: 'trial',
    planId: null,
    subscriptionId: null,
    trialEndsAt: nowPlusDays(3),
    agentCount: 2,
    channelCount: 1,
    conversationCount: 23,
    mrr: 0,
    currency: 'BHD',
    username: 'h.aljabri@lamsa.bh',
    password: 'Nb#9sHc!2k',
    dashboardUrl: 'https://lamsa.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 11),
    lastActiveAt: nowMinus(120),
  },
  {
    id: 'client_12',
    companyName: 'مزرعة البركة',
    contactName: 'محمد العنزي',
    email: 'm.alenezi@baraka.jo',
    phone: '+962777889900',
    country: 'JO',
    industry: 'زراعة',
    status: 'cancelled',
    planId: 'plan_starter',
    subscriptionId: 'sub_12',
    agentCount: 1,
    channelCount: 1,
    conversationCount: 12,
    mrr: 0,
    currency: 'JOD',
    username: 'm.alenezi@baraka.jo',
    password: 'Sm#5fQd!7w',
    dashboardUrl: 'https://baraka.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 100),
    lastActiveAt: nowMinus(60 * 24 * 60),
  },
  {
    id: 'client_13',
    companyName: 'متجر نبض الخليج',
    contactName: 'فاطمة الشمري',
    email: 'f.alshamri@nabd.sa',
    phone: '+966504445555',
    country: 'SA',
    industry: 'تجزئة',
    status: 'trial',
    planId: null,
    subscriptionId: null,
    trialEndsAt: nowPlusDays(5),
    agentCount: 3,
    channelCount: 1,
    conversationCount: 34,
    mrr: 0,
    currency: 'SAR',
    username: 'f.alshamri@nabd.sa',
    password: 'Kr#3yTn!6x',
    dashboardUrl: 'https://nabd.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 9),
    lastActiveAt: nowMinus(30),
  },
  {
    id: 'client_14',
    companyName: 'وكالة سما للتصميم',
    contactName: 'نورة القحطاني',
    email: 'n.alqahtani@sama.sa',
    phone: '+966505556666',
    country: 'SA',
    industry: 'تصميم',
    status: 'trial',
    planId: null,
    subscriptionId: null,
    trialEndsAt: nowPlusDays(1),
    agentCount: 2,
    channelCount: 1,
    conversationCount: 18,
    mrr: 0,
    currency: 'SAR',
    username: 'n.alqahtani@sama.sa',
    password: 'An#8eJg!4z',
    dashboardUrl: 'https://sama.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 13),
    lastActiveAt: nowMinus(60 * 3),
  },
  {
    id: 'client_15',
    companyName: 'مطعم بيت الكرم',
    contactName: 'عمر الحسيني',
    email: 'o.alhusseini@karam.jo',
    phone: '+962791234567',
    country: 'JO',
    industry: 'مطاعم',
    status: 'trial',
    planId: null,
    subscriptionId: null,
    trialEndsAt: nowPlusDays(6),
    agentCount: 1,
    channelCount: 1,
    conversationCount: 11,
    mrr: 0,
    currency: 'JOD',
    username: 'o.alhusseini@karam.jo',
    password: 'Sh#2mBf!9r',
    dashboardUrl: 'https://karam.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 8),
    lastActiveAt: nowMinus(60 * 5),
  },
  {
    id: 'client_16',
    companyName: 'شركة الأندلس للتجارة',
    contactName: 'خالد المنصوري',
    email: 'k.almansoori@andalus.ae',
    phone: '+971504445566',
    country: 'AE',
    industry: 'تجارة',
    status: 'past_due',
    planId: 'plan_pro',
    subscriptionId: 'sub_16',
    agentCount: 5,
    channelCount: 2,
    conversationCount: 876,
    mrr: 180,
    currency: 'AED',
    username: 'k.almansoori@andalus.ae',
    password: 'Nk#7pVs!5c',
    dashboardUrl: 'https://andalus.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 90),
    lastActiveAt: nowMinus(60 * 24 * 5),
  },
  {
    id: 'client_17',
    companyName: 'مركز الشفاء الطبي',
    contactName: 'د. سارة الكندي',
    email: 's.alkindi@shifa.om',
    phone: '+96895556677',
    country: 'OM',
    industry: 'صحة',
    status: 'past_due',
    planId: 'plan_business',
    subscriptionId: 'sub_17',
    agentCount: 12,
    channelCount: 4,
    conversationCount: 2103,
    mrr: 38,
    currency: 'OMR',
    username: 's.alkindi@shifa.om',
    password: 'Dre#4kLm!8w',
    dashboardUrl: 'https://shifa.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 60),
    lastActiveAt: nowMinus(60 * 24 * 2),
  },
  {
    id: 'client_18',
    companyName: 'أكاديمية النخبة',
    contactName: 'ياسر البلوشي',
    email: 'y.albalushi@nukhba.bh',
    phone: '+97334567890',
    country: 'BH',
    industry: 'تعليم',
    status: 'past_due',
    planId: 'plan_starter',
    subscriptionId: 'sub_18',
    agentCount: 2,
    channelCount: 1,
    conversationCount: 156,
    mrr: 8,
    currency: 'BHD',
    username: 'y.albalushi@nukhba.bh',
    password: 'Af#9nYp!3x',
    dashboardUrl: 'https://nukhba.dashboard.example.com',
    joinedAt: nowMinus(60 * 24 * 40),
    lastActiveAt: nowMinus(60 * 24 * 4),
  },
];

// =====================================================================
// Subscriptions
// =====================================================================
export const subscriptions: Subscription[] = clients
  .filter((c) => c.subscriptionId && c.planId)
  .map((c) => {
    const plan = plans.find((p) => p.id === c.planId)!;
    const price = plan.pricesPerCountry[c.country]?.monthly ?? 0;
    return {
      id: c.subscriptionId as string,
      clientId: c.id,
      planId: c.planId as string,
      status: c.status === 'past_due' ? 'past_due' : c.status === 'cancelled' ? 'cancelled' : c.status === 'suspended' ? 'past_due' : 'active',
      billingCycle: 'monthly' as const,
      amount: price,
      currency: c.currency,
      startedAt: c.joinedAt,
      currentPeriodStart: nowMinus(60 * 24 * 15),
      currentPeriodEnd: nowPlusDays(15),
      paymentMethod: { brand: 'visa', last4: String(1000 + ((c.id.charCodeAt(7) || 0) * 137) % 9000).padStart(4, '0').slice(-4), expMonth: 8, expYear: 28 },
    };
  });

// =====================================================================
// Invoices
// =====================================================================
function makeInvoice(client: Client, monthsAgo: number, status: Invoice['status']): Invoice {
  const plan = plans.find((p) => p.id === client.planId);
  const amount = plan?.pricesPerCountry[client.country]?.monthly ?? client.mrr;
  const tax = Math.round(amount * 0.05);
  const dueDate = new Date(Date.now() - (monthsAgo - 1) * 30 * 86400000).toISOString();
  return {
    id: `inv_${client.id}_${monthsAgo}`,
    number: `INV-2026-${String(parseInt(client.id.split('_')[1]) * 100 + monthsAgo).padStart(5, '0')}`,
    clientId: client.id,
    subscriptionId: client.subscriptionId ?? undefined,
    amount,
    tax,
    total: amount + tax,
    currency: client.currency,
    status,
    dueDate,
    paidAt: status === 'paid' ? new Date(Date.parse(dueDate) - 86400000).toISOString() : undefined,
    items: [{ description: `اشتراك ${plan?.nameAr ?? 'باقة'} — شهري`, quantity: 1, unitPrice: amount, total: amount }],
    createdAt: new Date(Date.parse(dueDate) - 7 * 86400000).toISOString(),
  };
}

export const invoices: Invoice[] = clients
  .filter((c) => c.planId)
  .flatMap((c) => {
    const list: Invoice[] = [];
    // 1 current pending or paid + 2-4 past paid
    const monthsHistory = Math.min(4, Math.floor((Date.now() - Date.parse(c.joinedAt)) / (30 * 86400000)));
    for (let m = monthsHistory; m > 0; m -= 1) {
      list.push(makeInvoice(c, m, c.status === 'past_due' && m === 1 ? 'failed' : 'paid'));
    }
    if (c.status !== 'cancelled') {
      list.push(makeInvoice(c, 0, c.status === 'past_due' ? 'failed' : c.status === 'suspended' ? 'failed' : 'paid'));
    }
    return list;
  });

// =====================================================================
// Transactions
// =====================================================================
export const transactions: Transaction[] = invoices.flatMap<Transaction>((inv) => {
  const client = clients.find((c) => c.id === inv.clientId);
  if (!client) return [];
  if (inv.status === 'paid') {
    const txn: Transaction = {
      id: `txn_${inv.id}`,
      invoiceId: inv.id,
      clientId: inv.clientId,
      amount: inv.total,
      currency: inv.currency,
      status: 'succeeded',
      method: 'visa',
      last4: String(1000 + ((client.id.charCodeAt(7) || 0) * 137) % 9000).padStart(4, '0').slice(-4),
      paymobOrderId: `pmb_ord_${Math.random().toString(36).slice(2, 10)}`,
      paymobTransactionId: `pmb_txn_${Math.random().toString(36).slice(2, 12)}`,
      createdAt: inv.paidAt ?? inv.createdAt,
    };
    return [txn];
  }
  if (inv.status === 'failed') {
    const txn: Transaction = {
      id: `txn_${inv.id}_failed`,
      invoiceId: inv.id,
      clientId: inv.clientId,
      amount: inv.total,
      currency: inv.currency,
      status: 'failed',
      method: 'visa',
      last4: '4242',
      paymobOrderId: `pmb_ord_${Math.random().toString(36).slice(2, 10)}`,
      paymobTransactionId: `pmb_txn_${Math.random().toString(36).slice(2, 12)}`,
      failureReason: 'Insufficient funds',
      createdAt: inv.createdAt,
    };
    return [txn];
  }
  return [];
});

// =====================================================================
// Paymob Config
// =====================================================================
export const paymobConfig: PaymobConfig = {
  enabled: true,
  testMode: true,
  apiKey: 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5...',
  publicKey: 'egy_pk_test_8f3a2bd4c5e9...',
  hmacSecret: 'EXAMPLE_HMAC_SECRET_REPLACE_ME',
  iframeId: '847921',
  integrationCardId: '4537823',
  webhookUrl: 'https://chat-admin.apexes.click/api/paymob/webhook',
  integrationsByCountry: {
    EG: '4537823',
    SA: '4537824',
    AE: '4537825',
    OM: '4537826',
    KW: '4537827',
    QA: '4537828',
    BH: '4537829',
    JO: '4537830',
  },
};

// =====================================================================
// Admin Users
// =====================================================================
export const adminUsers: AdminUser[] = [
  { id: 'au_1', name: 'محمد الكندي', email: 'admin@apexes.click', role: 'super_admin', active: true, lastActive: nowMinus(2), createdAt: nowMinus(60 * 24 * 365) },
  { id: 'au_2', name: 'Sara Ahmed', email: 'sara@apexes.click', role: 'admin', active: true, lastActive: nowMinus(30), createdAt: nowMinus(60 * 24 * 180) },
  { id: 'au_3', name: 'علي السالم', email: 'ali@apexes.click', role: 'support', active: true, lastActive: nowMinus(120), createdAt: nowMinus(60 * 24 * 60) },
  { id: 'au_4', name: 'Layla Khalid', email: 'layla@apexes.click', role: 'finance', active: true, lastActive: nowMinus(60 * 24), createdAt: nowMinus(60 * 24 * 30) },
];

// =====================================================================
// Platform Statistics
// =====================================================================
export const platformStats = {
  totalConversations: 18_457,
  activeConversations: 1_234,
  totalMessages: 156_890,
  avgResponseTime: 3.2, // minutes
  totalChannels: 42,
  channelDistribution: {
    whatsapp: 28,
    messenger: 6,
    instagram: 4,
    telegram: 2,
    widget: 1,
    email: 1,
  },
  totalAgents: 106,
  onlineAgents: 43,
};

// =====================================================================
// Campaign Statistics
// =====================================================================
export const campaignStats = {
  totalCampaigns: 87,
  activeCampaigns: 12,
  completedCampaigns: 68,
  failedCampaigns: 7,
  totalMessagesSent: 45_230,
  avgOpenRate: 72.4,
  avgClickRate: 18.6,
  // Monthly campaign data (last 6 months)
  monthlyCampaigns: [
    { month: 'ديسمبر', sent: 5200, delivered: 4800, opened: 3400 },
    { month: 'يناير', sent: 6100, delivered: 5700, opened: 4200 },
    { month: 'فبراير', sent: 7400, delivered: 6900, opened: 5100 },
    { month: 'مارس', sent: 8200, delivered: 7600, opened: 5800 },
    { month: 'أبريل', sent: 9100, delivered: 8500, opened: 6400 },
    { month: 'مايو', sent: 9800, delivered: 9200, opened: 7100 },
  ],
};

// =====================================================================
// Customer Satisfaction
// =====================================================================
export const satisfactionStats = {
  avgRating: 4.3, // out of 5
  totalRatings: 3_421,
  distribution: {
    5: 1_450,
    4: 980,
    3: 520,
    2: 280,
    1: 191,
  },
  // By client (top clients by rating count)
  byClient: [
    { clientId: 'client_8', avgRating: 4.7, ratingCount: 842 },
    { clientId: 'client_3', avgRating: 4.5, ratingCount: 634 },
    { clientId: 'client_10', avgRating: 4.4, ratingCount: 521 },
    { clientId: 'client_1', avgRating: 4.2, ratingCount: 412 },
    { clientId: 'client_5', avgRating: 4.1, ratingCount: 389 },
    { clientId: 'client_7', avgRating: 3.9, ratingCount: 298 },
    { clientId: 'client_2', avgRating: 3.8, ratingCount: 215 },
  ],
  // Monthly trend
  monthlyTrend: [
    { month: 'ديسمبر', avg: 4.0 },
    { month: 'يناير', avg: 4.1 },
    { month: 'فبراير', avg: 4.2 },
    { month: 'مارس', avg: 4.1 },
    { month: 'أبريل', avg: 4.3 },
    { month: 'مايو', avg: 4.3 },
  ],
};

// =====================================================================
// Activity Log
// =====================================================================
export type ActivityAction =
  | 'client_created'
  | 'client_suspended'
  | 'client_reactivated'
  | 'client_deleted'
  | 'plan_created'
  | 'plan_updated'
  | 'plan_deleted'
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'invoice_refunded'
  | 'payment_received'
  | 'admin_login'
  | 'admin_logout'
  | 'admin_user_added'
  | 'admin_user_removed'
  | 'settings_updated'
  | 'paymob_updated';

export interface ActivityEntry {
  id: string;
  action: ActivityAction;
  actor: string;
  actorEmail: string;
  target?: string;
  details?: string;
  timestamp: string;
  ip?: string;
}

export const activityLog: ActivityEntry[] = [
  { id: 'act_1', action: 'admin_login', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', timestamp: nowMinus(2), ip: '185.69.144.12' },
  { id: 'act_2', action: 'client_created', actor: 'Sara Ahmed', actorEmail: 'sara@apexes.click', target: 'صالون لمسة جمال', details: 'تسجيل عميل جديد — البحرين', timestamp: nowMinus(15) },
  { id: 'act_3', action: 'payment_received', actor: 'النظام', actorEmail: 'system', target: 'Royal Auto Kuwait', details: '77 د.ك — باقة المؤسسات', timestamp: nowMinus(45) },
  { id: 'act_4', action: 'subscription_created', actor: 'Sara Ahmed', actorEmail: 'sara@apexes.click', target: 'عيادة الحياة الطبية', details: 'باقة الاحترافي — شهري', timestamp: nowMinus(90) },
  { id: 'act_5', action: 'client_suspended', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', target: 'مكتبة المعرفة', details: 'دفع متأخر 10 أيام', timestamp: nowMinus(180) },
  { id: 'act_6', action: 'invoice_refunded', actor: 'Layla Khalid', actorEmail: 'layla@apexes.click', target: 'TechFlow Egypt', details: '978 ج.م — فاتورة INV-2026-00601', timestamp: nowMinus(300) },
  { id: 'act_7', action: 'plan_updated', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', target: 'الاحترافي', details: 'تحديث حدود المحادثات: 5,000 → 10,000', timestamp: nowMinus(420) },
  { id: 'act_8', action: 'admin_user_added', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', target: 'Layla Khalid', details: 'دور: مالية', timestamp: nowMinus(600) },
  { id: 'act_9', action: 'paymob_updated', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', details: 'تحديث مفتاح API وتفعيل الوضع الحي', timestamp: nowMinus(720) },
  { id: 'act_10', action: 'settings_updated', actor: 'Sara Ahmed', actorEmail: 'sara@apexes.click', details: 'تحديث بيانات الدعم الفني', timestamp: nowMinus(960) },
  { id: 'act_11', action: 'client_reactivated', actor: 'علي السالم', actorEmail: 'ali@apexes.click', target: 'مزرعة البركة', details: 'تم استلام الدفعة المتأخرة', timestamp: nowMinus(1200) },
  { id: 'act_12', action: 'admin_login', actor: 'Sara Ahmed', actorEmail: 'sara@apexes.click', timestamp: nowMinus(1440), ip: '91.74.32.55' },
  { id: 'act_13', action: 'payment_received', actor: 'النظام', actorEmail: 'system', target: 'Dubai Real Estate Co.', details: '363 د.إ — باقة الأعمال', timestamp: nowMinus(1500) },
  { id: 'act_14', action: 'client_created', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', target: 'مدرسة الفجر الذهبي', details: 'تسجيل عميل جديد — السعودية', timestamp: nowMinus(1800) },
  { id: 'act_15', action: 'subscription_cancelled', actor: 'النظام', actorEmail: 'system', target: 'مزرعة البركة', details: 'إلغاء تلقائي — عدم الدفع', timestamp: nowMinus(2400) },
  { id: 'act_16', action: 'admin_login', actor: 'علي السالم', actorEmail: 'ali@apexes.click', timestamp: nowMinus(2880), ip: '185.69.144.15' },
  { id: 'act_17', action: 'plan_created', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', target: 'المؤسسات', details: 'باقة جديدة — $249/شهر', timestamp: nowMinus(3600) },
  { id: 'act_18', action: 'client_deleted', actor: 'محمد الكندي', actorEmail: 'admin@apexes.click', target: 'شركة تجريبية', details: 'حذف حساب تجريبي منتهي', timestamp: nowMinus(4320) },
  { id: 'act_19', action: 'admin_logout', actor: 'Layla Khalid', actorEmail: 'layla@apexes.click', timestamp: nowMinus(5000) },
  { id: 'act_20', action: 'payment_received', actor: 'النظام', actorEmail: 'system', target: 'Qatar Logistics Group', details: '360 ر.ق — باقة الأعمال', timestamp: nowMinus(5760) },
];

// =====================================================================
// Feedback & Complaints
// =====================================================================
export type FeedbackType = 'complaint' | 'suggestion';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved';
export type FeedbackPriority = 'low' | 'medium' | 'high';

export interface FeedbackReply {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface FeedbackEntry {
  id: string;
  clientId: string;
  clientName: string;
  type: FeedbackType;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  subject: string;
  message: string;
  replies?: FeedbackReply[];
  /** @deprecated Use replies array instead */
  reply?: string;
  /** @deprecated Use replies array instead */
  repliedBy?: string;
  /** @deprecated Use replies array instead */
  repliedAt?: string;
  rating?: number;
  timestamp: string;
}

export const feedbackEntries: FeedbackEntry[] = [
  {
    id: 'fb_1',
    clientId: 'client_8',
    clientName: 'Royal Auto Kuwait',
    type: 'complaint',
    status: 'open',
    priority: 'high',
    subject: 'توقف الواتساب عن الاستقبال',
    message: 'منذ أمس الرسائل الواردة لا تصل للوحة. الرقم الأساسي +965999888777 متوقف عن استقبال المحادثات الجديدة. نرجو الحل العاجل لأننا نخسر عملاء.',
    replies: [],
    timestamp: nowMinus(25),
  },
  {
    id: 'fb_2',
    clientId: 'client_3',
    clientName: 'Dubai Real Estate Co.',
    type: 'suggestion',
    status: 'open',
    priority: 'medium',
    subject: 'إضافة تكامل مع Zoho CRM',
    message: 'نستخدم Zoho CRM في إدارة العملاء. هل يمكن إضافة تكامل مباشر لمزامنة جهات الاتصال والمحادثات تلقائياً؟ سيوفر علينا وقت كبير.',
    replies: [],
    timestamp: nowMinus(180),
  },
  {
    id: 'fb_3',
    clientId: 'client_5',
    clientName: 'عيادة الحياة الطبية',
    type: 'complaint',
    status: 'in_progress',
    priority: 'high',
    subject: 'مشكلة في إرسال الحملات',
    message: 'عند إرسال حملة لأكثر من 500 جهة اتصال، يتوقف الإرسال عند 200 رسالة تقريباً ويظهر خطأ "Rate limit exceeded". المشكلة متكررة من أسبوع.',
    replies: [{ id: 'fr_3_1', text: 'نعتذر عن الإزعاج. تم تحديد المشكلة وهي متعلقة بحد الإرسال من WhatsApp API. نعمل على تعديل آلية الإرسال بدفعات متتالية.', author: 'علي السالم', timestamp: nowMinus(120) }],
    reply: 'نعتذر عن الإزعاج. تم تحديد المشكلة وهي متعلقة بحد الإرسال من WhatsApp API. نعمل على تعديل آلية الإرسال بدفعات متتالية.',
    repliedBy: 'علي السالم',
    repliedAt: nowMinus(120),
    timestamp: nowMinus(360),
  },
  {
    id: 'fb_4',
    clientId: 'client_1',
    clientName: 'Qhub',
    type: 'suggestion',
    status: 'resolved',
    priority: 'low',
    subject: 'تقارير PDF قابلة للتخصيص',
    message: 'نتمنى إمكانية تصدير تقارير PDF بشعار الشركة وألوانها بدلاً من التنسيق الافتراضي.',
    replies: [{ id: 'fr_4_1', text: 'شكراً لاقتراحك! تم إضافة الميزة في التحديث الأخير. يمكنك الآن تخصيص شعار وألوان التقارير من الإعدادات.', author: 'Sara Ahmed', timestamp: nowMinus(1440) }],
    reply: 'شكراً لاقتراحك! تم إضافة الميزة في التحديث الأخير. يمكنك الآن تخصيص شعار وألوان التقارير من الإعدادات.',
    repliedBy: 'Sara Ahmed',
    repliedAt: nowMinus(1440),
    timestamp: nowMinus(2880),
  },
  {
    id: 'fb_5',
    clientId: 'client_10',
    clientName: 'Qatar Logistics Group',
    type: 'complaint',
    status: 'open',
    priority: 'high',
    subject: 'الإشعارات لا تصل للموظفين الجدد',
    message: 'أضفنا 3 موظفين جدد الأسبوع الماضي ولكنهم لا يتلقون إشعارات المحادثات الجديدة. حاولنا إعادة تسجيل الدخول ولم تحل المشكلة.',
    replies: [],
    timestamp: nowMinus(480),
  },
  {
    id: 'fb_6',
    clientId: 'client_7',
    clientName: 'الفجيرة للسياحة',
    type: 'suggestion',
    status: 'resolved',
    priority: 'low',
    subject: 'شكراً على التحديث الأخير',
    message: 'ميزة الردود الذكية بالذكاء الاصطناعي ممتازة! وفرت على فريقنا وقت كبير. استمروا بالتطوير 👏',
    replies: [{ id: 'fr_6_1', text: 'شكراً لكلماتك الجميلة! يسعدنا أن الميزة مفيدة لفريقكم. سنستمر بالتطوير إن شاء الله.', author: 'محمد الكندي', timestamp: nowMinus(4000) }],
    reply: 'شكراً لكلماتك الجميلة! يسعدنا أن الميزة مفيدة لفريقكم. سنستمر بالتطوير إن شاء الله.',
    repliedBy: 'محمد الكندي',
    repliedAt: nowMinus(4000),
    rating: 5,
    timestamp: nowMinus(4320),
  },
  {
    id: 'fb_7',
    clientId: 'client_2',
    clientName: 'مطعم البيت العماني',
    type: 'complaint',
    status: 'resolved',
    priority: 'medium',
    subject: 'بطء في تحميل المحادثات',
    message: 'لوحة التحكم أصبحت بطيئة جداً عند فتح المحادثات، خصوصاً المحادثات التي فيها صور. الانتظار يصل لـ 10 ثواني أحياناً.',
    replies: [{ id: 'fr_7_1', text: 'تم تحسين أداء تحميل المحادثات والوسائط في التحديث v2.4.1. يرجى تحديث الصفحة والتأكد.', author: 'علي السالم', timestamp: nowMinus(5000) }],
    reply: 'تم تحسين أداء تحميل المحادثات والوسائط في التحديث v2.4.1. يرجى تحديث الصفحة والتأكد.',
    repliedBy: 'علي السالم',
    repliedAt: nowMinus(5000),
    timestamp: nowMinus(5760),
  },
  {
    id: 'fb_8',
    clientId: 'client_6',
    clientName: 'TechFlow Egypt',
    type: 'suggestion',
    status: 'open',
    priority: 'medium',
    subject: 'دعم اللغة الإنجليزية بالكامل',
    message: 'فريقنا مختلط عربي وأجنبي. نحتاج واجهة إنجليزية كاملة حتى يتمكن الموظفين الأجانب من استخدام النظام.',
    replies: [],
    timestamp: nowMinus(7200),
  },
  {
    id: 'fb_9',
    clientId: 'client_3',
    clientName: 'Dubai Real Estate Co.',
    type: 'complaint',
    status: 'in_progress',
    priority: 'medium',
    subject: 'خطأ في احتساب الإحصائيات',
    message: 'إحصائيات الشهر الحالي تُظهر عدد محادثات أقل من الفعلي. الفرق تقريباً 15-20%. لاحظنا المشكلة بعد التحديث الأخير.',
    replies: [{ id: 'fr_9_1', text: 'تم رصد المشكلة وهي متعلقة بتوقيت المنطقة الزمنية. جاري العمل على الإصلاح.', author: 'Sara Ahmed', timestamp: nowMinus(6000) }],
    reply: 'تم رصد المشكلة وهي متعلقة بتوقيت المنطقة الزمنية. جاري العمل على الإصلاح.',
    repliedBy: 'Sara Ahmed',
    repliedAt: nowMinus(6000),
    timestamp: nowMinus(8640),
  },
  {
    id: 'fb_10',
    clientId: 'client_11',
    clientName: 'صالون لمسة جمال',
    type: 'suggestion',
    status: 'open',
    priority: 'low',
    subject: 'قوالب جاهزة للصالونات',
    message: 'نتمنى توفير قوالب رسائل جاهزة خاصة بقطاع الصالونات والتجميل (حجز موعد، تأكيد موعد، تذكير، عرض خاص).',
    replies: [],
    timestamp: nowMinus(10080),
  },
  {
    id: 'fb_11',
    clientId: 'client_8',
    clientName: 'Royal Auto Kuwait',
    type: 'suggestion',
    status: 'resolved',
    priority: 'high',
    subject: 'API للربط مع نظام المبيعات',
    message: 'نحتاج API endpoint لسحب بيانات المحادثات وجهات الاتصال برمجياً للربط مع نظام ERP الداخلي.',
    replies: [{ id: 'fr_11_1', text: 'تم توفير API كامل مع التوثيق. يمكنكم الوصول من خلال إعدادات > مفاتيح API.', author: 'محمد الكندي', timestamp: nowMinus(11000) }],
    reply: 'تم توفير API كامل مع التوثيق. يمكنكم الوصول من خلال إعدادات > مفاتيح API.',
    repliedBy: 'محمد الكندي',
    repliedAt: nowMinus(11000),
    timestamp: nowMinus(11520),
  },
  {
    id: 'fb_12',
    clientId: 'client_5',
    clientName: 'عيادة الحياة الطبية',
    type: 'suggestion',
    status: 'resolved',
    priority: 'low',
    subject: 'الدعم الفني ممتاز',
    message: 'أحب أشكر فريق الدعم على سرعة الاستجابة. كل مرة أتواصل يتم حل المشكلة خلال ساعة. خدمة 5 نجوم!',
    replies: [],
    rating: 5,
    timestamp: nowMinus(14400),
  },
];

// =====================================================================
// Live Chat Conversations
// =====================================================================
export const liveChatConversations: LiveChatConversation[] = [
  {
    id: 'lc_1',
    visitorName: 'أحمد الحارثي',
    visitorEmail: 'ahmed.h@gmail.com',
    clientId: 'client_1',
    status: 'open',
    channel: 'widget',
    messages: [
      { id: 'lm_1_1', conversationId: 'lc_1', sender: 'visitor', senderName: 'أحمد الحارثي', content: 'السلام عليكم، أحتاج مساعدة في إعداد الويدجت على موقعي', timestamp: nowMinus(12) },
      { id: 'lm_1_2', conversationId: 'lc_1', sender: 'visitor', senderName: 'أحمد الحارثي', content: 'جربت أضيف الكود لكن ما يظهر عندي', timestamp: nowMinus(10) },
      { id: 'lm_1_3', conversationId: 'lc_1', sender: 'agent', senderName: 'علي السالم', content: 'وعليكم السلام أحمد، أهلاً بك! هل يمكنك إرسال رابط موقعك حتى أتحقق من المشكلة؟', timestamp: nowMinus(8) },
      { id: 'lm_1_4', conversationId: 'lc_1', sender: 'visitor', senderName: 'أحمد الحارثي', content: 'الموقع هو www.alharthy-store.com', timestamp: nowMinus(5) },
    ],
    startedAt: nowMinus(12),
    lastMessageAt: nowMinus(5),
  },
  {
    id: 'lc_2',
    visitorName: 'سارة المنذري',
    visitorEmail: 'sara.m@outlook.com',
    clientId: 'client_2',
    status: 'assigned',
    assignedTo: 'Sara Ahmed',
    channel: 'widget',
    messages: [
      { id: 'lm_2_1', conversationId: 'lc_2', sender: 'visitor', senderName: 'سارة المنذري', content: 'مرحباً، هل يمكنني تغيير لون الويدجت؟', timestamp: nowMinus(45) },
      { id: 'lm_2_2', conversationId: 'lc_2', sender: 'agent', senderName: 'Sara Ahmed', content: 'أهلاً سارة! نعم بالتأكيد، يمكنك تغيير اللون من إعدادات الويدجت في لوحة التحكم', timestamp: nowMinus(42) },
      { id: 'lm_2_3', conversationId: 'lc_2', sender: 'visitor', senderName: 'سارة المنذري', content: 'ممتاز، وهل أقدر أغير رسالة الترحيب أيضاً؟', timestamp: nowMinus(40) },
      { id: 'lm_2_4', conversationId: 'lc_2', sender: 'agent', senderName: 'Sara Ahmed', content: 'نعم، من نفس الصفحة يمكنك تعديل رسالة الترحيب واسم الفريق ووقت الاستجابة المتوقع', timestamp: nowMinus(38) },
      { id: 'lm_2_5', conversationId: 'lc_2', sender: 'visitor', senderName: 'سارة المنذري', content: 'شكراً جزيلاً لكم!', timestamp: nowMinus(35) },
    ],
    startedAt: nowMinus(45),
    lastMessageAt: nowMinus(35),
  },
  {
    id: 'lc_3',
    visitorName: 'خالد البلوشي',
    clientId: 'client_3',
    status: 'open',
    channel: 'whatsapp',
    messages: [
      { id: 'lm_3_1', conversationId: 'lc_3', sender: 'visitor', senderName: 'خالد البلوشي', content: 'أريد الاستفسار عن أسعار الباقات', timestamp: nowMinus(3) },
      { id: 'lm_3_2', conversationId: 'lc_3', sender: 'visitor', senderName: 'خالد البلوشي', content: 'هل عندكم باقة مناسبة لشركة عقارية صغيرة؟', timestamp: nowMinus(2) },
    ],
    startedAt: nowMinus(3),
    lastMessageAt: nowMinus(2),
  },
  {
    id: 'lc_4',
    visitorName: 'فاطمة الرئيسي',
    visitorEmail: 'fatma.r@yahoo.com',
    clientId: 'client_1',
    status: 'resolved',
    assignedTo: 'علي السالم',
    channel: 'widget',
    messages: [
      { id: 'lm_4_1', conversationId: 'lc_4', sender: 'visitor', senderName: 'فاطمة الرئيسي', content: 'مشكلة في الإشعارات، ما توصلني رسائل الزوار', timestamp: nowMinus(120) },
      { id: 'lm_4_2', conversationId: 'lc_4', sender: 'agent', senderName: 'علي السالم', content: 'أهلاً فاطمة، هل فعّلتِ الإشعارات من إعدادات المتصفح؟', timestamp: nowMinus(115) },
      { id: 'lm_4_3', conversationId: 'lc_4', sender: 'visitor', senderName: 'فاطمة الرئيسي', content: 'لا، ما انتبهت لهذا الشيء', timestamp: nowMinus(112) },
      { id: 'lm_4_4', conversationId: 'lc_4', sender: 'agent', senderName: 'علي السالم', content: 'تفضلي، اضغطي على أيقونة القفل في شريط العنوان واسمحي بالإشعارات. بعدها أعيدي تحميل الصفحة', timestamp: nowMinus(110) },
      { id: 'lm_4_5', conversationId: 'lc_4', sender: 'visitor', senderName: 'فاطمة الرئيسي', content: 'تمام اشتغلت! شكراً', timestamp: nowMinus(105) },
    ],
    startedAt: nowMinus(120),
    lastMessageAt: nowMinus(105),
  },
  {
    id: 'lc_5',
    visitorName: 'محمد العامري',
    visitorEmail: 'moh.ameri@gmail.com',
    clientId: 'client_5',
    status: 'assigned',
    assignedTo: 'علي السالم',
    channel: 'widget',
    messages: [
      { id: 'lm_5_1', conversationId: 'lc_5', sender: 'visitor', senderName: 'محمد العامري', content: 'هل يدعم النظام إرسال الملفات في المحادثة؟', timestamp: nowMinus(60) },
      { id: 'lm_5_2', conversationId: 'lc_5', sender: 'agent', senderName: 'علي السالم', content: 'نعم محمد، يمكنك إرسال صور ومستندات PDF وملفات صوتية', timestamp: nowMinus(55) },
      { id: 'lm_5_3', conversationId: 'lc_5', sender: 'visitor', senderName: 'محمد العامري', content: 'ممتاز! وما الحد الأقصى لحجم الملف؟', timestamp: nowMinus(50) },
    ],
    startedAt: nowMinus(60),
    lastMessageAt: nowMinus(50),
  },
  {
    id: 'lc_6',
    visitorName: 'نورة الكعبي',
    clientId: 'client_7',
    status: 'resolved',
    assignedTo: 'Sara Ahmed',
    channel: 'widget',
    messages: [
      { id: 'lm_6_1', conversationId: 'lc_6', sender: 'visitor', senderName: 'نورة الكعبي', content: 'أبغي أسأل عن طريقة ربط حساب الإنستغرام', timestamp: nowMinus(1440) },
      { id: 'lm_6_2', conversationId: 'lc_6', sender: 'agent', senderName: 'Sara Ahmed', content: 'أهلاً نورة! من قائمة القنوات اختاري إضافة قناة جديدة ثم Instagram وسجلي الدخول بحسابك', timestamp: nowMinus(1435) },
      { id: 'lm_6_3', conversationId: 'lc_6', sender: 'visitor', senderName: 'نورة الكعبي', content: 'تم بنجاح، شكراً لكم', timestamp: nowMinus(1430) },
    ],
    startedAt: nowMinus(1440),
    lastMessageAt: nowMinus(1430),
  },
  {
    id: 'lc_7',
    visitorName: 'يوسف الهاشمي',
    visitorEmail: 'yousuf.h@hotmail.com',
    clientId: 'client_8',
    status: 'open',
    channel: 'whatsapp',
    messages: [
      { id: 'lm_7_1', conversationId: 'lc_7', sender: 'visitor', senderName: 'يوسف الهاشمي', content: 'مساء الخير، عندي مشكلة في تصدير التقارير', timestamp: nowMinus(8) },
      { id: 'lm_7_2', conversationId: 'lc_7', sender: 'visitor', senderName: 'يوسف الهاشمي', content: 'كل ما أضغط تصدير يطلع لي خطأ', timestamp: nowMinus(6) },
      { id: 'lm_7_3', conversationId: 'lc_7', sender: 'agent', senderName: 'محمد الكندي', content: 'مساء النور يوسف. هل يمكنك إرسال لقطة شاشة للخطأ؟', timestamp: nowMinus(4) },
    ],
    startedAt: nowMinus(8),
    lastMessageAt: nowMinus(4),
  },
  {
    id: 'lc_8',
    visitorName: 'عائشة السيابي',
    visitorEmail: 'aisha.s@gmail.com',
    clientId: 'client_10',
    status: 'resolved',
    assignedTo: 'محمد الكندي',
    channel: 'widget',
    messages: [
      { id: 'lm_8_1', conversationId: 'lc_8', sender: 'visitor', senderName: 'عائشة السيابي', content: 'هل يمكنني إضافة أكثر من رقم واتساب؟', timestamp: nowMinus(240) },
      { id: 'lm_8_2', conversationId: 'lc_8', sender: 'agent', senderName: 'محمد الكندي', content: 'نعم عائشة، حسب باقتك يمكنك إضافة عدة أرقام. باقة الأعمال تسمح بـ 10 قنوات', timestamp: nowMinus(235) },
      { id: 'lm_8_3', conversationId: 'lc_8', sender: 'visitor', senderName: 'عائشة السيابي', content: 'حلو! وكيف أضيف الرقم الجديد؟', timestamp: nowMinus(230) },
      { id: 'lm_8_4', conversationId: 'lc_8', sender: 'agent', senderName: 'محمد الكندي', content: 'من لوحة التحكم > القنوات > إضافة قناة > WhatsApp ثم أدخلي الرقم الجديد وأكملي خطوات التحقق', timestamp: nowMinus(225) },
    ],
    startedAt: nowMinus(240),
    lastMessageAt: nowMinus(225),
  },
  {
    id: 'lc_9',
    visitorName: 'سلطان الراشدي',
    clientId: 'client_2',
    status: 'open',
    channel: 'widget',
    messages: [
      { id: 'lm_9_1', conversationId: 'lc_9', sender: 'visitor', senderName: 'سلطان الراشدي', content: 'هل تدعمون الدفع بالتحويل البنكي؟', timestamp: nowMinus(1) },
    ],
    startedAt: nowMinus(1),
    lastMessageAt: nowMinus(1),
  },
  {
    id: 'lc_10',
    visitorName: 'مريم الزعابي',
    visitorEmail: 'mariam.z@live.com',
    clientId: 'client_3',
    status: 'assigned',
    assignedTo: 'محمد الكندي',
    channel: 'widget',
    messages: [
      { id: 'lm_10_1', conversationId: 'lc_10', sender: 'visitor', senderName: 'مريم الزعابي', content: 'مرحباً، أحتاج مساعدة في إعداد الردود التلقائية', timestamp: nowMinus(25) },
      { id: 'lm_10_2', conversationId: 'lc_10', sender: 'agent', senderName: 'محمد الكندي', content: 'أهلاً مريم! من إعدادات المحادثات يمكنك إضافة ردود تلقائية لخارج أوقات العمل ورسائل الترحيب', timestamp: nowMinus(22) },
      { id: 'lm_10_3', conversationId: 'lc_10', sender: 'visitor', senderName: 'مريم الزعابي', content: 'وهل أقدر أحدد أوقات العمل لكل يوم؟', timestamp: nowMinus(20) },
    ],
    startedAt: nowMinus(25),
    lastMessageAt: nowMinus(20),
  },
];

// =====================================================================
// Knowledge Base — Categories & Articles
// =====================================================================
export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'kc_1', name: 'البدء السريع', slug: 'getting-started', articleCount: 3, order: 1 },
  { id: 'kc_2', name: 'القنوات', slug: 'channels', articleCount: 2, order: 2 },
  { id: 'kc_3', name: 'الفوترة والاشتراكات', slug: 'billing', articleCount: 2, order: 3 },
  { id: 'kc_4', name: 'الفريق والأدوار', slug: 'team-roles', articleCount: 2, order: 4 },
  { id: 'kc_5', name: 'API والتكامل', slug: 'api-integration', articleCount: 2, order: 5 },
];

export const knowledgeArticles: Array<Omit<KnowledgeArticle, 'slug' | 'sortOrder' | 'metaTitle' | 'metaDescription'>> = [
  {
    id: 'ka_1',
    title: 'كيف أبدأ باستخدام Qhub؟',
    content: 'مرحباً بك في Qhub! في هذا الدليل سنشرح لك خطوات إعداد حسابك وبدء استقبال المحادثات من عملائك عبر قنوات التواصل المختلفة.',
    categoryId: 'kc_1',
    status: 'published',
    views: 1245,
    helpful: 89,
    notHelpful: 5,
    createdAt: nowMinus(60 * 24 * 90),
    updatedAt: nowMinus(60 * 24 * 10),
  },
  {
    id: 'ka_2',
    title: 'إعداد لوحة التحكم لأول مرة',
    content: 'بعد تسجيل الدخول لأول مرة، ستحتاج لإعداد بعض الإعدادات الأساسية مثل معلومات الشركة، المنطقة الزمنية، ولغة الواجهة.',
    categoryId: 'kc_1',
    status: 'published',
    views: 870,
    helpful: 62,
    notHelpful: 8,
    createdAt: nowMinus(60 * 24 * 85),
    updatedAt: nowMinus(60 * 24 * 15),
  },
  {
    id: 'ka_3',
    title: 'الأسئلة الشائعة للمستخدمين الجدد',
    content: 'مجموعة من الأسئلة الشائعة التي يطرحها المستخدمون الجدد حول كيفية استخدام المنصة وإعداد القنوات.',
    categoryId: 'kc_1',
    status: 'draft',
    views: 320,
    helpful: 15,
    notHelpful: 3,
    createdAt: nowMinus(60 * 24 * 20),
    updatedAt: nowMinus(60 * 24 * 5),
  },
  {
    id: 'ka_4',
    title: 'ربط WhatsApp Business API',
    content: 'تعلّم كيفية ربط رقم WhatsApp Business API بمنصة Qhub لاستقبال وإرسال الرسائل مباشرة من لوحة التحكم.',
    categoryId: 'kc_2',
    status: 'published',
    views: 2150,
    helpful: 156,
    notHelpful: 12,
    createdAt: nowMinus(60 * 24 * 80),
    updatedAt: nowMinus(60 * 24 * 3),
  },
  {
    id: 'ka_5',
    title: 'إعداد قنوات التواصل',
    content: 'شرح تفصيلي لإعداد جميع قنوات التواصل المدعومة: Messenger, Instagram, Telegram وغيرها.',
    categoryId: 'kc_2',
    status: 'published',
    views: 1580,
    helpful: 110,
    notHelpful: 9,
    createdAt: nowMinus(60 * 24 * 70),
    updatedAt: nowMinus(60 * 24 * 7),
  },
  {
    id: 'ka_6',
    title: 'إدارة الفواتير والمدفوعات',
    content: 'كل ما تحتاج معرفته حول إدارة الفواتير، طرق الدفع المتاحة، وكيفية تحديث بيانات البطاقة.',
    categoryId: 'kc_3',
    status: 'published',
    views: 645,
    helpful: 42,
    notHelpful: 6,
    createdAt: nowMinus(60 * 24 * 60),
    updatedAt: nowMinus(60 * 24 * 12),
  },
  {
    id: 'ka_7',
    title: 'ترقية أو تغيير باقة الاشتراك',
    content: 'خطوات ترقية باقتك الحالية أو التغيير بين الباقات المتاحة مع شرح الفروقات بين كل باقة.',
    categoryId: 'kc_3',
    status: 'published',
    views: 430,
    helpful: 28,
    notHelpful: 4,
    createdAt: nowMinus(60 * 24 * 55),
    updatedAt: nowMinus(60 * 24 * 8),
  },
  {
    id: 'ka_8',
    title: 'إضافة أعضاء الفريق وتعيين الأدوار',
    content: 'تعرّف على كيفية دعوة أعضاء جدد لفريقك وتعيين الأدوار والصلاحيات المناسبة لكل عضو.',
    categoryId: 'kc_4',
    status: 'published',
    views: 920,
    helpful: 71,
    notHelpful: 7,
    createdAt: nowMinus(60 * 24 * 50),
    updatedAt: nowMinus(60 * 24 * 4),
  },
  {
    id: 'ka_9',
    title: 'إدارة الأقسام والصلاحيات',
    content: 'كيفية إنشاء الأقسام وتوزيع الموظفين عليها، مع ضبط صلاحيات الوصول لكل قسم.',
    categoryId: 'kc_4',
    status: 'draft',
    views: 210,
    helpful: 10,
    notHelpful: 2,
    createdAt: nowMinus(60 * 24 * 25),
    updatedAt: nowMinus(60 * 24 * 6),
  },
  {
    id: 'ka_10',
    title: 'استخدام واجهة API',
    content: 'دليل شامل لاستخدام واجهة API الخاصة بـ Qhub لبناء تكاملات مخصصة مع أنظمتك الداخلية.',
    categoryId: 'kc_5',
    status: 'published',
    views: 780,
    helpful: 55,
    notHelpful: 11,
    createdAt: nowMinus(60 * 24 * 45),
    updatedAt: nowMinus(60 * 24 * 2),
  },
  {
    id: 'ka_11',
    title: 'ربط Webhook والتكاملات الخارجية',
    content: 'شرح إعداد Webhooks لتلقي الإشعارات في الوقت الفعلي وربط Qhub بأدوات مثل Zapier و Slack.',
    categoryId: 'kc_5',
    status: 'published',
    views: 560,
    helpful: 38,
    notHelpful: 5,
    createdAt: nowMinus(60 * 24 * 40),
    updatedAt: nowMinus(60 * 24 * 1),
  },
];

// =====================================================================
// Plan Requests — subscription inquiries from potential clients
// =====================================================================
export const planRequests: PlanRequest[] = [
  {
    id: 'pr_1',
    planId: 'plan_enterprise',
    contactName: 'أحمد العتيبي',
    email: 'ahmed@speed-delivery.com',
    phone: '201100000000',
    whatsapp: '20',
    country: 'EG',
    companyName: 'Speed Delivery',
    orderVolume: '50000-100000',
    businessType: 'fixed',
    status: 'new',
    createdAt: nowMinus(60 * 2),
  },
  {
    id: 'pr_2',
    planId: 'plan_business',
    contactName: 'سارة المنصوري',
    email: 'sara@bostaa.com',
    phone: '9661125395165',
    country: 'SA',
    companyName: 'بوسطة للشحن السريع',
    orderVolume: '50000-100000',
    businessType: 'seasonal',
    status: 'new',
    createdAt: nowMinus(60 * 30),
  },
  {
    id: 'pr_3',
    planId: 'plan_enterprise',
    contactName: 'خالد الحربي',
    email: 'khaled@logistic-sa.com',
    phone: '970599857778',
    whatsapp: '970599857778',
    country: 'SA',
    companyName: 'لوجستيك السعودية',
    orderVolume: '200000+',
    businessType: 'seasonal',
    status: 'new',
    createdAt: nowMinus(60 * 60 * 3),
  },
  {
    id: 'pr_4',
    planId: 'plan_business',
    contactName: 'فاطمة الشامسي',
    email: 'fatma@emiratesship.ae',
    phone: '970599754145',
    whatsapp: '970599754145',
    country: 'AE',
    companyName: 'إمارات شيب',
    orderVolume: '100000-200000',
    businessType: 'seasonal',
    status: 'contacted',
    createdAt: nowMinus(60 * 60 * 24),
  },
  {
    id: 'pr_5',
    planId: 'plan_enterprise',
    contactName: 'محمد القحطاني',
    email: 'moh@test-co.com',
    phone: '970599874584',
    country: 'SA',
    companyName: 'شركة الاختبار',
    orderVolume: '100000-200000',
    businessType: 'seasonal',
    status: 'contacted',
    createdAt: nowMinus(60 * 60 * 48),
  },
  {
    id: 'pr_6',
    planId: 'plan_business',
    contactName: 'ليلى البلوشي',
    email: 'layla@oman-express.om',
    phone: '970599412541',
    country: 'OM',
    companyName: 'عمان إكسبرس',
    orderVolume: '200000+',
    businessType: 'fixed',
    status: 'new',
    createdAt: nowMinus(60 * 60 * 72),
  },
  {
    id: 'pr_7',
    planId: 'plan_pro',
    contactName: 'عبدالله الكويتي',
    email: 'abdullah@kwship.kw',
    phone: '970566521521',
    country: 'KW',
    companyName: 'شحن الكويت',
    orderVolume: '20000-50000',
    businessType: 'seasonal',
    status: 'contacted',
    createdAt: nowMinus(60 * 60 * 24 * 5),
  },
  {
    id: 'pr_8',
    planId: 'plan_enterprise',
    contactName: 'نورة الدوسري',
    email: 'noura@cargo-gulf.com',
    phone: '970599655125',
    country: 'QA',
    companyName: 'كارغو الخليج',
    orderVolume: '50000-100000',
    businessType: 'fixed',
    status: 'new',
    createdAt: nowMinus(60 * 60 * 24 * 7),
  },
];
