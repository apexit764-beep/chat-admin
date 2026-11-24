import { useState } from 'react';
import { CheckCircle2, Clock, DollarSign, XCircle } from 'lucide-react';
import { StatCard } from '@components/ui';
import { FX, useVendorsAdminStore } from '@/store/useVendorsAdminStore';
import { PayoutsTable } from '@/components/admin/vendors/VendorBits';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const TABS: [string, string][] = [
  ['all', 'الكل'],
  ['بانتظار المراجعة', 'بانتظار المراجعة'],
  ['تم التحويل', 'تم التحويل'],
  ['مرفوض', 'مرفوض'],
  ['ملغي', 'ملغي (من المسوق بالعمولة)'],
];

export default function VendorPayouts(): JSX.Element {
  const payouts = useVendorsAdminStore((s) => s.payouts);
  const vendors = useVendorsAdminStore((s) => s.vendors);
  const [tab, setTab] = useState('all');
  const list = payouts.filter((p) => tab === 'all' || p.st === tab);

  // amounts are stored in each marketer's currency: the cards add them up in USD
  const usdOf = (st: string): number =>
    payouts
      .filter((p) => p.st === st)
      .reduce((sum, p) => {
        const cur = vendors.find((v) => v.id === p.vid)?.cur;
        return sum + (cur ? p.amt / FX[cur].rate : 0);
      }, 0);
  const usd = (n: number): string => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  const count = (st: string): number => payouts.filter((p) => p.st === st).length;

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div>
        <h2 className="text-2xl font-bold">طلبات السحب</h2>
        <p className="text-sm text-muted-foreground">راجع الطلب بالموافقة أو الرفض، وعند الموافقة نفّذ التحويل وارفع صورته</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="طلبات بانتظار المراجعة" value={count('بانتظار المراجعة')} icon={<Clock className="h-4 w-4" />} iconBg="bg-warning/15" iconColor="text-warning" />
        <StatCard label="مبالغ بانتظار المراجعة (بالدولار)" value={usd(usdOf('بانتظار المراجعة'))} icon={<DollarSign className="h-4 w-4" />} iconBg="bg-warning/15" iconColor="text-warning" />
        <StatCard label="إجمالي المحوّل (بالدولار)" value={usd(usdOf('تم التحويل'))} icon={<CheckCircle2 className="h-4 w-4" />} iconBg="bg-success/15" iconColor="text-success" />
        <StatCard label="طلبات مرفوضة وملغية" value={count('مرفوض') + count('ملغي')} icon={<XCircle className="h-4 w-4" />} iconBg="bg-danger/15" iconColor="text-danger" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TABS.map(([k, t]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn('rounded-lg border px-3 py-1.5 text-xs font-semibold', tab === k ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}
          >
            {t} ({payouts.filter((p) => k === 'all' || p.st === k).length})
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <PayoutsTable list={list} showVendor />
        </CardContent>
      </Card>
    </div>
  );
}
