import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Globe2,
  Download,
  FileText,
} from 'lucide-react';
import { subDays } from 'date-fns';
import { StatCard } from '@components/ui';
import { LineChart } from '@components/charts/LineChart';
import { DoughnutChart } from '@components/charts/DoughnutChart';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { approxUSD } from '@/utils/money';
import { downloadCsv, printAsPdf } from '@/utils/csv';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { cn } from '@/lib/utils';

export default function AdminReports(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const plans = useAdminStore((s) => s.plans);
  const countries = useAdminStore((s) => s.countries);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const showToast = useUIStore((s) => s.showToast);

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });

  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [clients]);
  const trialClients = useMemo(() => clients.filter((c) => c.status === 'trial'), [clients]);

  const mrrTotal = useMemo(() =>
    subscriptions.filter((s) => s.status === 'active').reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0),
    [subscriptions]
  );

  const arpu = activeClients.length ? Math.round(mrrTotal / activeClients.length) : 0;

  const churnCount = clients.filter((c) => c.status === 'cancelled').length;
  const churnRate = clients.length ? Math.round((churnCount / clients.length) * 100) : 0;

  // Plan distribution
  const planDist = useMemo(() =>
    plans.map((p) => ({
      label: p.nameAr,
      value: clients.filter((c) => c.planId === p.id).length,
      color: p.tier === 'starter' ? '#06B6D4' : p.tier === 'pro' ? '#2563EB' : p.tier === 'business' ? '#8B5CF6' : '#F59E0B',
    })).filter((p) => p.value > 0),
    [plans, clients]
  );

  // Status distribution
  const statusDist = useMemo(() => [
    { label: 'نشط', value: activeClients.length, color: '#10B981' },
    { label: 'تجريبي', value: trialClients.length, color: '#3B82F6' },
    { label: 'متأخر', value: clients.filter((c) => c.status === 'past_due').length, color: '#F59E0B' },
    { label: 'موقوف', value: clients.filter((c) => c.status === 'suspended').length, color: '#EF4444' },
    { label: 'ملغي', value: churnCount, color: '#6B7280' },
  ].filter((s) => s.value > 0), [clients, activeClients, trialClients, churnCount]);

  // Signups chart - derive from client joinedAt dates grouped by month
  const chartData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const now = new Date();
    const labels: string[] = [];
    const signups: number[] = [];
    const cancellations: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = m.getMonth();
      const year = m.getFullYear();
      labels.push(months[month]);
      signups.push(clients.filter((c) => {
        const d = new Date(c.joinedAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length);
      cancellations.push(clients.filter((c) => {
        if (c.status !== 'cancelled') return false;
        const d = new Date(c.lastActiveAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length);
    }
    return { labels, signups, cancellations };
  }, [clients]);

  // By country
  const byCountry = useMemo(() =>
    countries
      .map((co) => {
        const coClients = clients.filter((c) => c.country === co.code);
        return {
          country: co,
          count: coClients.length,
          revenue: coClients.reduce((acc, c) => acc + approxUSD(c.mrr, c.currency), 0),
          avgRevenue: coClients.length
            ? Math.round(coClients.reduce((acc, c) => acc + approxUSD(c.mrr, c.currency), 0) / coClients.length)
            : 0,
        };
      })
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count),
    [clients, countries]
  );

  // Funnel
  const paidCount = activeClients.length;
  const totalSignups = clients.length;

  const exportSummary = (): void => {
    downloadCsv(`reports-${new Date().toISOString().slice(0, 10)}.csv`, [
      { المقياس: 'إجمالي العملاء', القيمة: clients.length },
      { المقياس: 'نشطون', القيمة: activeClients.length },
      { المقياس: 'تجريبي', القيمة: trialClients.length },
      { المقياس: 'MRR (دولار)', القيمة: Math.round(mrrTotal) },
      { المقياس: 'ARPU (دولار)', القيمة: arpu },
      { المقياس: 'معدل التحويل', القيمة: `${clients.length ? Math.round((paidCount / clients.length) * 100) : 0}%` },
      { المقياس: 'معدل الإلغاء', القيمة: `${churnRate}%` },
    ]);
    showToast('تم تصدير الملخص', 'success');
  };

  const exportPdf = (): void => {
    const html = `
      <h1>تقرير أداء المنصة</h1>
      <p class="muted">${new Date().toLocaleDateString('ar-u-nu-latn')}</p>
      <table>
        <tr><td>MRR</td><td class="right"><strong>$${Math.round(mrrTotal).toLocaleString('en-US')}</strong></td></tr>
        <tr><td>ARPU</td><td class="right">$${arpu}</td></tr>
        <tr><td>معدل الإلغاء</td><td class="right">${churnRate}%</td></tr>
        <tr><td>إجمالي العملاء</td><td class="right">${clients.length}</td></tr>
        <tr><td>عملاء نشطون</td><td class="right">${activeClients.length}</td></tr>
      </table>
      <h2>الأداء حسب الدولة</h2>
      <table>
        <thead><tr><th>الدولة</th><th class="right">العملاء</th><th class="right">الإيراد الشهري</th><th class="right">متوسط الإيراد</th></tr></thead>
        <tbody>
          ${byCountry.map((x) => `<tr><td>${x.country.flag} ${x.country.nameAr}</td><td class="right">${x.count}</td><td class="right">$${Math.round(x.revenue).toLocaleString('en-US')}</td><td class="right">$${x.avgRevenue}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
    printAsPdf('تقرير أداء المنصة', html);
    showToast('جاري تجهيز PDF...', 'info');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">التقارير</h2>
        <p className="text-sm text-muted-foreground">تقارير وإحصائيات مفصّلة</p>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportSummary}>
              <Download className="h-4 w-4 me-1.5" /> تصدير CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <FileText className="h-4 w-4 me-1.5" /> تصدير PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="الإيراد الشهري"
          value={`$${Math.round(mrrTotal).toLocaleString('en-US')}`}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
        <StatCard
          label="متوسط الإيراد للعميل"
          value={`$${arpu}`}
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-primary/15"
          iconColor="text-primary"
        />
        <StatCard
          label="إجمالي العملاء"
          value={clients.length}
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-info/15"
          iconColor="text-info"
        />
        <StatCard
          label="معدل الإلغاء"
          value={`${churnRate}%`}
          icon={<TrendingDown className="h-4 w-4" />}
          iconBg="bg-danger/15"
          iconColor="text-danger"
        />
      </div>

      {/* Signups chart + Conversion funnel side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">الاشتراكات مقابل الإلغاءات</CardTitle>
                <CardDescription className="text-xs">آخر 6 أشهر</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success" /> اشتراكات</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-danger" /> إلغاءات</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              labels={chartData.labels}
              series={[
                { name: 'اشتراكات', color: '#10B981', data: chartData.signups },
                { name: 'إلغاءات', color: '#EF4444', data: chartData.cancellations },
              ]}
              height={180}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">مسار التحويل</CardTitle>
            <CardDescription className="text-xs">توزيع العملاء على الباقات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FunnelStep label="إجمالي المسجلين" value={totalSignups} color="bg-info" share={100} />
            {planDist.map((p) => (
              <FunnelStep
                key={p.label}
                label={p.label}
                value={p.value}
                color=""
                colorHex={p.color}
                share={totalSignups ? (p.value / totalSignups) * 100 : 0}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Doughnuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">توزيع الباقات</CardTitle>
            <CardDescription>حسب عدد العملاء المشتركين</CardDescription>
          </CardHeader>
          <CardContent>
            <DoughnutChart size={200} data={planDist} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">حالة العملاء</CardTitle>
            <CardDescription>توزيع الحالات الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <DoughnutChart size={200} data={statusDist} />
          </CardContent>
        </Card>
      </div>

      {/* By country */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-5 w-5 text-primary" />
            الأداء حسب الدولة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start w-12">#</TableHead>
                <TableHead className="text-start">الدولة</TableHead>
                <TableHead className="text-start">عدد العملاء</TableHead>
                <TableHead className="text-start">الإيراد الشهري</TableHead>
                <TableHead className="text-start">متوسط الإيراد للعميل</TableHead>
                <TableHead className="text-start">حصة السوق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCountry.map((x, idx) => {
                const share = clients.length ? (x.count / clients.length) * 100 : 0;
                return (
                  <TableRow key={x.country.code}>
                    <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{x.country.flag}</span>
                        <span className="font-medium">{x.country.nameAr}</span>
                        <span className="text-xs text-muted-foreground">{x.country.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{x.count}</TableCell>
                    <TableCell className="font-semibold text-success">${Math.round(x.revenue).toLocaleString('en-US')}</TableCell>
                    <TableCell>${x.avgRevenue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={share} className="flex-1 h-1.5" />
                        <span className="text-xs font-medium text-muted-foreground w-8">{Math.round(share)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}

function FunnelStep({ label, value, color, colorHex, share }: { label: string; value: number; color: string; colorHex?: string; share: number }): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <p className="w-10 text-[10px] text-muted-foreground text-start">{share.toFixed(1)}%</p>
      <div className="flex-1 h-7 rounded-lg bg-muted overflow-hidden relative">
        <div
          className={cn('h-full rounded-lg transition-all', color)}
          style={{ width: `${Math.max(share, 2)}%`, ...(colorHex ? { backgroundColor: colorHex } : {}) }}
        />
        <div className="absolute inset-0 flex items-center justify-end px-2">
          <span className="text-xs font-bold text-foreground">
            {value.toLocaleString('en-US')}
          </span>
        </div>
      </div>
      <p className="w-24 text-xs font-medium text-end truncate">{label}</p>
    </div>
  );
}
