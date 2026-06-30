import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Users,
  MessageSquare,
  Database,
  Infinity as InfinityIcon,
  Globe2,
  Power,
  Copy,
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
import { Textarea } from '@/components/ui/textarea';
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

export default function AdminPlans(): JSX.Element {
  const plans = useAdminStore((s) => s.plans);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const addPlan = useAdminStore((s) => s.addPlan);
  const updatePlan = useAdminStore((s) => s.updatePlan);
  const deletePlan = useAdminStore((s) => s.deletePlan);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [previewCountry, setPreviewCountry] = useState('OM');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<{
    tier: PlanTier;
    name: string;
    nameAr: string;
    tagline: string;
    features: string;
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
    features: '',
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
      tier: 'pro', name: '', nameAr: '', tagline: '', features: '',
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
      features: p.features.join('\n'),
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
    showToast(`تم إنشاء نسخة: ${newPlan.nameAr}`, 'success');
  };

  const submit = (): void => {
    if (!form.name.trim() || !form.nameAr.trim()) {
      showToast('الاسم بالعربية والإنجليزية مطلوبان', 'error');
      return;
    }
    const features = form.features.split('\n').map((f) => f.trim()).filter(Boolean);
    const payload = {
      tier: form.tier,
      name: form.name,
      nameAr: form.nameAr,
      tagline: form.tagline,
      features,
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
    const count = clients.filter((c) => c.planId === p.id).length;
    if (count > 0) {
      showToast(`لا يمكن الحذف — ${count} عميل مرتبط بهذه الباقة`, 'error');
      return;
    }
    const ok = await confirm({ title: `حذف باقة ${p.nameAr}؟`, message: 'لا يمكن التراجع عن هذا الإجراء', variant: 'danger', confirmText: 'حذف' });
    if (ok) {
      deletePlan(p.id);
      showToast('تم الحذف', 'success');
    }
  };

  const previewC = countries.find((c) => c.code === previewCountry);

  return (
    <TooltipProvider>
      <div className="p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">الباقات والأسعار</h2>
            <p className="text-sm text-muted-foreground">أدر الباقات والأسعار حسب الدولة</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={previewCountry} onValueChange={setPreviewCountry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.flag} {c.nameAr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openCreate} className="rounded-full">
              <Plus className="h-4 w-4 me-2" /> باقة جديدة
            </Button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((p) => {
            const style = tierStyle[p.tier];
            const price = p.pricesPerCountry[previewCountry] ?? { monthly: 0, yearly: 0 };
            const clientCount = clients.filter((c) => c.planId === p.id).length;
            const totalMrr = clients
              .filter((c) => c.planId === p.id && c.status === 'active')
              .reduce((acc, c) => acc + c.mrr, 0);

            return (
              <Card
                key={p.id}
                className={cn(
                  'relative bg-gradient-to-br p-0 transition-all hover:shadow-lg',
                  style.bg,
                  p.popular ? `ring-2 ${style.ring}` : 'border',
                  !p.active && 'opacity-60'
                )}
              >
                {p.popular && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-lg z-10">
                    <Star className="h-3 w-3 fill-current" />
                    الأكثر شعبية
                  </span>
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className={cn('text-xl font-extrabold', style.text)}>{p.nameAr}</h3>
                    <Badge variant={tierBadgeVariant[p.tier]}>{p.tier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">{p.tagline}</p>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Pricing */}
                  <div className="pb-3">
                    <p className="text-3xl font-extrabold">
                      {formatMoney(price.monthly, previewC?.currency ?? 'USD')}
                      <span className="text-sm font-medium text-muted-foreground"> / شهر</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {formatMoney(price.yearly, previewC?.currency ?? 'USD')} سنوياً (وفّر شهرين)
                    </p>
                  </div>

                  <Separator />

                  {/* Limits */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <LimitChip icon={<Users className="h-3.5 w-3.5" />} value={p.limits.agents === -1 ? '∞' : p.limits.agents} label="موظف" />
                    <LimitChip icon={<MessageSquare className="h-3.5 w-3.5" />} value={p.limits.channels === -1 ? '∞' : p.limits.channels} label="قناة" />
                    <LimitChip icon={<MessageSquare className="h-3.5 w-3.5" />} value={p.limits.conversations === -1 ? '∞' : (p.limits.conversations / 1000) + 'K'} label="محادثة" />
                    <LimitChip icon={<Database className="h-3.5 w-3.5" />} value={p.limits.contacts === -1 ? '∞' : p.limits.contacts} label="جهة اتصال" />
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 text-sm">
                    {p.features.slice(0, 6).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {p.features.length > 6 && (
                      <li className="text-sm text-muted-foreground">
                        +{p.features.length - 6} ميزة أخرى
                      </li>
                    )}
                  </ul>

                  <Separator />

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">{clientCount}</p>
                      <p className="text-[10px] text-muted-foreground">عميل مشترك</p>
                    </div>
                    <div className="text-end">
                      <p className="text-lg font-bold text-emerald-500">{totalMrr > 0 ? formatMoney(totalMrr, clients.find((c) => c.planId === p.id)?.currency ?? 'USD') : '—'}</p>
                      <p className="text-[10px] text-muted-foreground">MRR</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center gap-1 pt-0">
                  <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => openEdit(p)}>
                    <Edit2 className="h-3.5 w-3.5 me-1.5" /> تعديل
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => duplicate(p)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>نسخ</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => { updatePlan(p.id, { active: !p.active }); showToast(p.active ? 'تم تعطيل الباقة' : 'تم تفعيل الباقة', 'success'); }}>
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{p.active ? 'تعطيل' : 'تفعيل'}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 hover:text-destructive" onClick={() => remove(p)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>حذف</TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            );
          })}
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

              <div className="space-y-2">
                <Label>الميزات (كل ميزة في سطر)</Label>
                <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={6} placeholder={'حتى 10 موظفين\n3 أرقام واتساب\n...'} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>حد الموظفين (-1 = ∞)</Label>
                  <Input type="number" value={form.limitAgents} onChange={(e) => setForm({ ...form, limitAgents: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>حد القنوات (-1 = ∞)</Label>
                  <Input type="number" value={form.limitChannels} onChange={(e) => setForm({ ...form, limitChannels: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>محادثات/شهر (-1 = ∞)</Label>
                  <Input type="number" value={form.limitConversations} onChange={(e) => setForm({ ...form, limitConversations: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>جهات اتصال (-1 = ∞)</Label>
                  <Input type="number" value={form.limitContacts} onChange={(e) => setForm({ ...form, limitContacts: Number(e.target.value) })} />
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
                            value={price.monthly}
                            onChange={(e) => setForm({ ...form, pricesPerCountry: { ...form.pricesPerCountry, [co.code]: { ...price, monthly: Number(e.target.value) } } })}
                            placeholder="شهري"
                            className="font-mono"
                          />
                          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">/شهر {co.symbol}</span>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            value={price.yearly}
                            onChange={(e) => setForm({ ...form, pricesPerCountry: { ...form.pricesPerCountry, [co.code]: { ...price, yearly: Number(e.target.value) } } })}
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
      </div>
    </TooltipProvider>
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
