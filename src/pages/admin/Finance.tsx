import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  FileText,
  Receipt,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { StatCard } from '@components/ui';
import { useAdminStore } from '@/store/useAdminStore';
import { useUIStore } from '@/store/useUIStore';
import { formatMoney, formatUSD, approxUSD } from '@/utils/money';
import { formatDate, initials, avatarColor } from '@/utils/format';
import { downloadCsv, printAsPdf } from '@/utils/csv';
import type { Invoice, InvoiceStatus, InvoiceType } from '@/types';

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
import { DateRangePicker } from '@/components/ui/date-range-picker';

const COMPANY_NAME = 'Qhub';

const invStatusLabel: Record<string, string> = {
  paid: 'مدفوعة',
  failed: 'فشلت',
  scheduled: 'مجدولة',
};

const invStatusVariant: Record<string, 'success' | 'destructive' | 'warning'> = {
  paid: 'success',
  failed: 'destructive',
  scheduled: 'warning',
};

const invTypeLabel: Record<InvoiceType, string> = {
  subscription: 'اشتراك',
  renewal: 'تجديد',
  upgrade: 'ترقية',
};

const invTypeVariant: Record<InvoiceType, 'default' | 'secondary' | 'outline'> = {
  subscription: 'default',
  renewal: 'secondary',
  upgrade: 'outline',
};

export default function AdminFinance(): JSX.Element {
  const clients = useAdminStore((s) => s.clients);
  const invoices = useAdminStore((s) => s.invoices);
  const showToast = useUIStore((s) => s.showToast);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | InvoiceType>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const dateFiltered = useMemo(() => {
    if (!dateRange) return invoices;
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime() + 86400000 - 1;
    return invoices.filter((inv) => {
      const t = Date.parse(inv.createdAt);
      return t >= from && t <= to;
    });
  }, [invoices, dateRange]);

  // a scheduled invoice is not issued yet, so it stays out of the totals
  const totalInvoices = useMemo(
    () => dateFiltered
      .filter((inv) => inv.status !== 'scheduled')
      .reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [dateFiltered]
  );

  const paidTotal = useMemo(
    () => dateFiltered.filter((inv) => inv.status === 'paid').reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [dateFiltered]
  );

  const failedTotal = useMemo(
    () => dateFiltered.filter((inv) => inv.status === 'failed').reduce((acc, inv) => acc + approxUSD(inv.total, inv.currency), 0),
    [dateFiltered]
  );

  const filteredInvoices = useMemo(() => {
    setCurrentPage(1);
    return dateFiltered.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (typeFilter !== 'all' && inv.invoiceType !== typeFilter) return false;
      if (search) {
        const client = clients.find((c) => c.id === inv.clientId);
        if (!inv.number.includes(search) && !(client?.companyName.includes(search) ?? false)) return false;
      }
      return true;
    });
  }, [dateFiltered, statusFilter, typeFilter, search, clients]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleExportInvoices = (): void => {
    downloadCsv(
      `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredInvoices.map((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        return {
          'رقم الفاتورة': inv.number,
          'العميل': client?.companyName ?? '—',
          'النوع': invTypeLabel[inv.invoiceType],
          'المبلغ (USD)': Math.round(approxUSD(inv.amount, inv.currency) * 100) / 100,
          'الضريبة (USD)': Math.round(approxUSD(inv.tax, inv.currency) * 100) / 100,
          'الإجمالي (USD)': Math.round(approxUSD(inv.total, inv.currency) * 100) / 100,
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
      <p>النوع: ${invTypeLabel[inv.invoiceType]}</p>
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
      <p class="muted">شكراً لتعاملك مع ${COMPANY_NAME}</p>
    `;
    printAsPdf(`Invoice ${inv.number}`, html);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">المالية</h2>
        <p className="text-sm text-muted-foreground">إدارة الفواتير والتحصيل</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="إجمالي الفواتير" value={`$${Math.round(totalInvoices).toLocaleString('en-US')}`} icon={<Receipt className="h-5 w-5" />} iconBg="bg-primary/15" iconColor="text-primary" />
        <StatCard label="المحصّل" value={`$${Math.round(paidTotal).toLocaleString('en-US')}`} icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="فواتير فاشلة" value={`$${Math.round(failedTotal).toLocaleString('en-US')}`} icon={<AlertTriangle className="h-5 w-5" />} iconBg="bg-danger/15" iconColor="text-danger" />
      </div>

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
              <SelectItem value="failed">فشلت</SelectItem>
              <SelectItem value="scheduled">مجدولة</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | InvoiceType)}>
            <SelectTrigger className="w-auto min-w-[130px] h-9">
              <SelectValue placeholder="كل الأنواع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="subscription">اشتراك</SelectItem>
              <SelectItem value="renewal">تجديد</SelectItem>
              <SelectItem value="upgrade">ترقية</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm" onClick={handleExportInvoices} className="h-9 ms-auto">
            <Download className="h-4 w-4 me-2" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const html = `
              <h1>تقرير الفواتير</h1>
              <p class="muted">${new Date().toLocaleDateString('ar-u-nu-latn')}</p>
              <table>
                <thead><tr><th>رقم الفاتورة</th><th>العميل</th><th>النوع</th><th class="right">الإجمالي (USD)</th><th>الحالة</th><th>تاريخ الاستحقاق</th></tr></thead>
                <tbody>
                  ${filteredInvoices.map((inv) => {
                    const client = clients.find((c) => c.id === inv.clientId);
                    return `<tr><td>${inv.number}</td><td>${client?.companyName ?? '—'}</td><td>${invTypeLabel[inv.invoiceType]}</td><td class="right">${formatUSD(inv.total, inv.currency)}</td><td>${invStatusLabel[inv.status]}</td><td>${formatDate(inv.dueDate)}</td></tr>`;
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
                  <TableHead className="text-start">النوع</TableHead>
                  <TableHead className="text-start">الإجمالي (USD)</TableHead>
                  <TableHead className="text-start hidden lg:table-cell">تاريخ الاستحقاق</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                  <TableHead className="text-start w-1">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((inv, idx) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="text-xs text-muted-foreground font-mono">{(currentPage - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell className="font-mono font-semibold">{inv.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 text-xs">
                            <AvatarFallback className={`text-xs font-bold ${avatarColor(client?.companyName ?? '?')}`}>{initials(client?.companyName ?? '?')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{client?.companyName ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={invTypeVariant[inv.invoiceType]} className="text-[10px]">
                          {invTypeLabel[inv.invoiceType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatUSD(inv.total, inv.currency)}</TableCell>
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
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Inbox className="h-10 w-10 text-muted-foreground/50" />
                        <span>لا توجد فواتير</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                عرض {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredInvoices.length)} من {filteredInvoices.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
