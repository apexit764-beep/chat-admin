import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import {
  useAIBalanceStore,
  accountBalance,
  formatTokens,
  formatUsd,
  localAmount,
} from '@/store/useAIBalanceStore';
import { GiftBalanceDialog } from '@/components/admin/GiftBalanceDialog';
import { PrivateAssistantNav } from '@/components/admin/PrivateAssistantNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AIBalanceClients(): JSX.Element {
  const navigate = useNavigate();
  const accounts = useAIBalanceStore((s) => s.accounts);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const [giftFor, setGiftFor] = useState<string | null>(null);

  const rows = accounts
    .map((a) => ({ a, client: clients.find((c) => c.id === a.clientId) }))
    .filter((r): r is { a: typeof r.a; client: NonNullable<typeof r.client> } => !!r.client);

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <PrivateAssistantNav />
      <p className="text-sm text-muted-foreground">العملاء الذين يستخدمون رصيد Qhub فقط</p>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">العميل</TableHead>
                <TableHead className="text-start">الدولة</TableHead>
                <TableHead className="text-start">الرصيد</TableHead>
                <TableHead className="text-start">استهلاك الشهر</TableHead>
                <TableHead className="text-start">الشحن التلقائي</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead className="w-[150px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    لا توجد عملاء يستخدمون رصيد المساعد.
                  </TableCell>
                </TableRow>
              )}
              {rows.map(({ a, client }) => {
                const bal = accountBalance(a);
                const stopped = bal <= 0;
                const local = localAmount(bal, client.country);
                const country = countries.find((c) => c.code === client.country);
                return (
                  <TableRow
                    key={a.clientId}
                    className="cursor-pointer"
                    onClick={() => navigate(`/ai-balance/${a.clientId}`)}
                  >
                    <TableCell className="font-medium">{client.companyName}</TableCell>
                    <TableCell>{country?.nameAr ?? client.country}</TableCell>
                    <TableCell>
                      <span dir="ltr" className="font-medium">{local.value}</span> {local.symbol}{' '}
                      <span dir="ltr" className="text-xs text-muted-foreground">({formatUsd(bal)})</span>
                    </TableCell>
                    <TableCell>{formatTokens(a.usedMonthTokens)} توكن</TableCell>
                    <TableCell>
                      <Badge variant={a.autoCharge ? 'success' : 'secondary'}>{a.autoCharge ? 'مفعّل' : 'غير مفعّل'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stopped ? 'destructive' : 'success'}>{stopped ? 'متوقف' : 'يعمل'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGiftFor(a.clientId);
                        }}
                      >
                        <Gift className="h-3.5 w-3.5" />
                        رصيد مجاني
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GiftBalanceDialog clientId={giftFor} onClose={() => setGiftFor(null)} />
    </div>
  );
}
