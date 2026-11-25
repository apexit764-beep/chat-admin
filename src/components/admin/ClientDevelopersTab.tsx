import { Code2 } from 'lucide-react';
import type { Plan } from '@/types';
import { OTP_STATUS_LABEL, getOtpSupport, type OtpStatus } from '@/utils/otpSupport';
import { limitText } from '@/utils/planLimits';
import { timeAgo } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MiniStat, Note } from '@/components/admin/vendors/VendorBits';

const pct = (v: number): string => `${Math.round(v * 100)}%`;

const STATUS_TONE: Record<OtpStatus, string> = {
  verified: 'bg-emerald-100 text-emerald-800',
  delivered: 'bg-sky-100 text-sky-800',
  failed: 'bg-red-100 text-red-800',
  rejected: 'bg-amber-100 text-amber-800',
};

/**
 * «المطورين» tab of a client: a support view, not monitoring. It answers
 * «my verification codes do not arrive» — did the request reach the API, did Meta
 * return an error, was the number malformed, is the template paused.
 */
export function ClientDevelopersTab({ clientId, plan }: { clientId: string; plan: Plan | undefined }): JSX.Element {
  const d = getOtpSupport(clientId, plan);

  if (!d.enabled) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <Code2 className="h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium text-foreground">خدمة OTP API غير مشمولة في باقة هذا العميل</p>
          <p className="text-xs">متاحة في الاحترافية والأعمال والمؤسسات.</p>
        </CardContent>
      </Card>
    );
  }

  const quotaText = limitText(d.quota);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat tone="green" label="حالة الخدمة" value="مفعّلة" />
        <MiniStat label="الاستهلاك هذا الشهر" value={<bdi dir="ltr">{`${d.used.toLocaleString('en-US')} / ${quotaText}`}</bdi>} />
        <MiniStat tone="blue" label="نسبة الوصول" value={pct(d.reachRate)} />
        <MiniStat tone="blue" label="نسبة التحقق" value={pct(d.verifyRate)} />
      </div>

      <Note>
        الإرسال يتم من رقم واتساب المربوط عند العميل نفسه. الرمز نفسه غير محفوظ بصيغة مقروءة فلا يظهر هنا، وأرقام مستخدمي العميل مموّهة لأنها بيانات طرف ثالث.
      </Note>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">مفاتيح API</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {['اسم المفتاح', 'البيئة', 'آخر استخدام'].map((h) => (
                  <TableHead key={h} className="text-start">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.name}</TableCell>
                  <TableCell>
                    <Badge variant={k.env === 'production' ? 'success' : 'secondary'}>{k.env === 'production' ? 'إنتاج' : 'تجربة'}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{k.lastUsed ? timeAgo(k.lastUsed) : 'لم يُستخدم'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">آخر الطلبات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {['رقم الطلب', 'الرقم', 'الحالة', 'سبب الفشل', 'التاريخ'].map((h) => (
                  <TableHead key={h} className="text-start">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><bdi dir="ltr" className="font-mono text-xs">{r.id}</bdi></TableCell>
                  <TableCell><bdi dir="ltr">{r.phone}</bdi></TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_TONE[r.status]}`}>{OTP_STATUS_LABEL[r.status]}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.failure ? (
                      <span>
                        <bdi dir="ltr" className="font-mono text-xs text-muted-foreground">{r.failure.code}</bdi> · {r.failure.text}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{timeAgo(r.at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
