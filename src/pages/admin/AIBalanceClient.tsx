import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import {
  useAIBalanceStore,
  accountBalance,
  formatTokens,
  formatUsd,
  localAmount,
  tokensFor,
  type BalanceTxType,
} from '@/store/useAIBalanceStore';
import { GiftBalanceDialog } from '@/components/admin/GiftBalanceDialog';
import { formatDate } from '@/utils/format';
import { PrivateAssistantNav } from '@/components/admin/PrivateAssistantNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TX_LABEL: Record<BalanceTxType, string> = {
  topup: 'شحن',
  auto: 'شحن تلقائي',
  gift: 'رصيد مجاني',
  usage: 'استهلاك',
};

export default function AIBalanceClient(): JSX.Element {
  const { id = '' } = useParams();
  const account = useAIBalanceStore((s) => s.accounts.find((a) => a.clientId === id));
  const price = useAIBalanceStore((s) => s.settings.pricePerMillion);
  const client = useAdminStore((s) => s.clients.find((c) => c.id === id));
  const countries = useAdminStore((s) => s.countries);
  const [giftOpen, setGiftOpen] = useState(false);

  if (!client || !account) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-muted-foreground">لا يوجد حساب رصيد لهذا العميل.</p>
        <Button asChild variant="outline">
          <Link to="/ai-balance">العودة إلى أرصدة العملاء</Link>
        </Button>
      </div>
    );
  }

  const bal = accountBalance(account);
  const stopped = bal <= 0;
  const fmt = (usd: number): string => {
    const l = localAmount(usd, client.country);
    return `${l.value} ${l.symbol}`;
  };
  const country = countries.find((c) => c.code === client.country);

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <PrivateAssistantNav />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{client.companyName}</h2>
          <p className="text-sm text-muted-foreground">
            {country?.nameAr ?? client.country} · {stopped ? 'المساعد متوقف' : 'المساعد يعمل'}
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setGiftOpen(true)}>
          <Gift className="h-4 w-4" />
          رصيد مجاني
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">الرصيد</p>
            <p className="text-xl font-bold mt-1" dir="ltr">
              {fmt(bal)} <span className="text-xs font-normal text-muted-foreground">({formatUsd(bal)})</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">≈ {formatTokens(tokensFor(bal, price))} توكن</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">استهلاك الشهر</p>
            <p className="text-xl font-bold mt-1">{formatTokens(account.usedMonthTokens)} توكن</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">الشحن التلقائي</p>
            <div className="mt-2">
              <Badge variant={account.autoChargeUsd !== null ? 'success' : 'secondary'}>
                {account.autoChargeUsd !== null ? `مفعّل · ${formatUsd(account.autoChargeUsd)}` : 'غير مفعّل'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">تفاصيل الرصيد</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {account.lots.length === 0 && account.negative === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">لا يوجد رصيد.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">المصدر</TableHead>
                  <TableHead className="text-start">المبلغ</TableHead>
                  <TableHead className="text-start">المتبقي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {account.lots.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.source}</TableCell>
                    <TableCell dir="ltr" className="text-end">{fmt(l.usd)}</TableCell>
                    <TableCell dir="ltr" className="text-end font-medium">{fmt(l.left)}</TableCell>
                  </TableRow>
                ))}
                {account.negative > 0 && (
                  <TableRow>
                    <TableCell>
                      <Badge variant="destructive">رصيد سالب</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">يُخصم من الشحنة القادمة</TableCell>
                    <TableCell dir="ltr" className="text-end font-medium text-destructive">-{fmt(account.negative)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">سجل الحركات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">التاريخ</TableHead>
                <TableHead className="text-start">الحركة</TableHead>
                <TableHead className="text-start">التفاصيل</TableHead>
                <TableHead className="text-start">المبلغ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {account.tx.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(t.date)}</TableCell>
                  <TableCell>
                    <Badge variant={t.usd >= 0 ? 'success' : 'secondary'}>{TX_LABEL[t.type]}</Badge>
                  </TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell dir="ltr" className={`text-end ${t.usd >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {t.usd >= 0 ? '+' : ''}
                    {fmt(t.usd)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GiftBalanceDialog clientId={giftOpen ? id : null} onClose={() => setGiftOpen(false)} />
    </div>
  );
}
