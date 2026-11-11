import { useVendorsAdminStore } from '@/store/useVendorsAdminStore';
import { Card, CardContent } from '@/components/ui/card';

export default function VendorLog(): JSX.Element {
  const log = useVendorsAdminStore((s) => s.log);
  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <div>
        <h2 className="text-2xl font-bold">سجل حركات الموردين</h2>
        <p className="text-sm text-muted-foreground">كل حركة على العمولات والتحويلات، ولا يمكن حذفه</p>
      </div>
      <Card>
        <CardContent className="divide-y p-0">
          {log.map((l) => (
            <div key={l.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-4 py-2.5 text-sm">
              <small className="whitespace-nowrap text-xs text-muted-foreground">{l.at}</small>
              <b>{l.who}</b>
              <span>{l.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
