import { useState } from 'react';
import { useVendorsAdminStore } from '@/store/useVendorsAdminStore';
import { PayoutsTable } from '@/components/admin/vendors/VendorBits';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const TABS: [string, string][] = [
  ['all', 'الكل'],
  ['بانتظار المراجعة', 'بانتظار المراجعة'],
  ['تم التحويل', 'تم التحويل'],
  ['مرفوض', 'مرفوض'],
  ['ملغي', 'ملغي (من المورد)'],
];

export default function VendorPayouts(): JSX.Element {
  const payouts = useVendorsAdminStore((s) => s.payouts);
  const [tab, setTab] = useState('all');
  const list = payouts.filter((p) => tab === 'all' || p.st === tab);

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div>
        <h2 className="text-2xl font-bold">طلبات السحب</h2>
        <p className="text-sm text-muted-foreground">راجع الطلب بالموافقة أو الرفض، وعند الموافقة نفّذ التحويل وارفع صورته</p>
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
