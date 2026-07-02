import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  Users,
  MessageSquare,
  Database,
  Infinity as InfinityIcon,
  Globe2,
  Power,
  Copy,
  MessageCircle,
  Bot,
  Zap,
  Shield,
  Sparkles,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney } from '@/utils/money';
import { cn } from '@/lib/utils';
import type { Plan, PlanTier } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const tierStyle: Record<PlanTier, { bg: string; ring: string; text: string }> = {
  starter: { bg: 'from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-900/10', ring: 'ring-cyan-300 dark:ring-cyan-700', text: 'text-cyan-700 dark:text-cyan-300' },
  pro: { bg: 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10', ring: 'ring-primary', text: 'text-primary' },
  business: { bg: 'from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10', ring: 'ring-violet-300 dark:ring-violet-700', text: 'text-violet-700 dark:text-violet-300' },
  enterprise: { bg: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10', ring: 'ring-amber-300 dark:ring-amber-700', text: 'text-amber-700 dark:text-amber-300' },
};

const tierBadgeVariant: Record<PlanTier, 'default' | 'secondary' | 'outline' | 'warning'> = {
  starter: 'secondary',
  pro: 'default',
  business: 'outline',
  enterprise: 'warning',
};

const tierLabel: Record<PlanTier, string> = {
  starter: 'مبتدئ',
  pro: 'احترافي',
  business: 'أعمال',
  enterprise: 'مؤسسات',
};

const tierOrder: Record<PlanTier, number> = {
  starter: 0,
  pro: 1,
  business: 2,
  enterprise: 3,
};

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

const ALL_CATALOG_FEATURES: string[] = FEATURE_CATALOG.flatMap((g) => g.items);

export default function AdminPlans(): JSX.Element {
  const plans = useAdminStore((s) => s.plans);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const addPlan = useAdminStore((s) => s.addPlan);
  const updatePlan = useAdminStore((s) => s.updatePlan);
  const deletePlan = useAdminStore((s) => s.deletePlan);
  const updateClient = useAdminStore((s) => s.updateClient);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [previewCountry, setPreviewCountry] = useState('OM');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [tierFilter, setTierFilter] = useState<'all' | PlanTier>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFilterCount =
    (tierFilter !== 'all' ? 1 : 0) +
    (activeFilter !== 'all' ? 1 : 0);

  const clearFilters = (): void => {
    setTierFilter('all');
    setActiveFilter('all');
  };
  const [reassignModal, setReassignModal] = useState<{ plan: Plan; targetPlanId: string } | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]),
    [plans]
  );

  const filteredPlans = useMemo(
    () => sortedPlans.filter((p) => {
      if (tierFilter !== 'all' && p.tier !== tierFilter) return false;
      if (activeFilter === 'active' && !p.active) return false;
      if (activeFilter === 'inactive' && p.active) return false;
      return true;
    }),
    [sortedPlans, tierFilter, activeFilter]
  );

  useEffect(() => {
    if (!copiedId) return;
    const el = cardRefs.current[copiedId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = setTimeout(() => setCopiedId(null), 1700);
    return () => clearTimeout(t);
  }, [copiedId]);
  const [form, setForm] = useState<{
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
    active: boolean;
  }>({
    tier: 'pro',
    name: '',
    nameAr: '',
    tagline: '',
    features: [],
    limitAgents: 5,
    limitChannels: 2,
    limitConversations: 5000,
    limitContacts: 1000,
    pricesPerCountry: {},
    popular: false,
    active: true,
  });

  const openCreate = (): void => {
    setEditing(null);
    const defaults: Record<string, { monthly: number; yearly: number }> = {};
    countries.forEach((c) => { defaults[c.code] = { monthly: 0, yearly: 0 }; });
    setForm({
      tier: 'pro', name: '', nameAr: '', tagline: '', features: [],
      limitAgents: 5, limitChannels: 2, limitConversations: 5000, limitContacts: 1000,
      pricesPerCountry: defaults, popular: false, active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (p: Plan): void => {
    setEditing(p);
    setForm({
      tier: p.tier,
      name: p.name,
      nameAr: p.nameAr,
      tagline: p.tagline,
      features: [...p.features],
      limitAgents: p.limits.agents,
      limitChannels: p.limits.channels,
      limitConversations: p.limits.conversations,
      limitContacts: p.limits.contacts,
      pricesPerCountry: { ...p.pricesPerCountry },
      popular: p.popular ?? false,
      active: p.active,
    });
    setModalOpen(true);
  };

  const duplicate = (p: Plan): void => {
    const newPlan = addPlan({
      tier: p.tier,
      name: `${p.name} (Copy)`,
      nameAr: `${p.nameAr} (نسخة)`,
      tagline: p.tagline,
      features: [...p.features],
      limits: { ...p.limits },
      pricesPerCountry: { ...p.pricesPerCountry },
      active: false,
    });
    setCopiedId(newPlan.id);
    showToast(`تم إنشاء نسخة "${newPlan.nameAr}" — معطّلة، فعّلها من الأزرار السفلية`, 'success');
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
      active: form.active,
    };
    if (editing) {
      updatePlan(editing.id, payload);
      showToast('تم تحديث الباقة', 'success');
    } else {
      addPlan(payload);
      showToast('تمت إضافة الباقة', 'success');
    }
    setModalOpen(false);
  };

  const remove = async (p: Plan): Promise<void> => {
    const linkedClients = clients.filter((c) => c.planId === p.id);
    if (linkedClients.length > 0) {
      const otherPlans = plans.filter((pl) => pl.id !== p.id);
      if (otherPlans.length === 0) {
        showToast('لا يمكن الحذف — لا توجد باقة أخرى لنقل العملاء إليها', 'error');
        return;
      }
      setReassignModal({ plan: p, targetPlanId: otherPlans[0].id });
      return;
    }
    const ok = await confirm({ title: `حذف باقة ${p.nameAr}؟`, message: 'لا يمكن التراجع عن هذا الإجراء', variant: 'danger', confirmText: 'حذف' });
    if (ok) {
      deletePlan(p.id);
      showToast('تم الحذف', 'success');
    }
  };

  const confirmReassign = (): void => {
    if (!reassignModal) return;
    const { plan, targetPlanId } = reassignModal;
    const linkedClients = clients.filter((c) => c.planId === plan.id);
    linkedClients.forEach((c) => updateClient(c.id, { planId: targetPlanId }));
    deletePlan(plan.id);
    showToast(`تم نقل ${linkedClients.length} عميل وحذف الباقة`, 'success');
    setReassignModal(null);
  };

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

  const previewC = countries.find((c) => c.code === previewCountry);

  return (
    <TooltipProvider>
      <div className="p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">الباقات والأسعار</h2>
          <p className="text-sm text-muted-foreground">أدر الباقات والأسعار حسب الدولة</p>
        </div>


        {/* Plans table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 flex flex-wrap items-center gap-3 border-b border-border">
            <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as 'all' | PlanTier)}>
              <SelectTrigger className="h-9 w-[130px] rounded-lg text-sm">
                <SelectValue placeholder="كل الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                <SelectItem value="starter">مبتدئ</SelectItem>
                <SelectItem value="pro">احترافي</SelectItem>
                <SelectItem value="business">أعمال</SelectItem>
                <SelectItem value="enterprise">مؤسسات</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={(v) => setActiveFilter(v as 'all' | 'active' | 'inactive')}>
              <SelectTrigger className="h-9 w-[130px] rounded-lg text-sm">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="inactive">معطّلة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={previewCountry} onValueChange={setPreviewCountry}>
              <SelectTrigger className="w-[160px] h-9 rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.flag} {c.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1.5"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3.5" />
                مسح الفلاتر
                <Badge className="h-5 px-1.5 rounded-md bg-primary/15 text-primary border-transparent text-[10px]">
                  {activeFilterCount}
                </Badge>
              </Button>
            )}
            <Button onClick={openCreate} size="sm" className="h-9 rounded-lg ms-auto">
              <Plus className="h-4 w-4 me-2" /> باقة جديدة
            </Button>
          </div>

          {/* Empty state inside container */}
          {filteredPlans.length === 0 && (
            <div className="p-12 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-semibold mb-1">
                {plans.length === 0 ? 'لا توجد باقات بعد' : 'لا توجد نتائج مطابقة'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {plans.length === 0 ? 'ابدأ بإنشاء باقة جديدة لعملائك' : 'جرّب تعديل الفلاتر أعلاه'}
              </p>
              {plans.length === 0 ? (
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4 me-2" /> إنشاء أول باقة
                </Button>
              ) : (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 me-2" /> مسح الفلاتر
                </Button>
              )}
            </div>
          )}

          {filteredPlans.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-12">#</TableHead>
                    <TableHead className="text-start">الباقة</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-start">السعر ({previewC?.currency ?? '—'})</TableHead>
                    <TableHead className="text-center">الحدود</TableHead>
                    <TableHead className="text-center">الميزات</TableHead>
                    <TableHead className="text-center">العملاء</TableHead>
                    <TableHead className="text-center">MRR</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((p, idx) => {
                    const style = tierStyle[p.tier];
                    const price = p.pricesPerCountry[previewCountry] ?? { monthly: 0, yearly: 0 };
                    const clientCount = clients.filter((c) => c.planId === p.id).length;
                    const totalMrr = clients
                      .filter((c) => c.planId === p.id && c.status === 'active')
                      .reduce((acc, c) => acc + c.mrr, 0);
                    const yearlyDiscountPct = price.monthly > 0 && price.yearly > 0 && price.yearly < price.monthly * 12
                      ? Math.round(((price.monthly * 12 - price.yearly) / (price.monthly * 12)) * 100)
                      : 0;
                    const mrrCurrency = clients.find((c) => c.planId === p.id)?.currency ?? previewC?.currency ?? 'USD';
                    return (
                      <TableRow
                        key={p.id}
                        ref={(el) => { cardRefs.current[p.id] = el as unknown as HTMLDivElement; }}
                        className={cn(
                          !p.active && 'opacity-70',
                          copiedId === p.id && 'animate-copied-pulse'
                        )}
                      >
                        <TableCell className="text-center text-xs text-muted-foreground font-mono">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-0">
                            {p.popular && (
                              <Star className="h-4 w-4 text-primary fill-current shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className={cn('font-bold', style.text)}>{p.nameAr}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{p.tagline}</p>
                            </div>
                            <Badge variant={tierBadgeVariant[p.tier]} className="text-[10px] shrink-0">
                              {tierLabel[p.tier]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => { updatePlan(p.id, { active: !p.active }); showToast(p.active ? 'تم تعطيل الباقة' : 'تم تفعيل الباقة', 'success'); }}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors',
                              p.active
                                ? 'bg-success/10 text-success hover:bg-success/20'
                                : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            )}
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full', p.active ? 'bg-success' : 'bg-muted-foreground')} />
                            {p.active ? 'نشطة' : 'معطّلة'}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold whitespace-nowrap">
                              {formatMoney(price.monthly, previewC?.currency ?? 'USD')}
                              <span className="text-xs text-muted-foreground font-normal"> /شهر</span>
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatMoney(price.yearly, previewC?.currency ?? 'USD')} /سنة
                              {yearlyDiscountPct > 0 && (
                                <span className="text-emerald-600 font-semibold ms-1">-{yearlyDiscountPct}%</span>
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex flex-wrap items-center gap-1.5 text-xs justify-center">
                            <LimitPill icon={<Users className="h-3 w-3" />} value={p.limits.agents === -1 ? '∞' : p.limits.agents} />
                            <LimitPill icon={<MessageSquare className="h-3 w-3" />} value={p.limits.channels === -1 ? '∞' : p.limits.channels} />
                            <LimitPill icon={<Database className="h-3 w-3" />} value={p.limits.conversations === -1 ? '∞' : (p.limits.conversations / 1000) + 'K'} />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              >
                                <Check className="h-3 w-3" />
                                {p.features.length} ميزة
                              </button>
                            </PopoverTrigger>
                            <PopoverContent side="top" align="start" className="w-64 p-3">
                              <p className="text-xs font-semibold mb-2 text-muted-foreground">ميزات الباقة</p>
                              <ul className="space-y-1.5 text-sm max-h-64 overflow-y-auto">
                                {p.features.map((f, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{clientCount}</span>
                          <span className="text-xs text-muted-foreground"> عميل</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn('font-semibold', totalMrr > 0 ? 'text-emerald-600' : 'text-muted-foreground')}>
                            {totalMrr > 0 ? formatMoney(totalMrr, mrrCurrency) : '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-0.5 justify-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => openEdit(p)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>تعديل</TooltipContent>
                            </Tooltip>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                  aria-label="المزيد"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => duplicate(p)}>
                                  <Copy className="h-4 w-4 me-2" />
                                  تكرار
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    updatePlan(p.id, { popular: !p.popular });
                                    if (!p.popular) {
                                      plans.forEach((other) => {
                                        if (other.popular && other.id !== p.id) updatePlan(other.id, { popular: false });
                                      });
                                    }
                                  }}
                                >
                                  <Star className={cn('h-4 w-4 me-2', p.popular && 'fill-current text-primary')} />
                                  {p.popular ? 'إلغاء الأكثر شعبية' : 'تعيين الأكثر شعبية'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => remove(p)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>حذف</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Per-country pricing table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Globe2 className="h-5 w-5 text-primary" /> الأسعار حسب الدولة</h2>
                <p className="text-sm text-muted-foreground">مقارنة سريعة لجميع الباقات والدول</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start sticky start-0 bg-muted">الدولة</TableHead>
                    {plans.map((p) => (
                      <TableHead key={p.id} className="text-start">{p.nameAr}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.map((co) => (
                    <TableRow key={co.code}>
                      <TableCell className="sticky start-0 bg-card font-medium">
                        <span className="mx-1 text-lg">{co.flag}</span>
                        {co.nameAr}
                        <span className="text-sm text-muted-foreground mx-1">({co.currency})</span>
                      </TableCell>
                      {plans.map((p) => {
                        const price = p.pricesPerCountry[co.code];
                        return (
                          <TableCell key={p.id} className="font-mono">
                            {price ? formatMoney(price.monthly, co.currency) : '—'}
                            <span className="text-sm text-muted-foreground"> /شهر</span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? `تعديل: ${editing.nameAr}` : 'باقة جديدة'}</DialogTitle>
              <DialogDescription>
                {editing ? 'عدّل بيانات الباقة ثم اضغط حفظ' : 'أدخل بيانات الباقة الجديدة'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>الاسم بالعربية</Label>
                  <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="مثال: الاحترافي" />
                </div>
                <div className="space-y-2">
                  <Label>Name (EN)</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Pro" />
                </div>
                <div className="space-y-2">
                  <Label>الفئة (Tier)</Label>
                  <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v as PlanTier })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>وصف قصير (Tagline)</Label>
                <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="للشركات النامية" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>الميزات</Label>
                  <span className="text-xs text-muted-foreground">
                    {form.features.length} ميزة مفعّلة
                  </span>
                </div>
                <div className="space-y-3 rounded-xl border bg-muted/30 p-3 max-h-72 overflow-y-auto">
                  {FEATURE_CATALOG.map((group) => (
                    <div key={group.label} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <group.icon className="h-3.5 w-3.5" />
                        {group.label}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.items.map((feature) => {
                          const enabled = form.features.includes(feature);
                          return (
                            <label
                              key={feature}
                              className={cn(
                                'flex items-center justify-between gap-2 p-2.5 rounded-lg border bg-background cursor-pointer transition-colors',
                                enabled && 'border-primary/40 bg-primary/5'
                              )}
                            >
                              <span className="text-sm">{feature}</span>
                              <Switch checked={enabled} onCheckedChange={() => toggleFeature(feature)} />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>حد الموظفين (-1 = ∞)</Label>
                  <Input type="number" min={-1} value={form.limitAgents} onChange={(e) => setForm({ ...form, limitAgents: Number(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>حد القنوات (-1 = ∞)</Label>
                  <Input type="number" min={-1} value={form.limitChannels} onChange={(e) => setForm({ ...form, limitChannels: Number(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>محادثات/شهر (-1 = ∞)</Label>
                  <Input type="number" min={-1} value={form.limitConversations} onChange={(e) => setForm({ ...form, limitConversations: Number(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>جهات اتصال (-1 = ∞)</Label>
                  <Input type="number" min={-1} value={form.limitContacts} onChange={(e) => setForm({ ...form, limitContacts: Number(e.target.value) || 0 })} />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">الأسعار حسب الدولة</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
                  {countries.map((co) => {
                    const price = form.pricesPerCountry[co.code] ?? { monthly: 0, yearly: 0 };
                    return (
                      <div key={co.code} className="grid grid-cols-[auto_1fr_1fr] items-center gap-2 p-2.5 rounded-lg bg-muted">
                        <span className="font-medium whitespace-nowrap"><span className="text-lg me-1">{co.flag}</span>{co.code}</span>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            value={price.monthly}
                            onChange={(e) => setMonthlyPrice(co.code, Number(e.target.value) || 0)}
                            placeholder="شهري"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">/شهر {co.symbol}</span>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            value={price.yearly}
                            onChange={(e) => setForm({ ...form, pricesPerCountry: { ...form.pricesPerCountry, [co.code]: { ...price, yearly: Number(e.target.value) || 0 } } })}
                            placeholder="سنوي"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">/سنة</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

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
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
              <Button onClick={submit}>{editing ? 'حفظ' : 'إنشاء'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reassign clients before delete */}
        <Dialog open={!!reassignModal} onOpenChange={(open) => { if (!open) setReassignModal(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>نقل العملاء قبل الحذف</DialogTitle>
              <DialogDescription>
                {reassignModal && (
                  <>
                    باقة <span className="font-bold text-foreground">{reassignModal.plan.nameAr}</span> مرتبطة بـ{' '}
                    <span className="font-bold text-foreground">{clients.filter((c) => c.planId === reassignModal.plan.id).length}</span> عميل.
                    اختر باقة بديلة لنقلهم إليها، ثم سيتم حذف الباقة الأصلية.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            {reassignModal && (
              <div className="space-y-2 py-2">
                <Label>الباقة البديلة</Label>
                <Select
                  value={reassignModal.targetPlanId}
                  onValueChange={(v) => setReassignModal({ ...reassignModal, targetPlanId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.filter((pl) => pl.id !== reassignModal.plan.id).map((pl) => (
                      <SelectItem key={pl.id} value={pl.id}>
                        {pl.nameAr} ({tierLabel[pl.tier]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setReassignModal(null)}>إلغاء</Button>
              <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={confirmReassign}>
                نقل وحذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function LimitPill({ icon, value }: { icon: React.ReactNode; value: string | number }): JSX.Element {
  const isInfinite = value === '∞';
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-xs">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-semibold">{isInfinite ? <InfinityIcon className="h-3 w-3 inline" /> : value}</span>
    </span>
  );
}

function LimitChip({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }): JSX.Element {
  const isInfinite = value === '∞';
  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/60 dark:bg-black/20 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-bold">{isInfinite ? <InfinityIcon className="h-3.5 w-3.5 inline" /> : value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
