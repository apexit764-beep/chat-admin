import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Users, Wallet, Repeat, Activity } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import {
  useAIBalanceStore,
  accountBalance,
  formatTokens,
  formatUsd,
  isFreeAmountSubscriber,
  lastTopupUsd,
  localAmount,
} from '@/store/useAIBalanceStore';
import { GiftBalanceDialog } from '@/components/admin/GiftBalanceDialog';
import { PrivateAssistantNav } from '@/components/admin/PrivateAssistantNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ALL = 'all';
const FREE = 'free';

export default function AIBalanceClients(): JSX.Element {
  const navigate = useNavigate();
  const accounts = useAIBalanceStore((s) => s.accounts);
  const packs = useAIBalanceStore((s) => s.settings.packs);
  const clients = useAdminStore((s) => s.clients);
  const countries = useAdminStore((s) => s.countries);
  const [giftFor, setGiftFor] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(ALL);

  const rows = useMemo(
    () =>
      accounts
        .map((a) => ({ a, client: clients.find((c) => c.id === a.clientId) }))
        .filter((r): r is { a: typeof r.a; client: NonNullable<typeof r.client> } => !!r.client),
    [accounts, clients]
  );

  const visible = rows.filter(({ a }) => {
    if (filter === ALL) return true;
    if (filter === FREE) return isFreeAmountSubscriber(a, packs);
    return lastTopupUsd(a) === Number(filter);
  });

  const stats = useMemo(() => {
    const total = rows.reduce((sum, { a }) => sum + Math.max(0, accountBalance(a)), 0);
    return {
      clients: rows.length,
      total,
      auto: rows.filter(({ a }) => a.autoChargeUsd !== null).length,
      tokens: rows.reduce((sum, { a }) => sum + a.usedMonthTokens, 0),
    };
  }, [rows]);

  const cards = [
    { label: 'إجمالي العملاء', value: String(stats.clients), icon: Users },
    { label: 'إجمالي الأرصدة', value: formatUsd(stats.total), icon: Wallet },
    { label: 'استهلاك الشهر (توكن)', value: formatTokens(stats.tokens), icon: Activity },
    { label: 'الشحن التلقائي مفعّل', value: String(stats.auto), icon: Repeat },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 page-fade">
      <PrivateAssistantNav />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <c.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{c.label}</p>
                <p className="text-lg font-bold truncate" dir="auto">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">العملاء الذين يستخدمون رصيد Qhub فقط</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">الاشتراك</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>كل العملاء</SelectItem>
              {packs.map((p) => (
                <SelectItem key={p.usd} value={String(p.usd)}>
                  باقة {formatUsd(p.usd)}
                  {p.active ? '' : ' (معطّلة)'}
                </SelectItem>
              ))}
              <SelectItem value={FREE}>مبلغ حر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">العميل</TableHead>
                <TableHead className="text-start">الدولة</TableHead>
                <TableHead className="text-start">الرصيد</TableHead>
                <TableHead className="text-start">استهلاك الشهر</TableHead>
                <TableHead className="text-start">الاشتراك</TableHead>
                <TableHead className="text-start">الشحن التلقائي</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead className="w-[150px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    لا يوجد عملاء مطابقون.
                  </TableCell>
                </TableRow>
              )}
              {visible.map(({ a, client }) => {
                const bal = accountBalance(a);
                const stopped = bal <= 0;
                const local = localAmount(bal, client.country);
                const country = countries.find((c) => c.code === client.country);
                const free = isFreeAmountSubscriber(a, packs);
                const last = lastTopupUsd(a);
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
                      {last === null ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Badge variant="outline">
                          {free ? 'مبلغ حر' : 'باقة'} · {formatUsd(last)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.autoChargeUsd !== null ? 'success' : 'secondary'}>
                        {a.autoChargeUsd !== null ? `مفعّل · ${formatUsd(a.autoChargeUsd)}` : 'غير مفعّل'}
                      </Badge>
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
