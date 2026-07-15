import { useState, useMemo } from 'react';
import {
  Activity,
  UserPlus,
  UserMinus,
  UserX,
  UserCheck,
  Package,
  CreditCard,
  LogIn,
  LogOut,
  Settings,
  Shield,
  RefreshCcw,
  XCircle,
  Download,
  Filter,
} from 'lucide-react';
import { subDays } from 'date-fns';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { timeAgo } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { cn } from '@/lib/utils';
import type { ActivityAction } from '@/store/adminMockData';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const actionMeta: Record<ActivityAction, { label: string; icon: React.ElementType; color: string }> = {
  client_created: { label: 'عميل جديد', icon: UserPlus, color: 'text-emerald-500 bg-emerald-500/10' },
  client_suspended: { label: 'إيقاف عميل', icon: UserX, color: 'text-amber-500 bg-amber-500/10' },
  client_reactivated: { label: 'إعادة تفعيل', icon: UserCheck, color: 'text-blue-500 bg-blue-500/10' },
  client_deleted: { label: 'حذف عميل', icon: UserMinus, color: 'text-red-500 bg-red-500/10' },
  plan_created: { label: 'باقة جديدة', icon: Package, color: 'text-violet-500 bg-violet-500/10' },
  plan_updated: { label: 'تحديث باقة', icon: Package, color: 'text-violet-500 bg-violet-500/10' },
  plan_deleted: { label: 'حذف باقة', icon: Package, color: 'text-red-500 bg-red-500/10' },
  subscription_created: { label: 'اشتراك جديد', icon: CreditCard, color: 'text-emerald-500 bg-emerald-500/10' },
  subscription_cancelled: { label: 'إلغاء اشتراك', icon: XCircle, color: 'text-red-500 bg-red-500/10' },
  invoice_refunded: { label: 'استرداد فاتورة', icon: RefreshCcw, color: 'text-amber-500 bg-amber-500/10' },
  payment_received: { label: 'دفعة مستلمة', icon: CreditCard, color: 'text-emerald-500 bg-emerald-500/10' },
  admin_login: { label: 'تسجيل دخول', icon: LogIn, color: 'text-blue-500 bg-blue-500/10' },
  admin_logout: { label: 'تسجيل خروج', icon: LogOut, color: 'text-slate-500 bg-slate-500/10' },
  admin_user_added: { label: 'إضافة مدير', icon: UserPlus, color: 'text-violet-500 bg-violet-500/10' },
  admin_user_removed: { label: 'حذف مدير', icon: UserMinus, color: 'text-red-500 bg-red-500/10' },
  settings_updated: { label: 'تحديث إعدادات', icon: Settings, color: 'text-slate-500 bg-slate-500/10' },
  paymob_updated: { label: 'تحديث بوابة الدفع', icon: Shield, color: 'text-amber-500 bg-amber-500/10' },
};

type ActionFilter = 'all' | 'clients' | 'billing' | 'admin' | 'settings';

const filterGroups: Record<ActionFilter, { label: string; actions: ActivityAction[] }> = {
  all: { label: 'الكل', actions: [] },
  clients: { label: 'العملاء', actions: ['client_created', 'client_suspended', 'client_reactivated', 'client_deleted'] },
  billing: { label: 'المالية', actions: ['subscription_created', 'subscription_cancelled', 'invoice_refunded', 'payment_received', 'plan_created', 'plan_updated', 'plan_deleted'] },
  admin: { label: 'المديرون', actions: ['admin_login', 'admin_logout', 'admin_user_added', 'admin_user_removed'] },
  settings: { label: 'الإعدادات', actions: ['settings_updated', 'paymob_updated'] },
};

export default function AdminActivityLog(): JSX.Element {
  const activityLog = useAdminStore((s) => s.activityLog);
  const showToast = useUIStore((s) => s.showToast);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ActionFilter>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filtered = useMemo(() => {
    let list = [...activityLog];
    if (dateRange) {
      const from = dateRange.from.getTime();
      const to = dateRange.to.getTime() + 86400000 - 1;
      list = list.filter((e) => {
        const t = Date.parse(e.timestamp);
        return t >= from && t <= to;
      });
    }
    if (filter !== 'all') {
      const actions = filterGroups[filter].actions;
      list = list.filter((e) => actions.includes(e.action));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.actor.toLowerCase().includes(q) ||
          (e.target?.toLowerCase().includes(q)) ||
          (e.details?.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activityLog, filter, search, dateRange]);

  const exportLog = (): void => {
    downloadCsv(`activity-log-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((e) => ({
        Action: actionMeta[e.action].label,
        Actor: e.actor,
        Email: e.actorEmail,
        Target: e.target ?? '',
        Details: e.details ?? '',
        IP: e.ip ?? '',
        Timestamp: e.timestamp,
      }))
    );
    showToast('تم تصدير سجل النشاط', 'success');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">سجل النشاط</h2>
        <p className="text-sm text-muted-foreground">تتبع إجراءات فريق الإدارة</p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                سجل النشاط
              </CardTitle>
              <CardDescription className="mt-1">
                تتبع جميع الإجراءات في لوحة الإدارة
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportLog}>
              <Download className="h-4 w-4" /> تصدير CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              placeholder="بحث بالاسم أو الهدف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filter} onValueChange={(v) => setFilter(v as ActionFilter)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 me-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(filterGroups).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Badge variant="secondary" className="text-xs">
              {filtered.length} سجل
            </Badge>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Activity className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute start-[22px] top-0 bottom-0 w-px bg-border/50" />
              <div className="space-y-1">
                {filtered.map((entry) => {
                  const meta = actionMeta[entry.action];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={entry.id}
                      className="relative flex items-start gap-3 py-3 ps-0 pe-2 rounded-lg hover:bg-muted/40 transition-colors"
                    >
                      <div className={cn('relative z-10 flex-shrink-0 flex items-center justify-center h-[44px] w-[44px] rounded-xl', meta.color)}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-foreground">{entry.actor}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium">
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/80 mt-0.5">
                          {entry.target && <span className="font-medium">{entry.target}</span>}
                          {entry.target && entry.details && ' — '}
                          {entry.details && <span className="text-muted-foreground">{entry.details}</span>}
                          {!entry.target && !entry.details && (
                            <span className="text-muted-foreground">{meta.label}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-muted-foreground/60">{timeAgo(entry.timestamp)}</span>
                          {entry.ip && (
                            <span className="text-[11px] text-muted-foreground/40 font-mono">{entry.ip}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
