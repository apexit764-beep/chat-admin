import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  FileText,
  Clock,
  Receipt,
} from 'lucide-react';
import { StatCard } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney, approxUSD } from '@/utils/money';
import { formatDate, initials, avatarColor } from '@/utils/format';
import { downloadCsv, printAsPdf } from '@/utils/csv';
import type { Invoice, InvoiceStatus } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const invStatusLabel: Record<string, string> = {
  pending: 'معلّقة',
  paid: 'مدفوعة',
  failed: 'فشلت',
};

const invStatusVariant: Record<string, 'warning' | 'success' | 'destructive'> = {
  pending: 'warning',
  paid: 'success',
  failed: 'destructive',
};

export default function AdminFinance(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const invoices = useAdminStore((s) => s.invoices);
  const showToast = useUIStore((s) => s.showToast);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  const totalInvoices = useMemo(
    () => invoices.reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [invoices]
  );

  const paidTotal = useMemo(
    () => invoices.filter((inv) => inv.status === 'paid').reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [invoices]
  );

  const pendingTotal = useMemo(
    () => invoices.filter((inv) => inv.status === 'pending').reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [invoices]
  );

  const overdueInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === 'pending' && new Date(inv.dueDate) < new Date()),
    [invoices]
  );

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (search) {
      const client = clients.find((c) => c.id === inv.clientId);
      if (!inv.number.includes(search) && !(client?.companyName.includes(search) ?? false)) return false;
    }
    return true;
  });

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
        <p className="text-sm text-muted-foreground">إدارة الفواتير والتحصيل</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي الفواتير" value={`$${Math.round(totalInvoices).toLocaleString('en-US')}`} icon={<Receipt className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" />
        <StatCard label="المحصّل" value={`$${Math.round(paidTotal).toLocaleString('en-US')}`} icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="مستحق التحصيل" value={`$${Math.round(pendingTotal).toLocaleString('en-US')}`} icon={<Clock className="h-5 w-5" />} iconBg="bg-warning/15" iconColor="text-warning" />
        <StatCard label="فواتير متأخرة" value={overdueInvoices.length} icon={<AlertTriangle className="h-5 w-5" />} iconBg="bg-danger/15" iconColor="text-danger" />
      </div>

      {overdueInvoices.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {overdueInvoices.length} فاتورة متأخرة تحتاج متابعة
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  إجمالي المبالغ المتأخرة: {overdueInvoices.map((inv) => `${formatMoney(inv.total, inv.currency)}`).join(' · ')}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStatusFilter('pending')} className="flex-shrink-0">
                عرض المتأخرة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportInvoices} className="h-9 ms-auto">
            <Download className="h-4 w-4 me-2" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const html = `
              <h1>تقرير الفواتير</h1>
              <p class="muted">${new Date().toLocaleDateString('ar-u-nu-latn')}</p>
              <table>
                <thead><tr><th>رقم الفاتورة</th><th>العميل</th><th class="right">الإجمالي</th><th>الحالة</th><th>تاريخ الاستحقاق</th></tr></thead>
                <tbody>
                  ${filteredInvoices.map((inv) => {
                    const client = clients.find((c) => c.id === inv.clientId);
                    return `<tr><td>${inv.number}</td><td>${client?.companyName ?? '—'}</td><td class="right">${formatMoney(inv.total, inv.currency)}</td><td>${invStatusLabel[inv.status]}</td><td>${formatDate(inv.dueDate)}</td></tr>`;
                  }).join('')}
                </tbody>
              </table>
              <p class="muted">إجمالي: ${filteredInvoices.length} فاتورة</p>
            `;
            printAsPdf('تقرير الفواتير', html);
          }} className="h-9">
            <FileText className="h-4 w-4 me-2" /> PDF
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
                  <TableHead className="text-start">الإجمالي</TableHead>
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
                            <AvatarFallback className={`text-xs font-bold ${avatarColor(client?.companyName ?? '?')}`}>{initials(client?.companyName ?? '?')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{client?.companyName ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatMoney(inv.total, inv.currency)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                      <TableCell>
                        <Badge variant={invStatusVariant[inv.status]}>
                          {invStatusLabel[inv.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title="طباعة PDF" onClick={() => handleDownloadInvoice(inv)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">لا توجد فواتير</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
