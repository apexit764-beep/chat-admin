import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVendorStore, sumsFor } from '@v/store/useVendorStore';
import { toLocal } from '@v/lib/vendorMath';
import { Money, PageHeader, Stat, StatusPill } from '@v/components/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TABS: [string, string][] = [
  ['all', 'الكل'],
  ['متاحة', 'متاحة'],
  ['معلّقة', 'معلّقة'],
];
const PAGE_SIZE = 5;

export default function Home(): JSX.Element {
  const { vendors, meId, clients, comms, payouts, settings } = useVendorStore();
  const v = vendors.find((x) => x.id === meId)!;
  const s = sumsFor(v.id, comms, payouts);
  const mine = clients.filter((c) => c.vid === v.id);
  const myComms = comms.filter((c) => c.vid === v.id);
  const minLocal = toLocal(settings.min, v.cur);

  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const filtered = myComms.filter((k) => tab === 'all' || k.st === tab);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <PageHeader title={`أهلًا ${v.name.split(' ')[0]}`} desc={`عمولتك ${v.rate}% من أول اشتراك لكل عميل تضيفه`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="العملاء" value={mine.length} />
        <Stat label="اشتركوا" value={mine.filter((c) => c.state === 'اشترك').length} />
        <Stat tone="amber" label="معلّقة" value={<Money v={s.pending} cur={v.cur} />} />
        <Stat tone="green" label="متاحة للسحب" value={<Money v={s.avail} cur={v.cur} />} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">كيف تكسب؟</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-relaxed md:grid-cols-3">
          <div>1. أضف عميلك من صفحة العملاء، وسيصله بريد لإكمال التسجيل.</div>
          <div>2. عند دفع أول اشتراك، تُسجل عمولتك "معلّقة" لمدة {settings.hold} يوم.</div>
          <div>
            3. بعد هذه المدة تصبح "متاحة"، ويمكنك طلب سحبها عند وصولها إلى <Money v={minLocal} cur={v.cur} />.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">العمولات</CardTitle>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {TABS.map(([k, t]) => (
              <button
                key={k}
                onClick={() => { setTab(k); setPage(1); }}
                className={cn('rounded-lg border px-3 py-1.5 text-xs font-semibold', tab === k ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}
              >
                {t} ({myComms.filter((p) => k === 'all' || p.st === k).length})
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">لا توجد عمولات.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">قيمة أول اشتراك</TableHead>
                  <TableHead className="text-start">نسبة العمولة</TableHead>
                  <TableHead className="text-start">العمولة</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>{clients.find((c) => c.id === k.cid)?.name}</TableCell>
                    <TableCell>
                      <Money v={k.base} cur={v.cur} />
                    </TableCell>
                    <TableCell>
                      <bdi dir="ltr">{k.rate}%</bdi>
                    </TableCell>
                    <TableCell className="font-bold">
                      <Money v={k.amt} cur={v.cur} />
                    </TableCell>
                    <TableCell>
                      <StatusPill text={k.st} />
                      {k.st === 'معلّقة' && <span className="ms-1 text-xs text-muted-foreground">باقي {k.left} يوم</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
              <span>
                {(cur - 1) * PAGE_SIZE + 1}–{Math.min(cur * PAGE_SIZE, filtered.length)} من {filtered.length}
              </span>
              <div className="flex items-center gap-1.5">
                <Button size="icon" variant="outline" className="h-8 w-8" aria-label="الصفحة السابقة" disabled={cur === 1} onClick={() => setPage(cur - 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="px-2 font-semibold text-foreground">صفحة {cur} من {pages}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" aria-label="الصفحة التالية" disabled={cur === pages} onClick={() => setPage(cur + 1)}>
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
