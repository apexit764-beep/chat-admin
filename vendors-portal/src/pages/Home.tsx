import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Clock, UserPlus, Users, Wallet } from 'lucide-react';
import { useVendorStore, sumsFor } from '@v/store/useVendorStore';
import { toLocal } from '@v/lib/vendorMath';
import { FilterTabs, Money, PageHeader, Pager, Stat, StatusPill } from '@v/components/ui-bits';
import { EarningsChart } from '@v/components/earnings-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const subscribed = mine.filter((c) => c.state === 'اشترك').length;
  const myComms = comms.filter((c) => c.vid === v.id);
  const myPayouts = payouts.filter((p) => p.vid === v.id);
  const minLocal = toLocal(settings.min, v.cur);

  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);
  const filtered = myComms.filter((k) => tab === 'all' || k.st === tab);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);

  const steps = [
    { icon: UserPlus, title: 'أضف عميلك', text: 'من صفحة العملاء، وسيصله بريد لإكمال التسجيل.' },
    { icon: Clock, title: 'عمولة معلّقة', text: `عند دفع أول اشتراك تُسجل عمولتك "معلّقة" لمدة ${settings.hold} يوم.` },
    {
      icon: Wallet,
      title: 'اسحب أرباحك',
      text: (
        <>
          بعدها تصبح "متاحة"، ويمكنك طلب سحبها عند وصولها إلى <Money v={minLocal} cur={v.cur} className="font-medium text-foreground" />.
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={`أهلًا ${v.name.split(' ')[0]} 👋`}
        desc={`عمولتك ${v.rate}% من أول اشتراك لكل عميل تضيفه`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} label="العملاء" value={mine.length} hint="كل العملاء الذين أضفتهم أو سجّلوا من رابطك" />
        <Stat
          icon={BadgeCheck}
          label="اشتركوا"
          value={subscribed}
          hint={mine.length ? `نسبة التحويل ${Math.round((subscribed / mine.length) * 100)}%` : 'لا يوجد عملاء بعد'}
        />
        <Stat icon={Clock} tone="amber" label="معلّقة" value={<Money v={s.pending} cur={v.cur} />} hint={`تصبح متاحة بعد ${settings.hold} يوم من الدفع`} />
        <Stat
          icon={Wallet}
          tone="green"
          label="متاحة للسحب"
          value={<Money v={s.avail} cur={v.cur} />}
          hint={
            <Link to="/payouts" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              اطلب سحب <ArrowLeft className="h-3 w-3" />
            </Link>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <EarningsChart payouts={myPayouts} clients={mine} cur={v.cur} />
        </div>
        <Card className="shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">كيف تكسب؟</CardTitle>
            <CardDescription>ثلاث خطوات من إضافة العميل حتى استلام عمولتك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">
                    {i + 1}. {title}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col gap-3 space-y-0 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">العمولات</CardTitle>
            <CardDescription>عمولة كل عميل اشترك عن طريقك</CardDescription>
          </div>
          <FilterTabs
            tabs={TABS}
            value={tab}
            onChange={(k) => {
              setTab(k);
              setPage(1);
            }}
            count={(k) => myComms.filter((p) => k === 'all' || p.st === k).length}
          />
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="border-t p-8 text-center text-sm text-muted-foreground">لا توجد عمولات.</p>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
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
                    <TableCell className="font-medium">{clients.find((c) => c.id === k.cid)?.name}</TableCell>
                    <TableCell>
                      <Money v={k.base} cur={v.cur} />
                    </TableCell>
                    <TableCell>
                      <bdi dir="ltr" className="tabular-nums">
                        {k.rate}%
                      </bdi>
                    </TableCell>
                    <TableCell className="font-semibold">
                      <Money v={k.amt} cur={v.cur} />
                    </TableCell>
                    <TableCell>
                      <StatusPill text={k.st} />
                      {k.st === 'معلّقة' && <span className="ms-2 text-xs text-muted-foreground">باقي {k.left} يوم</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Pager page={cur} pages={pages} total={filtered.length} size={PAGE_SIZE} onPage={setPage} />
        </CardContent>
      </Card>
    </>
  );
}
