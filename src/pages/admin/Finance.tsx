import { useMemo, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  FileText,
  RefreshCcw,
  CreditCard,
  ArrowDownToLine,
} from 'lucide-react';
import { StatCard, useConfirm } from '@components/ui';
import { LineChart } from '@components/charts/LineChart';
import { BarChart } from '@components/charts/BarChart';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney, approxUSD } from '@/utils/money';
import { formatDate, timeAgo } from '@/utils/format';
import { downloadCsv, printAsPdf } from '@/utils/csv';
import { cn } from '@/lib/utils';
import type { Invoice, InvoiceStatus, Transaction, TransactionStatus } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const invStatusLabel: Record<InvoiceStatus, string> = {
  draft: 'مسودة',
  pending: 'معلّقة',
  paid: 'مدفوعة',
  failed: 'فشلت',
  refunded: 'مرتجعة',
};

const invStatusVariant: Record<InvoiceStatus, 'secondary' | 'warning' | 'success' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  pending: 'warning',
  paid: 'success',
  failed: 'destructive',
  refunded: 'outline',
};

const txnStatusLabel: Record<TransactionStatus, string> = {
  succeeded: 'نجحت',
  failed: 'فشلت',
  pending: 'معلّقة',
  refunded: 'مرتجعة',
};

const txnStatusVariant: Record<TransactionStatus, 'success' | 'destructive' | 'warning' | 'outline'> = {
  succeeded: 'success',
  failed: 'destructive',
  pending: 'warning',
  refunded: 'outline',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
}

export default function AdminFinance(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const invoices = useAdminStore((s) => s.invoices);
  const transactions = useAdminStore((s) => s.transactions);
  const countries = useAdminStore((s) => s.countries);
  const subscriptions = useAdminStore((s) => s.subscriptions);
  const refundInvoice = useAdminStore((s) => s.refundInvoice);
  const showToast = useUIStore((s) => s.showToast);
  const { confirm } = useConfirm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  const mrr = useMemo(() => subscriptions.filter((s) => s.status === 'active').reduce((acc, s) => acc + approxUSD(s.amount, s.currency), 0), [subscriptions]);

  const paidThisMonth = useMemo(() =>
    transactions
      .filter((t) => t.status === 'succeeded' && new Date(t.createdAt).getMonth() === new Date().getMonth())
      .reduce((acc, t) => acc + approxUSD(t.amount, t.currency), 0),
    [transactions]
  );

  const failedThisMonth = transactions.filter((t) => t.status === 'failed' && new Date(t.createdAt).getMonth() === new Date().getMonth()).length;
  const successRate = (() => {
    const total = transactions.length;
    const succ = transactions.filter((t) => t.status === 'succeeded').length;
    return total ? Math.round((succ / total) * 100) : 0;
  })();

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (search) {
      const client = clients.find((c) => c.id === inv.clientId);
      if (!inv.number.includes(search) && !(client?.companyName.includes(search) ?? false)) return false;
    }
    return true;
  });

  const revenueLabels = ['ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'];
  const revenueData = [1840, 2120, 2450, 2810, 3120, Math.round(mrr)];

  const revenueByCountry = countries.map((co) => ({
    country: co,
    revenue: clients.filter((c) => c.country === co.code).reduce((acc, c) => acc + approxUSD(c.mrr, c.currency), 0),
  })).filter((x) => x.revenue > 0).sort((a, b) => b.revenue - a.revenue);

  const handleExportInvoices = (): void => {
    downloadCsv(
      `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredInvoices.map((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        return {
          'رقم الفاتورة': inv.number,
          'العميل': client?.companyName ?? '—',
          'المبلغ': inv.amount,
          'الضريبة': inv.tax,
          'الإجمالي': inv.total,
          'العملة': inv.currency,
          'الحالة': invStatusLabel[inv.status],
          'تاريخ الاستحقاق': formatDate(inv.dueDate),
          'تاريخ الدفع': inv.paidAt ? formatDate(inv.paidAt) : '—',
        };
      })
    );
    showToast(`تم تصدير ${filteredInvoices.length} فاتورة`, 'success');
  };

  const handleDownloadInvoice = (inv: Invoice): void => {
    const client = clients.find((c) => c.id === inv.clientId);
    const html = `
      <h1>فاتورة #${inv.number}</h1>
      <p class="muted">${formatDate(inv.createdAt)}</p>
      <h3>إلى: ${client?.companyName ?? ''}</h3>
      <p class="muted">${client?.email ?? ''} · ${client?.phone ?? ''}</p>
      <table>
        <thead><tr><th>البيان</th><th class="right">الكمية</th><th class="right">السعر</th><th class="right">المجموع</th></tr></thead>
        <tbody>
          ${inv.items.map((it) => `<tr><td>${it.description}</td><td class="right">${it.quantity}</td><td class="right">${formatMoney(it.unitPrice, inv.currency)}</td><td class="right">${formatMoney(it.total, inv.currency)}</td></tr>`).join('')}
        </tbody>
      </table>
      <table>
        <tr><td>المجموع</td><td class="right">${formatMoney(inv.amount, inv.currency)}</td></tr>
        <tr><td>ضريبة 5%</td><td class="right">${formatMoney(inv.tax, inv.currency)}</td></tr>
        <tr><td><strong>الإجمالي المستحق</strong></td><td class="right"><strong>${formatMoney(inv.total, inv.currency)}</strong></td></tr>
      </table>
      <p class="muted">الحالة: ${invStatusLabel[inv.status]} ${inv.paidAt ? ` · مدفوعة في ${formatDate(inv.paidAt)}` : ''}</p>
      <p class="muted">شكراً لتعاملك مع Apex Solutions</p>
    `;
    printAsPdf(`Invoice ${inv.number}`, html);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">المالية</h2>
        <p className="text-sm text-muted-foreground">المعاملات المالية والفواتير</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR (USD)" value={`$${Math.round(mrr).toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" trend={{ value: 18, positive: true }} />
        <StatCard label="مقبوض هذا الشهر" value={`$${Math.round(paidThisMonth).toLocaleString()}`} icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" />
        <StatCard label="فشلت" value={failedThisMonth} icon={<AlertTriangle className="h-5 w-5" />} iconBg="bg-danger/15" iconColor="text-danger" />
        <StatCard label="نسبة النجاح" value={`${successRate}%`} icon={<TrendingUp className="h-5 w-5" />} iconBg="bg-info/15" iconColor="text-info" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices" dir="rtl">
        <TabsList>
          <TabsTrigger value="invoices">الفواتير ({invoices.length})</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات ({transactions.length})</TabsTrigger>
          <TabsTrigger value="revenue">تحليلات الإيرادات</TabsTrigger>
        </TabsList>

        {/* Invoices */}
        <TabsContent value="invoices">
          <Card className="overflow-hidden">
            <CardHeader className="flex-row flex-wrap items-center gap-3 border-b justify-start">
              <div className="relative w-64">
                <Search className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="بحث برقم الفاتورة أو الشركة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pe-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | InvoiceStatus)}>
                <SelectTrigger className="w-auto min-w-[140px] h-9">
                  <SelectValue placeholder="كل الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="paid">مدفوعة</SelectItem>
                  <SelectItem value="pending">معلّقة</SelectItem>
                  <SelectItem value="failed">فشلت</SelectItem>
                  <SelectItem value="refunded">مرتجعة</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExportInvoices} className="h-9 ms-auto">
                <Download className="h-4 w-4 me-2" /> CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start w-12">#</TableHead>
                      <TableHead className="text-start">رقم الفاتورة</TableHead>
                      <TableHead className="text-start">العميل</TableHead>
                      <TableHead className="text-start hidden md:table-cell">الإجمالي</TableHead>
                      <TableHead className="text-start hidden lg:table-cell">تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-start">الحالة</TableHead>
                      <TableHead className="text-start w-1">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((inv, idx) => {
                      const client = clients.find((c) => c.id === inv.clientId);
                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                          <TableCell className="font-mono font-semibold">{inv.number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 text-xs">
                                <AvatarFallback>{getInitials(client?.companyName ?? '?')}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{client?.companyName ?? '—'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-semibold">{formatMoney(inv.total, inv.currency)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                          <TableCell>
                            <Badge variant={invStatusVariant[inv.status]}>
                              {invStatusLabel[inv.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" title="طباعة PDF" onClick={() => handleDownloadInvoice(inv)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                              {inv.status === 'paid' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="استرجاع"
                                  onClick={() => {
                                    void (async () => {
                                      const ok = await confirm({ title: `استرجاع فاتورة ${inv.number}؟`, message: `سيتم إرجاع ${inv.total} ${inv.currency} للعميل`, variant: 'warning', confirmText: 'استرجاع' });
                                      if (ok) {
                                        refundInvoice(inv.id);
                                        showToast('تم استرجاع الفاتورة', 'success');
                                      }
                                    })();
                                  }}
                                >
                                  <RefreshCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredInvoices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">لا توجد فواتير</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions">
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between border-b">
              <CardTitle>سجل المعاملات (Paymob)</CardTitle>
              <CardDescription>{transactions.length} معاملة</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start w-12">#</TableHead>
                      <TableHead className="text-start">Transaction ID</TableHead>
                      <TableHead className="text-start">العميل</TableHead>
                      <TableHead className="text-start">المبلغ</TableHead>
                      <TableHead className="text-start hidden lg:table-cell">البطاقة</TableHead>
                      <TableHead className="text-start hidden md:table-cell">الحالة</TableHead>
                      <TableHead className="text-start">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 100).map((t, idx) => {
                      const client = clients.find((c) => c.id === t.clientId);
                      return (
                        <TableRow key={t.id}>
                          <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                          <TableCell className="font-mono text-sm">{t.paymobTransactionId}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 text-xs">
                                <AvatarFallback>{getInitials(client?.companyName ?? '?')}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium truncate">{client?.companyName ?? '—'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{formatMoney(t.amount, t.currency)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="font-mono text-sm">VISA •••• {t.last4}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={txnStatusVariant[t.status]} className="gap-1">
                              {t.status === 'succeeded' ? <CheckCircle2 className="h-3 w-3" /> : t.status === 'failed' ? <AlertTriangle className="h-3 w-3" /> : null}
                              {txnStatusLabel[t.status]}
                            </Badge>
                            {t.failureReason && <p className="text-[10px] text-muted-foreground mt-0.5">{t.failureReason}</p>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{timeAgo(t.createdAt)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue analytics */}
        <TabsContent value="revenue">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>نمو الإيرادات</CardTitle>
                <CardDescription>آخر 6 أشهر بالدولار</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart labels={revenueLabels} series={[{ name: 'الإيرادات', color: '#2563EB', data: revenueData }]} height={280} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>الإيرادات حسب الدولة</CardTitle>
                  <CardDescription>USD equivalent</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    labels={revenueByCountry.map((x) => `${x.country.flag} ${x.country.code}`)}
                    data={revenueByCountry.map((x) => Math.round(x.revenue))}
                    color="#10B981"
                  />
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="border-b">
                  <CardTitle>ملخص الإيرادات</CardTitle>
                  <CardDescription>حسب الدولة</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {revenueByCountry.map((x) => (
                      <div key={x.country.code} className="px-5 py-3 flex items-center gap-3">
                        <span className="text-2xl">{x.country.flag}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{x.country.nameAr}</p>
                          <p className="text-sm text-muted-foreground">{clients.filter((c) => c.country === x.country.code).length} عميل</p>
                        </div>
                        <div className="text-end">
                          <p className="text-sm font-bold text-success">${Math.round(x.revenue).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">/شهر</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
