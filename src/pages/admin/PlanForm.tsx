import { useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  X,
  ArrowRight,
  Users,
  MessageSquare,
  Database,
  Radio,
  Infinity as InfinityIcon,
  ChevronDown,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import type { FeatureValue, PlanLimits, PlanPrice, PlanTier } from '@/types';
import { CUSTOM_LIMIT, DEFAULT_PRICE_KEY, UNLIMITED } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BilingualInput } from '@/components/ui/bilingual-input';
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
import { ALL_FEATURE_KEYS, FEATURE_CATALOG, FEATURE_LABELS, featureText, isGranted } from '@/data/planFeatures';
import { LIMIT_FIELDS, isLimitReduced } from '@/utils/planLimits';

interface FormState {
  tier: PlanTier;
  name: string;
  nameAr: string;
  tagline: string;
  features: Record<string, FeatureValue>;
  limits: PlanLimits;
  pricesPerCountry: Record<string, PlanPrice>;
  popular: boolean;
  adminOnly: boolean;
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

  /** every country, plus the catch-all row billed in USD */
  const priceRows = useMemo(
    () => [
      ...countries.map((c) => ({ key: c.code, label: `${c.flag} ${c.nameAr}`, symbol: c.symbol })),
      { key: DEFAULT_PRICE_KEY, label: '🌍 باقي دول العالم', symbol: '$' },
    ],
    [countries]
  );

  const defaultPrices = useMemo(() => {
    const defaults: Record<string, PlanPrice> = {};
    priceRows.forEach((r) => { defaults[r.key] = { monthly: 0, yearly: 0 }; });
    return defaults;
  }, [priceRows]);

  const [form, setForm] = useState<FormState>(() => {
    if (editing) {
      return {
        tier: editing.tier,
        name: editing.name,
        nameAr: editing.nameAr,
        tagline: editing.tagline,
        features: { ...editing.features },
        limits: { ...editing.limits },
        pricesPerCountry: { ...editing.pricesPerCountry },
        popular: editing.popular ?? false,
        adminOnly: editing.adminOnly ?? false,
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
      features: {},
      limits: {
        conversations: 3000, messages: -1, accounts: 6, agents: 10,
        contacts: -1, departments: -1, whatsappCampaigns: 6000, emailCampaigns: 6000,
      },
      pricesPerCountry: defaultPrices,
      popular: false,
      adminOnly: false,
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

  /** keeps a written allowance while its feature is switched off */
  const lastValue = useRef<Record<string, string>>({});

  /** the on/off switch; an existing written allowance survives a toggle off and on */
  const toggleFeature = (key: string, on: boolean): void => {
    const features = { ...form.features };
    if (on) features[key] = lastValue.current[key] ?? true;
    else {
      if (typeof features[key] === 'string' && features[key] !== 'soon') {
        lastValue.current[key] = features[key] as string;
      }
      delete features[key];
    }
    setForm({ ...form, features });
    if (errors.features) setErrors((prev) => { const { features: _f, ...rest } = prev; return rest; });
  };

  /** '' clears the allowance back to a plain ✔; anything else is kept verbatim */
  const setFeatureText = (key: string, text: string): void => {
    if (text === '') delete lastValue.current[key];
    setForm({ ...form, features: { ...form.features, [key]: text === '' ? true : text } });
  };

  const setLimit = (key: keyof PlanLimits, value: number): void => {
    setForm({ ...form, limits: { ...form.limits, [key]: value } });
    if (errors.limits) setErrors((prev) => { const { limits, ...rest } = prev; return rest; });
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

    for (const f of LIMIT_FIELDS) {
      if (isLimitReduced(editing.limits[f.key], form.limits[f.key])) {
        impact.limitsDecreased = true;
        impact.decreasedLimits.push(f.label);
      }
    }

    // a feature the client had and no longer has is a downgrade, whatever its value was
    impact.featuresRemoved = ALL_FEATURE_KEYS
      .filter((k) => isGranted(editing.features[k]) && !isGranted(form.features[k]))
      .map((k) => FEATURE_LABELS[k]);
    impact.featuresAdded = ALL_FEATURE_KEYS
      .filter((k) => !isGranted(editing.features[k]) && isGranted(form.features[k]))
      .map((k) => FEATURE_LABELS[k]);

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
    limits: form.limits,
    pricesPerCountry: form.pricesPerCountry,
    popular: form.popular,
    adminOnly: form.adminOnly,
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
    if (LIMIT_FIELDS.some((f) => form.limits[f.key] === 0)) {
      newErrors.limits = 'يجب تحديد جميع الحدود — اكتب رقماً أو اختر «غير محدود» أو «مخصّص»';
    }
    if (ALL_FEATURE_KEYS.every((k) => !isGranted(form.features[k]))) {
      newErrors.features = 'يجب اختيار ميزة واحدة على الأقل';
    }
    if (!form.isTrial && !form.requiresContact) {
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
              <BilingualInput
                label="اسم الباقة"
                valueAr={form.nameAr}
                valueEn={form.name}
                onChangeAr={(value) => {
                  setForm({ ...form, nameAr: value });
                  if (errors.nameAr) setErrors((prev) => { const { nameAr, ...rest } = prev; return rest; });
                }}
                onChangeEn={(value) => {
                  setForm({ ...form, name: value });
                  if (errors.name) setErrors((prev) => { const { name, ...rest } = prev; return rest; });
                }}
                required
                error={errors.nameAr || errors.name}
              />
              <div className="space-y-2">
                <Label>وصف قصير (Tagline)<span className="text-muted-foreground text-[10px] ms-1">(اختياري)</span></Label>
                <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="للشركات النامية" />
              </div>
            </CardContent>
          </Card>

          {/* Limits — the eight allowances from the approved sheet */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">الحدود<span className="text-destructive ms-0.5">*</span></h3>
              <p className="text-xs text-muted-foreground mt-1">اختر «مخصّص» للحدّ الذي يُتَّفق عليه في كل صفقة</p>
              {errors.limits && <p className="text-xs text-destructive mt-1">{errors.limits}</p>}
            </CardHeader>
            <CardContent>
              {/*
                الحدّ ثلاث حالات لا رقم واحد، فيُختار نوعه ثم يُكتب الرقم إن لزم.
                الصياغة السابقة كانت حقلاً رقمياً وحده و«‎-1‎ غير محدود · ‎-2‎ مخصّص»
                مكتوبة تحته: الرقمان سالبان لأنهما علامتان لا كمّيات، فكان على
                المحرّر أن يحفظ أيّهما أيّ — ويقرأ «‎-2‎» في الحقل بعد الحفظ.
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LIMIT_FIELDS.map((f) => {
                  const v = form.limits[f.key];
                  const kind = v === UNLIMITED ? 'unlimited' : v === CUSTOM_LIMIT ? 'custom' : 'number';
                  return (
                    <div key={f.key} className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        {f.label}<span className="text-destructive ms-0.5">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <select
                          value={kind}
                          onChange={(e) => {
                            const next = e.target.value;
                            // الرجوع إلى «رقم محدد» يبدأ من صفر، وهو ما يمنعه التحقق
                            // حتى يكتب المحرّر رقماً فعلياً.
                            setLimit(f.key, next === 'unlimited' ? UNLIMITED : next === 'custom' ? CUSTOM_LIMIT : 0);
                          }}
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm shrink-0"
                        >
                          <option value="number">رقم محدد</option>
                          <option value="unlimited">غير محدود</option>
                          <option value="custom">مخصّص</option>
                        </select>
                        {kind === 'number' && (
                          <Input
                            type="number"
                            min={0}
                            value={v}
                            onChange={(e) => setLimit(f.key, Math.max(0, Number(e.target.value) || 0))}
                          />
                        )}
                      </div>
                      {f.hint && <p className="text-[11px] text-muted-foreground">{f.hint}</p>}
                    </div>
                  );
                })}
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

          {/* Prices per country - hidden when trial or requires contact */}
          {!form.isTrial && !form.requiresContact && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">الأسعار حسب الدولة<span className="text-destructive ms-0.5">*</span></h3>
                {errors.prices && <p className="text-xs text-destructive mt-1">{errors.prices}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priceRows.map((row) => {
                    const price = form.pricesPerCountry[row.key] ?? { monthly: 0, yearly: 0 };
                    return (
                      <div key={row.key} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 p-2.5 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 font-medium">
                          <span className="text-sm">{row.label}</span>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            value={price.monthly}
                            onChange={(e) => setMonthlyPrice(row.key, Number(e.target.value) || 0)}
                            placeholder="0"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{row.symbol}/شهر</span>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            value={price.yearly}
                            onChange={(e) => setForm({ ...form, pricesPerCountry: { ...form.pricesPerCountry, [row.key]: { ...price, yearly: Number(e.target.value) || 0 } } })}
                            placeholder="0"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">{row.symbol}/سنة — الإجمالي</span>
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
                    <p className="text-sm font-medium">للأدمن فقط</p>
                    <p className="text-xs text-muted-foreground">لا تظهر للعملاء</p>
                  </div>
                  <Switch checked={form.adminOnly} onCheckedChange={(checked) => setForm({ ...form, adminOnly: checked })} />
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
                  <span className="text-xs text-muted-foreground">
                    {ALL_FEATURE_KEYS.filter((k) => isGranted(form.features[k])).length} من {ALL_FEATURE_KEYS.length} ميزة
                  </span>
                </div>
                {errors.features && <p className="text-xs text-destructive mt-1">{errors.features}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FEATURE_CATALOG.map((group) => {
                    const isCollapsed = collapsed[group.label] ?? false;
                    const enabledCount = group.items.filter((f) => isGranted(form.features[f.key])).length;
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
                              const value = form.features[feature.key];
                              const enabled = isGranted(value);
                              const soon = value === 'soon';
                              return (
                                <div
                                  key={feature.key}
                                  className={cn(
                                    'px-3 py-2 transition-colors',
                                    enabled ? 'bg-primary/5' : soon ? 'bg-warning/5' : 'bg-background'
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm flex-1">{feature.label}</span>
                                    {/*
                                      «قريباً» is set by the backend, not here: a feature that
                                      has not shipped has nothing to switch on or off, so the
                                      tag stands in place of the switch and is read-only.
                                    */}
                                    {soon ? (
                                      <span
                                        title="ميزة معلنة ولم تُطلق بعد — تُدار من الباك إند"
                                        className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold bg-warning/15 text-warning border border-warning/30"
                                      >
                                        قريباً
                                      </span>
                                    ) : (
                                      <Switch
                                        checked={enabled}
                                        onCheckedChange={(c) => toggleFeature(feature.key, c)}
                                      />
                                    )}
                                  </div>
                                  {/* only the four features the sheet describes with words */}
                                  {enabled && feature.hasValue && (
                                    <Input
                                      value={value === true ? '' : String(value)}
                                      onChange={(e) => setFeatureText(feature.key, e.target.value)}
                                      placeholder="قيمة محددة (اختياري) — مثال: شات بأولوية"
                                      className="h-7 text-xs mt-1.5"
                                    />
                                  )}
                                </div>
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
