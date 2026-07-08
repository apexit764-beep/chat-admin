import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Copy,
  X,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';
import { useConfirm } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney } from '@/utils/money';
import { cn } from '@/lib/utils';
import type { Plan, PlanTier } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
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


const tierOrder: Record<PlanTier, number> = {
  starter: 0,
  pro: 1,
  business: 2,
  enterprise: 3,
};


export default function AdminPlans(): JSX.Element {
  const navigate = useNavigate();
  const plans = useAdminStore((s) => s.plans);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const addPlan = useAdminStore((s) => s.addPlan);
  const updatePlan = useAdminStore((s) => s.updatePlan);
  const deletePlan = useAdminStore((s) => s.deletePlan);
  const updateClient = useAdminStore((s) => s.updateClient);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFilterCount = activeFilter !== 'all' ? 1 : 0;

  const clearFilters = (): void => {
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
      if (activeFilter === 'active' && !p.active) return false;
      if (activeFilter === 'inactive' && p.active) return false;
      return true;
    }),
    [sortedPlans, activeFilter]
  );

  useEffect(() => {
    if (!copiedId) return;
    const el = cardRefs.current[copiedId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = setTimeout(() => setCopiedId(null), 1700);
    return () => clearTimeout(t);
  }, [copiedId]);

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
            <Button onClick={() => navigate('/plans/new')} size="sm" className="h-9 rounded-lg ms-auto">
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
                <Button onClick={() => navigate('/plans/new')}>
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
                    <TableHead className="text-center">الحدود</TableHead>
                    <TableHead className="text-center">الميزات</TableHead>
                    <TableHead className="text-center">العملاء</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((p, idx) => {
                    const style = tierStyle[p.tier];
                    const clientCount = clients.filter((c) => c.planId === p.id).length;
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
                            <div className="min-w-0">
                              <p className={cn('font-bold', style.text)}>{p.nameAr}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{p.tagline}</p>
                            </div>
                            {p.popular && (
                              <Star className="h-4 w-4 text-primary fill-current shrink-0" />
                            )}
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
                          <div className="flex items-center gap-0.5 justify-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => navigate(`/plans/${p.id}/edit`)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>تعديل</TooltipContent>
                            </Tooltip>
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
                        {pl.nameAr}
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

