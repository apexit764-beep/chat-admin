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
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import type { PlanTier } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
  requiresContact: boolean;
  active: boolean;
}

export default function PlanForm(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const plans = useAdminStore((s) => s.plans);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const addPlan = useAdminStore((s) => s.addPlan);
  const updatePlan = useAdminStore((s) => s.updatePlan);
  const cascadePlanPriceChange = useAdminStore((s) => s.cascadePlanPriceChange);
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
        requiresContact: editing.requiresContact ?? false,
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
      requiresContact: false,
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
    if (errors.prices) setErrors((prev) => { const { prices, ...rest } = prev; return rest; });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleFeature = (feature: string): void => {
    const s = new Set(form.features);
    if (s.has(feature)) s.delete(feature);
    else s.add(feature);
    setForm({ ...form, features: Array.from(s) });
    if (errors.features) setErrors((prev) => { const { features, ...rest } = prev; return rest; });
  };

  interface ChangeImpact {
    priceChanged: boolean;
    priceDirection: 'up' | 'down' | 'mixed' | null;
    limitsDecreased: boolean;
    decreasedLimits: string[];
    featuresRemoved: string[];
    featuresAdded: string[];
    nameChanged: boolean;
    activeChanged: boolean;
    affectedClients: number;
  }

  const [showImpactDialog, setShowImpactDialog] = useState(false);
  const [pendingImpact, setPendingImpact] = useState<ChangeImpact | null>(null);

  const linkedClients = useMemo(
    () => (editing ? clients.filter((c) => c.planId === editing.id) : []),
    [editing, clients]
  );

  const detectChanges = (): ChangeImpact | null => {
    if (!editing) return null;

    const impact: ChangeImpact = {
      priceChanged: false,
      priceDirection: null,
      limitsDecreased: false,
      decreasedLimits: [],
      featuresRemoved: [],
      featuresAdded: [],
      nameChanged: false,
      activeChanged: false,
      affectedClients: linkedClients.length,
    };

    if (form.name !== editing.name || form.nameAr !== editing.nameAr) {
      impact.nameChanged = true;
    }

    if (form.active !== editing.active) {
      impact.activeChanged = true;
    }

    let anyUp = false;
    let anyDown = false;
    for (const code of Object.keys(form.pricesPerCountry)) {
      const oldP = editing.pricesPerCountry[code];
      const newP = form.pricesPerCountry[code];
      if (!oldP || !newP) continue;
      if (newP.monthly !== oldP.monthly || newP.yearly !== oldP.yearly) {
        impact.priceChanged = true;
        if (newP.monthly > oldP.monthly) anyUp = true;
        if (newP.monthly < oldP.monthly) anyDown = true;
      }
    }
    if (anyUp && anyDown) impact.priceDirection = 'mixed';
    else if (anyUp) impact.priceDirection = 'up';
    else if (anyDown) impact.priceDirection = 'down';

    const limitLabels: Record<string, string> = {
      agents: 'الموظفين', channels: 'القنوات', conversations: 'المحادثات', contacts: 'جهات الاتصال',
    };
    const limitMap: Record<string, [number, number]> = {
      agents: [editing.limits.agents, form.limitAgents],
      channels: [editing.limits.channels, form.limitChannels],
      conversations: [editing.limits.conversations, form.limitConversations],
      contacts: [editing.limits.contacts, form.limitContacts],
    };
    for (const [key, [oldVal, newVal]] of Object.entries(limitMap)) {
      if (newVal < oldVal && newVal !== -1) {
        impact.limitsDecreased = true;
        impact.decreasedLimits.push(limitLabels[key]);
      }
    }

    const oldFeatures = new Set(editing.features);
    const newFeatures = new Set(form.features);
    impact.featuresRemoved = editing.features.filter((f) => !newFeatures.has(f));
    impact.featuresAdded = form.features.filter((f) => !oldFeatures.has(f));

    const hasSignificantChange =
      impact.priceChanged || impact.limitsDecreased || impact.featuresRemoved.length > 0 ||
      impact.featuresAdded.length > 0 || impact.nameChanged || impact.activeChanged;

    return hasSignificantChange ? impact : null;
  };

  const buildPayload = () => ({
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
    requiresContact: form.requiresContact,
    active: form.active,
  });

  const applyChanges = (impact: ChangeImpact | null): void => {
    if (form.popular) {
      plans.forEach((other) => {
        if (other.popular && other.id !== editing?.id) {
          updatePlan(other.id, { popular: false });
        }
      });
    }
    const payload = buildPayload();
    if (editing) {
      updatePlan(editing.id, payload);
      if (impact?.priceChanged && linkedClients.length > 0) {
        const affected = cascadePlanPriceChange(editing.id, form.pricesPerCountry);
        if (affected > 0) {
          showToast(`تم تحديث الباقة وتعديل أسعار ${affected} اشتراك — يُطبق في الدورة القادمة`, 'success');
        } else {
          showToast('تم تحديث الباقة', 'success');
        }
      } else {
        showToast('تم تحديث الباقة', 'success');
      }
    } else {
      addPlan(payload);
      showToast('تمت إضافة الباقة', 'success');
    }
    navigate('/plans');
  };

  const submit = (): void => {
    const newErrors: Record<string, string> = {};

    if (!form.nameAr.trim()) {
      newErrors.nameAr = 'الاسم بالعربية مطلوب';
    }
    if (!form.name.trim()) {
      newErrors.name = 'الاسم بالإنجليزية مطلوب';
    }
    if (form.limitAgents === 0 || form.limitChannels === 0 || form.limitConversations === 0 || form.limitContacts === 0) {
      newErrors.limits = 'يجب تحديد جميع الحدود (استخدم -1 لغير محدود)';
    }
    if (form.features.length === 0) {
      newErrors.features = 'يجب اختيار ميزة واحدة على الأقل';
    }
    if (!form.isTrial) {
      const hasPrice = Object.values(form.pricesPerCountry).some((p) => p.monthly > 0);
      if (!hasPrice) {
        newErrors.prices = 'يجب إدخال سعر شهري لدولة واحدة على الأقل';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('يرجى تعبئة الحقول المطلوبة', 'error');
      return;
    }

    if (editing && linkedClients.length > 0) {
      const impact = detectChanges();
      if (impact) {
        setPendingImpact(impact);
        setShowImpactDialog(true);
        return;
      }
    }

    applyChanges(null);
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
                  <Label>الاسم بالعربية<span className="text-destructive ms-0.5">*</span></Label>
                  <Input value={form.nameAr} onChange={(e) => { setForm({ ...form, nameAr: e.target.value }); if (errors.nameAr) setErrors((prev) => { const { nameAr, ...rest } = prev; return rest; }); }} placeholder="مثال: الاحترافي" />
                  {errors.nameAr && <p className="text-xs text-destructive mt-1">{errors.nameAr}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Name (EN)<span className="text-destructive ms-0.5">*</span></Label>
                  <Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors((prev) => { const { name, ...rest } = prev; return rest; }); }} placeholder="Pro" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>وصف قصير (Tagline)<span className="text-muted-foreground text-[10px] ms-1">(اختياري)</span></Label>
                <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="للشركات النامية" />
              </div>
            </CardContent>
          </Card>

          {/* Limits - 2 per row */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">الحدود<span className="text-destructive ms-0.5">*</span></h3>
              {errors.limits && <p className="text-xs text-destructive mt-1">{errors.limits}</p>}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /> حد الموظفين<span className="text-destructive ms-0.5">*</span></Label>
                  <Input type="number" min={-1} value={form.limitAgents} onChange={(e) => { setForm({ ...form, limitAgents: Number(e.target.value) || 0 }); if (errors.limits) setErrors((prev) => { const { limits, ...rest } = prev; return rest; }); }} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> حد القنوات<span className="text-destructive ms-0.5">*</span></Label>
                  <Input type="number" min={-1} value={form.limitChannels} onChange={(e) => { setForm({ ...form, limitChannels: Number(e.target.value) || 0 }); if (errors.limits) setErrors((prev) => { const { limits, ...rest } = prev; return rest; }); }} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-muted-foreground" /> محادثات/شهر<span className="text-destructive ms-0.5">*</span></Label>
                  <Input type="number" min={-1} value={form.limitConversations} onChange={(e) => { setForm({ ...form, limitConversations: Number(e.target.value) || 0 }); if (errors.limits) setErrors((prev) => { const { limits, ...rest } = prev; return rest; }); }} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><InfinityIcon className="h-3.5 w-3.5 text-muted-foreground" /> جهات اتصال<span className="text-destructive ms-0.5">*</span></Label>
                  <Input type="number" min={-1} value={form.limitContacts} onChange={(e) => { setForm({ ...form, limitContacts: Number(e.target.value) || 0 }); if (errors.limits) setErrors((prev) => { const { limits, ...rest } = prev; return rest; }); }} />
                  <p className="text-[11px] text-muted-foreground">-1 = غير محدود</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trial & contact toggles */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium">باقة تجريبية</p>
                  <p className="text-xs text-muted-foreground">مجانية للتجربة — لن تحتاج لإدخال أسعار</p>
                </div>
                <Switch checked={form.isTrial} onCheckedChange={(checked) => setForm({ ...form, isTrial: checked })} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium">يتطلب تواصل</p>
                  <p className="text-xs text-muted-foreground">العميل يرسل طلب بدلاً من الاشتراك المباشر</p>
                </div>
                <Switch checked={form.requiresContact} onCheckedChange={(checked) => setForm({ ...form, requiresContact: checked })} />
              </div>
            </CardContent>
          </Card>

          {/* Prices per country - hidden when trial */}
          {!form.isTrial && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">الأسعار حسب الدولة<span className="text-destructive ms-0.5">*</span></h3>
                {errors.prices && <p className="text-xs text-destructive mt-1">{errors.prices}</p>}
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
                  <h3 className="text-lg font-semibold">الميزات<span className="text-destructive ms-0.5">*</span></h3>
                  <span className="text-xs text-muted-foreground">{form.features.length} ميزة مفعّلة</span>
                </div>
                {errors.features && <p className="text-xs text-destructive mt-1">{errors.features}</p>}
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

      {/* Impact confirmation dialog */}
      <Dialog open={showImpactDialog} onOpenChange={(open) => { if (!open) setShowImpactDialog(false); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              تأكيد تعديل الباقة
            </DialogTitle>
            <DialogDescription>
              هذه الباقة مرتبطة بـ <span className="font-bold text-foreground">{pendingImpact?.affectedClients}</span> عميل.
              يرجى مراجعة التغييرات قبل التأكيد.
            </DialogDescription>
          </DialogHeader>

          {pendingImpact && (
            <div className="space-y-3 py-2 max-h-[50vh] overflow-y-auto">
              {pendingImpact.priceChanged && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="mt-0.5">
                    {pendingImpact.priceDirection === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    ) : pendingImpact.priceDirection === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {pendingImpact.priceDirection === 'up' && 'زيادة في الأسعار'}
                      {pendingImpact.priceDirection === 'down' && 'تخفيض في الأسعار'}
                      {pendingImpact.priceDirection === 'mixed' && 'تغيير في الأسعار'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      السعر الجديد يُطبق على الاشتراكات الحالية في الدورة القادمة
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">{pendingImpact.affectedClients} عميل</Badge>
                </div>
              )}

              {pendingImpact.limitsDecreased && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">تقليل الحدود</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      تم تقليل: {pendingImpact.decreasedLimits.join('، ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      العملاء الحاليون يحتفظون باستخدامهم الحالي — لا يمكنهم إضافة المزيد حتى ينزلوا تحت الحد الجديد
                    </p>
                  </div>
                </div>
              )}

              {pendingImpact.featuresRemoved.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">ميزات تمت إزالتها</p>
                    <ul className="mt-1 space-y-0.5">
                      {pendingImpact.featuresRemoved.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {pendingImpact.featuresAdded.length > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <Bell className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">ميزات جديدة</p>
                    <ul className="mt-1 space-y-0.5">
                      {pendingImpact.featuresAdded.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {pendingImpact.nameChanged && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">تغيير اسم الباقة</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      سيتم إشعار العملاء بالاسم الجديد
                    </p>
                  </div>
                </div>
              )}

              {pendingImpact.activeChanged && !form.active && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">تعطيل الباقة</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      العملاء الحاليون ({pendingImpact.affectedClients}) يحتفظون بباقتهم — عملاء جدد لا يمكنهم الاشتراك
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowImpactDialog(false)}>إلغاء</Button>
            <Button
              onClick={() => {
                setShowImpactDialog(false);
                applyChanges(pendingImpact);
              }}
            >
              تأكيد وحفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
