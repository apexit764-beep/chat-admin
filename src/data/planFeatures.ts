import { Bot, MessageCircle, Shield, Zap } from 'lucide-react';
import type { ChannelType } from '@/types';

export type FeatureGroup = { label: string; icon: React.ComponentType<{ className?: string }>; items: string[] };

export const FEATURE_CATALOG: FeatureGroup[] = [
  {
    label: 'قنوات التواصل',
    icon: MessageCircle,
    items: [
      'تكامل واتساب',
      'تكامل ماسنجر',
      'تكامل انستقرام',
      'تكامل تلقرام',
      'Live Chat Widget',
      'دعم عبر البريد',
    ],
  },
  {
    label: 'الذكاء والأتمتة',
    icon: Bot,
    items: [
      'ردود جاهزة',
      'ردود ذكية بالـ AI',
      'قوالب رسائل',
      'الحملات (Outreach)',
      'التوجيه التلقائي',
      'ساعات العمل',
    ],
  },
  {
    label: 'التقارير والتكامل',
    icon: Zap,
    items: [
      'تقارير أساسية',
      'تقارير متقدمة',
      'تصدير CSV',
      'API access',
      'Webhooks',
      'تكامل Zapier',
    ],
  },
  {
    label: 'الدعم والمؤسسات',
    icon: Shield,
    items: [
      'دعم فني قياسي',
      'دعم فني ٢٤/٧',
      'SLA مضمون ٩٩.٩٪',
      'مدير حساب مخصص',
      'تدريب مجاني للفريق',
      'Whitelabel',
      'SSO',
    ],
  },
];

/** every feature in the catalogue, in order — used to seed fully-loaded plans */
export const ALL_FEATURES: string[] = FEATURE_CATALOG.flatMap((g) => g.items);

/** the channels a plan can cap accounts on, matching the channel features above */
export const PLAN_CHANNELS: Array<{ key: ChannelType; label: string }> = [
  { key: 'whatsapp', label: 'واتساب' },
  { key: 'messenger', label: 'ماسنجر' },
  { key: 'instagram', label: 'انستقرام' },
  { key: 'telegram', label: 'تلقرام' },
  { key: 'widget', label: 'Live Chat Widget' },
  { key: 'email', label: 'البريد الإلكتروني' },
];
