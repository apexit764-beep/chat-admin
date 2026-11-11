import { useVendorStore, sumsFor } from '@v/store/useVendorStore';
import { toLocal } from '@v/lib/vendorMath';
import { Money, PageHeader, Stat, StatusPill } from '@v/components/ui-bits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Home(): JSX.Element {
  const { vendors, meId, clients, comms, payouts, settings } = useVendorStore();
  const v = vendors.find((x) => x.id === meId)!;
  const s = sumsFor(v.id, comms, payouts);
  const mine = clients.filter((c) => c.vid === v.id);
  const myComms = comms.filter((c) => c.vid === v.id);
  const minLocal = toLocal(settings.min, v.cur);

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
          <CardTitle className="text-base">آخر العمولات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {myComms.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">لا توجد عمولات بعد.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العميل</TableHead>
                  <TableHead className="text-start">قيمة أول اشتراك</TableHead>
                  <TableHead className="text-start">العمولة</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myComms.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>{clients.find((c) => c.id === k.cid)?.name}</TableCell>
                    <TableCell>
                      <Money v={k.base} cur={v.cur} />
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
        </CardContent>
      </Card>
    </div>
  );
}
