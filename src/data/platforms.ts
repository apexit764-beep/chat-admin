import type React from 'react';
import { MessageCircle, Mail, ShoppingBag } from 'lucide-react';
import type { PlatformType } from '@/types';

export type PlatformCategory = string;

export interface ConnectionStep {
  text: string;
}

export interface ConnectionMethod {
  id: string;
  name: string;
  recommended?: boolean;
  steps: ConnectionStep[];
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  category: PlatformCategory;
  enabled: boolean;
  logo: string;
  countries: string[];
  connectionMethods: ConnectionMethod[];
}

export const categoryLabels: Record<PlatformCategory, string> = {
  communication: 'قنوات التواصل',
  email: 'البريد الإلكتروني',
  ecommerce: 'منصات التجارة الإلكترونية وشركات الشحن',
};

export const categoryIcons: Record<PlatformCategory, React.ElementType> = {
  communication: MessageCircle,
  email: Mail,
  ecommerce: ShoppingBag,
};

export const categoryBadgeColors: Record<PlatformCategory, string> = {
  communication: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  email: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  ecommerce: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export const defaultPlatforms: Platform[] = [
  { id: 'p1', name: 'WhatsApp Business', slug: 'whatsapp', category: 'communication', enabled: true, logo: '', countries: ['SA', 'EG', 'AE'], connectionMethods: [
    { id: 'cm1', name: 'Meta Business Cloud API', recommended: true, steps: [
      { text: 'سجّل الدخول في business.facebook.com وأنشئ حساب أعمال' },
      { text: 'من الإعدادات ← WhatsApp Accounts، أنشئ تطبيقاً واربط رقم الواتساب' },
      { text: 'انسخ Phone Number ID و WABA ID و Access Token من Meta' },
      { text: 'الصق البيانات في نموذج الربط وفعّل الـ Webhook' },
    ]},
    { id: 'cm2', name: 'كود الاقتران (8 أحرف)', steps: [
      { text: 'افتح واتساب على الهاتف واذهب للإعدادات' },
      { text: 'اختر "الأجهزة المرتبطة" ثم "ربط جهاز"' },
      { text: 'أدخل كود الاقتران المكون من 8 أحرف' },
    ]},
    { id: 'cm3', name: 'رمز QR', steps: [
      { text: 'افتح واتساب على الهاتف واذهب للإعدادات' },
      { text: 'اختر "الأجهزة المرتبطة" ثم "ربط جهاز"' },
      { text: 'امسح رمز QR الظاهر على الشاشة' },
    ]},
  ]},
  { id: 'p2', name: 'Facebook Messenger', slug: 'facebook-messenger', category: 'communication', enabled: true, logo: '', countries: ['SA', 'EG'], connectionMethods: [
    { id: 'cm4', name: 'ربط عبر Facebook Login', steps: [
      { text: 'سجّل الدخول بحساب Facebook وامنح الصلاحيات المطلوبة' },
      { text: 'اختر الصفحة المراد ربطها' },
    ]},
  ]},
  { id: 'p3', name: 'Instagram Direct', slug: 'instagram', category: 'communication', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p4', name: 'Telegram', slug: 'telegram', category: 'communication', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p5', name: 'Live Chat Widget', slug: 'livechat', category: 'communication', enabled: true, logo: '', countries: ['SA', 'EG', 'AE', 'OM'], connectionMethods: [] },
  { id: 'p6', name: 'X (Twitter)', slug: 'twitter', category: 'communication', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p7', name: 'Gmail', slug: 'gmail', category: 'email', enabled: true, logo: '', countries: ['SA', 'EG'], connectionMethods: [] },
  { id: 'p8', name: 'Outlook', slug: 'outlook', category: 'email', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p9', name: 'Yahoo Mail', slug: 'yahoo', category: 'email', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p10', name: 'SMTP', slug: 'smtp', category: 'email', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p11', name: 'سلة', slug: 'salla', category: 'ecommerce', enabled: true, logo: '', countries: ['SA'], connectionMethods: [] },
  { id: 'p12', name: 'Zid', slug: 'zid', category: 'ecommerce', enabled: false, logo: '', countries: ['SA'], connectionMethods: [] },
  { id: 'p13', name: 'Shopify', slug: 'shopify', category: 'ecommerce', enabled: false, logo: '', countries: [], connectionMethods: [] },
  { id: 'p14', name: 'WooCommerce', slug: 'woocommerce', category: 'ecommerce', enabled: true, logo: '', countries: ['SA', 'EG'], connectionMethods: [] },
];

export const emptyForm: Omit<Platform, 'id'> = {
  name: '',
  slug: '',
  category: 'communication',
  enabled: true,
  logo: '',
  countries: [],
  connectionMethods: [],
};

/** Swatch + badge classes for every colour a platform type can use */
export const PLATFORM_TYPE_COLORS: Array<{
  value: PlatformType['color'];
  label: string;
  swatch: string;
  badge: string;
}> = [
  { value: 'red', label: 'أحمر', swatch: 'bg-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'purple', label: 'بنفسجي', swatch: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'blue', label: 'أزرق', swatch: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'emerald', label: 'أخضر', swatch: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'amber', label: 'ذهبي', swatch: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
];

export function platformTypeBadgeClass(color: PlatformType['color'] | undefined): string {
  return (
    PLATFORM_TYPE_COLORS.find((c) => c.value === color)?.badge ??
    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  );
}

export const defaultPlatformTypes: PlatformType[] = [
  { id: 'pt1', key: 'communication', name: 'Communication Channels', nameAr: 'قنوات التواصل', color: 'blue' },
  { id: 'pt2', key: 'email', name: 'Email', nameAr: 'البريد الإلكتروني', color: 'amber' },
  { id: 'pt3', key: 'ecommerce', name: 'E-commerce & Shipping', nameAr: 'منصات التجارة الإلكترونية وشركات الشحن', color: 'emerald' },
];
