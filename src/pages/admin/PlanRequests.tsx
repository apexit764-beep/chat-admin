import { useMemo, useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Trash2,
  ClipboardList,
  ChevronDown,
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { useConfirm, StatCard } from '@components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { PlanRequest, PlanRequestStatus } from '@/types';

const STATUS_MAP: Record<PlanRequestStatus, { label: string; color: string }> = {
  new: { label: 'جديد', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400' },
  contacted: { label: 'تم التواصل', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
};


function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function AdminPlanRequests({ embedded }: { embedded?: boolean }): JSX.Element {
  const planRequests = useAdminStore((s) => s.planRequests);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const updateStatus = useAdminStore((s) => s.updatePlanRequestStatus);
  const deleteRequest = useAdminStore((s) => s.deletePlanRequest);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlanRequestStatus | 'all'>('all');
  const [viewing, setViewing] = useState<PlanRequest | null>(null);

  const filtered = useMemo(() => {
    let list = [...planRequests];
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.contactName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.companyName?.toLowerCase().includes(q) ?? false)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [planRequests, statusFilter, search]);

  const newCount = planRequests.filter((r) => r.status === 'new').length;
  const contactedCount = planRequests.filter((r) => r.status === 'contacted').length;

  const getPlan = (id: string) => plans.find((p) => p.id === id);
  const getCountry = (code: string) => countries.find((c) => c.code === code);

  const handleStatusChange = (id: string, status: PlanRequestStatus) => {
    updateStatus(id, status);
    showToast('تم تحديث الحالة', 'success');
  };

  const handleDelete = async (r: PlanRequest) => {
    const ok = await confirm({
      title: 'حذف الطلب',
      message: `هل تريد حذف طلب "${r.contactName}"؟`,
    });
    if (!ok) return;
    deleteRequest(r.id);
    showToast('تم حذف الطلب', 'success');
  };

  const content = (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="إجمالي الطلبات"
          value={planRequests.length}
          icon={<ClipboardList className="h-5 w-5" />}
          iconBg="bg-primary/15"
          iconColor="text-primary"
        />
        <StatCard
          label="طلبات جديدة"
          value={newCount}
          icon={<Eye className="h-5 w-5" />}
          iconBg="bg-info/15"
          iconColor="text-info"
        />
        <StatCard
          label="تم التواصل"
          value={contactedCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في طلبات الاشتراك..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pe-9"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'new', 'contacted'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {s === 'all' ? 'الكل' : STATUS_MAP[s].label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">قائمة الطلبات</CardTitle>
          <CardDescription>عرض {filtered.length} من {planRequests.length} طلب</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start w-12">#</TableHead>
                <TableHead className="text-start">الاسم</TableHead>
                <TableHead className="text-start">البريد الإلكتروني</TableHead>
                <TableHead className="text-start">رقم الهاتف</TableHead>
                <TableHead className="text-start">الباقة</TableHead>
                <TableHead className="text-start">الموظفين</TableHead>
                <TableHead className="text-start">القنوات</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead className="text-start w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r, idx) => {
                const plan = getPlan(r.planId);
                const country = getCountry(r.country);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{r.contactName}</p>
                        {r.companyName && (
                          <p className="text-xs text-muted-foreground">{r.companyName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{r.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {country && <span className="text-base">{country.flag}</span>}
                        <span className="text-sm font-mono" dir="ltr">{r.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {plan?.nameAr ?? r.planId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {plan?.limits.agents === -1 ? '∞' : plan?.limits.agents ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {plan?.limits.channels === -1 ? '∞' : plan?.limits.channels ?? '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors', STATUS_MAP[r.status].color)}>
                            {STATUS_MAP[r.status].label}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {(Object.keys(STATUS_MAP) as PlanRequestStatus[]).map((s) => (
                            <DropdownMenuItem key={s} onClick={() => handleStatusChange(r.id, s)} disabled={r.status === s}>
                              {STATUS_MAP[s].label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewing(r)}>
                            <Eye className="h-4 w-4 me-2" /> عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(r)}>
                            <Trash2 className="h-4 w-4 me-2" /> حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        {viewing && (
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفاصيل الطلب</DialogTitle>
            </DialogHeader>
            <RequestDetail
              request={viewing}
              plan={getPlan(viewing.planId)}
              country={getCountry(viewing.country)}
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );

  if (embedded) {
    return <div className="space-y-5">{content}</div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">طلبات الاشتراك</h2>
        <p className="text-sm text-muted-foreground">طلبات الترقية والاشتراك الجديدة من العملاء</p>
      </div>
      {content}
    </div>
  );
}

function RequestDetail({
  request: r,
  plan,
  country,
}: {
  request: PlanRequest;
  plan: ReturnType<typeof Array.prototype.find>;
  country: ReturnType<typeof Array.prototype.find>;
}): JSX.Element {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', STATUS_MAP[r.status].color)}>
          {STATUS_MAP[r.status].label}
        </span>
        <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="اسم المسؤول" value={r.contactName} />
        {r.companyName && <Field label="اسم الشركة" value={r.companyName} />}
        <Field label="البريد الإلكتروني" value={r.email} />
        <Field label="رقم الاتصال" value={r.phone} dir="ltr" />
        {r.whatsapp && <Field label="رقم واتساب" value={r.whatsapp} dir="ltr" />}
        <Field label="الدولة" value={country ? `${country.flag} ${country.nameAr}` : r.country} />
        <Field label="الباقة المطلوبة" value={plan?.nameAr ?? r.planId} />
        <Field label="حد الموظفين" value={plan?.limits.agents === -1 ? 'غير محدود' : String(plan?.limits.agents ?? '—')} />
        <Field label="حد القنوات" value={plan?.limits.channels === -1 ? 'غير محدود' : String(plan?.limits.channels ?? '—')} />
      </div>

      {r.notes && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">ملاحظات</p>
          <p className="text-sm bg-muted rounded-lg p-3">{r.notes}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        تاريخ الإرسال: {new Date(r.createdAt).toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

function Field({ label, value, dir }: { label: string; value: string; dir?: string }): JSX.Element {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium" dir={dir}>{value}</p>
    </div>
  );
}
