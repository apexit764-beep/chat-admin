import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Bot,
  Zap,
  Shield,
  Users,
  MessageSquare,
  Database,
  Infinity as InfinityIcon,
  ChevronDown,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import type { PlanTier } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type FeatureGroup = { label: string; icon: React.ComponentType<{ className?: string }>; items: string[] };

const FEATURE_CATALOG: FeatureGroup[] = [
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

interface FormState {
  tier: PlanTier;
  name: string;
  nameAr: string;
  tagline: string;
  features: string[];
  limitAgents: number;
  limitChannels: number;
  limitConversations: number;
  limitContacts: number;
  pricesPerCountry: Record<string, { monthly: number; yearly: number }>;
  popular: boolean;
  isTrial: boolean;
  active: boolean;
}

export default function PlanForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const addPlan = useAdminStore((s) => s.addPlan);
  const updatePlan = useAdminStore((s) => s.updatePlan);
  const showToast = useUIStore((s) => s.showToast);

  const editing = useMemo(() => (id ? plans.find((p) => p.id === id) ?? null : null), [id, plans]);

  const defaultPrices = useMemo(() => {
    const defaults: Record<string, { monthly: number; yearly: number }> = {};
    countries.forEach((c) => { defaults[c.code] = { monthly: 0, yearly: 0 }; });
    return defaults;
  }, [countries]);

  const [form, setForm] = useState<FormState>(() => {
    if (editing) {
      return {
        tier: editing.tier,
        name: editing.name,
        nameAr: editing.nameAr,
        tagline: editing.tagline,
        features: [...editing.features],
        limitAgents: editing.limits.agents,
        limitChannels: editing.limits.channels,
        limitConversations: editing.limits.conversations,
        limitContacts: editing.limits.contacts,
        pricesPerCountry: { ...editing.pricesPerCountry },
        popular: editing.popular ?? false,
        isTrial: editing.isTrial ?? false,
        active: editing.active,
      };
    }
    return {
      tier: 'pro',
      name: '',
      nameAr: '',
      tagline: '',
      features: [],
      limitAgents: 5,
      limitChannels: 2,
      limitConversations: 5000,
      limitContacts: 1000,
      pricesPerCountry: defaultPrices,
      popular: false,
      isTrial: false,
      active: true,
    };
  });

  const setMonthlyPrice = (countryCode: string, monthly: number): void => {
    const current = form.pricesPerCountry[countryCode] ?? { monthly: 0, yearly: 0 };
    const autoYearly = current.yearly === 0 || current.yearly === current.monthly * 10
      ? monthly * 10
      : current.yearly;
    setForm({
      ...form,
      pricesPerCountry: { ...form.pricesPerCountry, [countryCode]: { monthly, yearly: autoYearly } },
    });
  };

  const toggleFeature = (feature: string): void => {
    const s = new Set(form.features);
    if (s.has(feature)) s.delete(feature);
    else s.add(feature);
    setForm({ ...form, features: Array.from(s) });
  };

  const submit = (): void => {
    if (!form.name.trim() || !form.nameAr.trim()) {
      showToast('الاسم بالعربية والإنجليزية مطلوبان', 'error');
      return;
    }
    if (form.features.length === 0) {
      showToast('اختر ميزة واحدة على الأقل', 'error');
      return;
    }
    if (form.popular) {
      plans.forEach((other) => {
        if (other.popular && other.id !== editing?.id) {
          updatePlan(other.id, { popular: false });
        }
      });
    }
    const payload = {
      tier: form.tier,
      name: form.name,
      nameAr: form.nameAr,
      tagline: form.tagline,
      features: form.features,
      limits: {
        agents: form.limitAgents,
        channels: form.limitChannels,
        conversations: form.limitConversations,
        contacts: form.limitContacts,
      },
      pricesPerCountry: form.pricesPerCountry,
      popular: form.popular,
      isTrial: form.isTrial,
      active: form.active,
    };
    if (editing) {
      updatePlan(editing.id, payload);
      showToast('تم تحديث الباقة', 'success');
    } else {
      addPlan(payload);
      showToast('تمت إضافة الباقة', 'success');
    }
    navigate('/plans');
  };

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleCollapse = (label: string) => setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={() => navigate('/plans')}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{editing ? `تعديل: ${editing.nameAr}` : 'باقة جديدة'}</h2>
          <p className="text-sm text-muted-foreground">
            {editing ? 'عدّل بيانات الباقة ثم اضغط حفظ' : 'أدخل بيانات الباقة الجديدة'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Right side: basic info, limits, prices, toggles */}
        <div className="flex-1 space-y-5 order-1 lg:order-1">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">البيانات الأساسية</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>الاسم بالعربية</Label>
                  <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="مثال: الاحترافي" />
                </div>
                <div className="space-y-2">
                  <Label>Name (EN)</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Pro" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>وصف قصير (Tagline)</Label>
                <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="للشركات النامية" />
              </div>
            </CardContent>
          </Card>

          {/* Limits - 2 per row */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">الحدود</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /> حد الموظفين</Label>
                  <Input type="number" min={-1} value={form.limitAgents} onChange={(e) => setForm({ ...form, limitAgents: Number(e.target.value) || 0 })} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> حد القنوات</Label>
                  <Input type="number" min={-1} value={form.limitChannels} onChange={(e) => setForm({ ...form, limitChannels: Number(e.target.value) || 0 })} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-muted-foreground" /> محادثات/شهر</Label>
                  <Input type="number" min={-1} value={form.limitConversations} onChange={(e) => setForm({ ...form, limitConversations: Number(e.target.value) || 0 })} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><InfinityIcon className="h-3.5 w-3.5 text-muted-foreground" /> جهات اتصال</Label>
                  <Input type="number" min={-1} value={form.limitContacts} onChange={(e) => setForm({ ...form, limitContacts: Number(e.target.value) || 0 })} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trial toggle - before prices */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium">باقة تجريبية</p>
                  <p className="text-xs text-muted-foreground">مجانية للتجربة — لن تحتاج لإدخال أسعار</p>
                </div>
                <Switch checked={form.isTrial} onCheckedChange={(checked) => setForm({ ...form, isTrial: checked })} />
              </div>
            </CardContent>
          </Card>

          {/* Prices per country - hidden when trial */}
          {!form.isTrial && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">الأسعار حسب الدولة</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countries.map((co) => {
                    const price = form.pricesPerCountry[co.code] ?? { monthly: 0, yearly: 0 };
                    return (
                      <div key={co.code} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 p-2.5 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 font-medium">
                          <span className="text-lg">{co.flag}</span>
                          <span className="text-sm">{co.nameAr}</span>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            value={price.monthly}
                            onChange={(e) => setMonthlyPrice(co.code, Number(e.target.value) || 0)}
                            placeholder="0"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{co.symbol}/شهر</span>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            value={price.yearly}
                            onChange={(e) => setForm({ ...form, pricesPerCountry: { ...form.pricesPerCountry, [co.code]: { ...price, yearly: Number(e.target.value) || 0 } } })}
                            placeholder="0"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{co.symbol}/سنة</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Toggles */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="text-sm font-medium">الأكثر شعبية</p>
                    <p className="text-xs text-muted-foreground">تمييز خاص</p>
                  </div>
                  <Switch checked={form.popular} onCheckedChange={(checked) => setForm({ ...form, popular: checked })} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="text-sm font-medium">نشطة</p>
                    <p className="text-xs text-muted-foreground">متاحة للاشتراك</p>
                  </div>
                  <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Left side: Features (sticky) - 1/3 width */}
        <div className="w-full lg:w-[33%] lg:flex-shrink-0 order-2 lg:order-2">
          <div className="lg:sticky lg:top-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">الميزات</h3>
                  <span className="text-xs text-muted-foreground">{form.features.length} ميزة مفعّلة</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FEATURE_CATALOG.map((group) => {
                    const isCollapsed = collapsed[group.label] ?? false;
                    const enabledCount = group.items.filter((f) => form.features.includes(f)).length;
                    return (
                      <div key={group.label} className="border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/50 hover:bg-muted transition-colors"
                          onClick={() => toggleCollapse(group.label)}
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <group.icon className="h-4 w-4 text-muted-foreground" />
                            {group.label}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">{enabledCount}/{group.items.length}</span>
                            <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', !isCollapsed && 'rotate-180')} />
                          </div>
                        </button>
                        {!isCollapsed && (
                          <div className="divide-y">
                            {group.items.map((feature) => {
                              const enabled = form.features.includes(feature);
                              return (
                                <label
                                  key={feature}
                                  className={cn(
                                    'flex items-center justify-between gap-2 px-3 py-2 cursor-pointer transition-colors',
                                    enabled ? 'bg-primary/5' : 'bg-background'
                                  )}
                                >
                                  <span className="text-sm">{feature}</span>
                                  <Switch checked={enabled} onCheckedChange={() => toggleFeature(feature)} />
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Actions - full width at page level */}
      <div className="flex items-center gap-3 justify-end py-5 border-t mt-5">
        <Button variant="outline" onClick={() => navigate('/plans')}>إلغاء</Button>
        <Button onClick={submit}>{editing ? 'حفظ التعديلات' : 'إنشاء الباقة'}</Button>
      </div>
    </div>
  );
}
