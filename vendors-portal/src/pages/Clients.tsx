import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Link2, Mail, Plus, RotateCw } from 'lucide-react';
import { useVendorStore } from '@v/store/useVendorStore';
import { useUIStore } from '@/store/useUIStore';
import { FieldHint, Money, Note, PageHeader, StatusPill } from '@v/components/ui-bits';
import { isEmail, isPhoneDigits, lengthBetween } from '@v/lib/validation';
import { FX, planPriceUsd, toLocal, type Currency } from '@v/lib/vendorMath';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PhoneCodeSelect, countryOfPhone, dialOf } from '@v/components/phone-code-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
/** «2 أكتوبر 2026» → Date */
const parseArDate = (d: string): number => {
  const [day, month, year] = d.split(' ');
  return new Date(Number(year), AR_MONTHS.indexOf(month), Number(day)).getTime();
};
const VIA_OPTIONS: [string, string][] = [['all', 'طريقة الإضافة: الكل'], ['دعوة', 'دعوة'], ['رابط', 'رابط التسجيل']];
const STATE_OPTIONS: [string, string][] = [['all', 'حالة الحساب: الكل'], ['اشترك', 'اشترك'], ['سجل', 'سجل'], ['دعوة مرسلة', 'دعوة مرسلة'], ['استرد المبلغ', 'استرد المبلغ']];


/** the client's country follows the dial code of the phone number */
const countryOf = (phone: string): string => countryOfPhone(phone)?.name ?? '—';
/** currency a client pays in, by country (only the currencies the portal knows) */
const CURRENCY_BY_ISO: Record<string, Currency> = { EG: 'EGP', OM: 'OMR', SA: 'SAR', AE: 'AED', PS: 'ILS' };
const num = (n: number, d: number): string => n.toLocaleString('en-US', { maximumFractionDigits: d });

/** a row laid out left to right as separate boxes, so the Arabic currency symbols never reorder the numbers around them:
 *  on screen the currency sits on the LEFT of its amount, and a sum like «ج.م 553 = 30% × ج.م 1,843» reads from the right */
function Row({ children }: { children: React.ReactNode }): JSX.Element {
  return <span dir="ltr" className="inline-flex flex-wrap items-baseline gap-x-1.5">{children}</span>;
}
function Amt({ n, cur, d }: { n: number; cur: Currency; d?: number }): JSX.Element {
  return (
    <span dir="ltr" className="inline-flex items-baseline gap-1">
      <span>{FX[cur].sym}</span>
      <span>{num(n, d ?? FX[cur].decimals)}</span>
    </span>
  );
}

/** how the client was added: an invitation sent by the marketer, or the registration link */
function ViaBadge({ via }: { via: string }): JSX.Element {
  const link = via === 'رابط';
  const Icon = link ? Link2 : Mail;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${link ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'}`}>
      <Icon className="h-3.5 w-3.5" />
      {link ? 'رابط التسجيل' : 'دعوة بريدية'}
    </span>
  );
}

function AddClientDialog({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const addClient = useVendorStore((s) => s.addClient);
  const showToast = useUIStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [iso, setIso] = useState('EG');
  const [phone, setPhone] = useState('');

  const submit = (): void => {
    if (!lengthBetween(name, 2, 100)) return showToast('اسم الشركة مطلوب، من حرفين إلى 100 حرف', 'error');
    if (!isEmail(email)) return showToast('أدخل بريدًا إلكترونيًا صحيحًا', 'error');
    if (!isPhoneDigits(phone)) return showToast('رقم الجوال أرقام فقط، من 6 إلى 15 رقمًا', 'error');
    const r = addClient({ name: name.trim(), email: email.trim(), phone: `${dialOf(iso)} ${phone.trim()}` });
    if (!r.ok) return showToast(r.error, 'error');
    showToast('تم إرسال الدعوة');
    setName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة عميل</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>اسم الشركة أو النشاط *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            <FieldHint>مطلوب. من حرفين إلى 100 حرف.</FieldHint>
          </div>
          <div className="space-y-1.5">
            <Label>البريد الإلكتروني *</Label>
            <Input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldHint>مطلوب. بريد إلكتروني بصيغة صحيحة وغير مسجّل مسبقًا في Qhub، وإلا يُرفض.</FieldHint>
          </div>
          <div className="space-y-1.5">
            <Label>رقم الجوال *</Label>
            <div className="flex gap-2" dir="ltr">
              <PhoneCodeSelect value={iso} onChange={setIso} />
              <Input dir="ltr" inputMode="numeric" placeholder="1001234567" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
            </div>
            <FieldHint>مطلوب. أرقام فقط، من 6 إلى 15 رقمًا، بدون رمز الدولة. رمز الدولة يُختار من القائمة.</FieldHint>
          </div>
          <Note>سيصل إلى العميل بريد دعوة لإكمال التسجيل واختيار باقته. تُحسب عمولتك على أول اشتراك فقط.</Note>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={submit}>إرسال الدعوة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Clients(): JSX.Element {
  const { vendors, meId, clients, comms, refLink, resendInvite, cancelInvite } = useVendorStore();
  const showToast = useUIStore((s) => s.showToast);
  const v = vendors.find((x) => x.id === meId)!;
  const mine = clients.filter((c) => c.vid === v.id);
  const [range, setRange] = useState<{ from: Date; to: Date } | undefined>(undefined);
  const [viaF, setViaF] = useState('all');
  const [stateF, setStateF] = useState('all');
  /** why the commission came out this way: the client's country and the exchange rate against the vendor's currency */
  const commissionTip = (c: (typeof mine)[number], k: { base: number; rate: number; amt: number }): JSX.Element => {
    const clientCur = CURRENCY_BY_ISO[countryOfPhone(c.phone)?.iso ?? ''];
    const foreign = !!clientCur && clientCur !== v.cur;
    const usd = planPriceUsd(c.plan, c.cycle);
    const perUnit = foreign ? FX[clientCur].rate / FX[v.cur].rate : 1;
    return (
      <>
        {foreign && (
          <>
            <div>قيمة الاشتراك: <Amt n={toLocal(usd, clientCur)} cur={clientCur} /></div>
            <div>سعر الصرف: <Row><Amt n={perUnit} cur={clientCur} d={perUnit < 1 ? 4 : 2} /><span>=</span><Amt n={1} cur={v.cur} d={0} /></Row></div>
            <div>قيمة الاشتراك بعملتك: <Amt n={k.base} cur={v.cur} /></div>
          </>
        )}
        {!foreign && <div>قيمة الاشتراك: <Amt n={k.base} cur={v.cur} /></div>}
        <div>العمولة: <Row><Amt n={k.amt} cur={v.cur} /><span>=</span><span dir="ltr">{k.rate}%</span><span>×</span><Amt n={k.base} cur={v.cur} /></Row></div>
      </>
    );
  };

  const filtered = useMemo(() => {
    const from = range ? new Date(range.from).setHours(0, 0, 0, 0) : 0;
    const to = range ? new Date(range.to).setHours(23, 59, 59, 999) : 0;
    return mine.filter((c) => {
      if (viaF !== 'all' && (c.via ?? 'دعوة') !== viaF) return false;
      if (stateF !== 'all' && c.state !== stateF) return false;
      if (range) {
        const t = parseArDate(c.date);
        if (t < from || t > to) return false;
      }
      return true;
    });
  }, [mine, range, viaF, stateF]);
  const filtering = !!range || viaF !== 'all' || stateF !== 'all';
  const [adding, setAdding] = useState(false);
  // «إضافة عميل» from the sidebar / home opens the dialog via ?add=1
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (params.get('add') === '1') {
      setAdding(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);
  const [linkOpen, setLinkOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);

  const detail = clients.find((c) => c.id === detailId);
  const detailComm = comms.find((k) => k.cid === detailId);
  const cancelTarget = clients.find((c) => c.id === cancelId);
  const link = refLink();

  const row = (label: string, value: React.ReactNode): JSX.Element => (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <b>{value}</b>
    </div>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="العملاء"
        desc="العملاء الذين أضفتهم أو سجّلوا من رابطك، وحالة اشتراك كل منهم"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => setLinkOpen(true)}>
              <Link2 className="h-4 w-4" />
              رابط التسجيل
            </Button>
            <Button className="gap-2" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" />
              إضافة عميل
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-2 border-b p-4">
          <DateRangePicker value={range} onChange={setRange} />
          <Select value={viaF} onValueChange={setViaF}>
            <SelectTrigger className="h-9 w-auto min-w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIA_OPTIONS.map(([k, t]) => (
                <SelectItem key={k} value={k}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stateF} onValueChange={setStateF}>
            <SelectTrigger className="h-9 w-auto min-w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATE_OPTIONS.map(([k, t]) => (
                <SelectItem key={k} value={k}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filtering && (
            <Button size="sm" variant="ghost" onClick={() => { setRange(undefined); setViaF('all'); setStateF('all'); }}>
              مسح الفلاتر
            </Button>
          )}
          <span className="ms-auto text-xs text-muted-foreground">{filtered.length} من {mine.length}</span>
        </CardContent>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {['العميل', 'الدولة', 'طريقة الإضافة', 'تاريخ الإضافة', 'حالة الحساب', 'الباقة', 'الدورة', 'العمولة', 'حالة العمولة', 'الإجراءات'].map((h) => (
                  <TableHead key={h} className="text-start">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
                    {mine.length === 0 ? 'لم تُضف أي عميل بعد.' : 'لا يوجد عملاء بهذا الفلتر.'}
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => {
                const k = comms.find((x) => x.cid === c.id);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.name}
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </TableCell>
                    <TableCell>{countryOf(c.phone)}</TableCell>
                    <TableCell>
                      <ViaBadge via={c.via ?? 'دعوة'} />
                    </TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>
                      <StatusPill text={c.state} />
                    </TableCell>
                    <TableCell>{c.plan}</TableCell>
                    <TableCell>{c.cycle}</TableCell>
                    <TableCell>
                      {k ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help border-b border-dotted border-muted-foreground/60">
                              <Money v={k.amt} cur={v.cur} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs space-y-1 text-start leading-relaxed">{commissionTip(c, k)}</TooltipContent>
                        </Tooltip>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      {k ? (
                        <span className="inline-flex flex-col items-start gap-1">
                          <StatusPill text={k.st} />
                          {k.st === 'معلّقة' && <small className="text-xs text-muted-foreground">باقي {k.left} يوم</small>}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {c.state === 'دعوة مرسلة' ? (
                        <span className="inline-flex gap-1.5">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            aria-label="إعادة إرسال الدعوة"
                            title="إعادة إرسال الدعوة"
                            onClick={() => {
                              resendInvite(c.id);
                              showToast('تم إرسال دعوة جديدة، وتوقف الرابط القديم');
                            }}
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setCancelId(c.id)}>
                            إلغاء الدعوة
                          </Button>
                        </span>
                      ) : (
                        <Button size="icon" variant="outline" className="h-8 w-8" aria-label="التفاصيل" title="التفاصيل" onClick={() => setDetailId(c.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddClientDialog open={adding} onClose={() => setAdding(false)} />

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>رابط التسجيل</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">شارك الرابط مع عملائك. أي عميل يسجّل منه يُضاف إلى قائمة عملائك تلقائيًا.</p>
          <div className="flex gap-2" dir="ltr">
            <Input readOnly value={link} />
            <Button
              onClick={() => {
                void navigator.clipboard?.writeText(link).catch(() => undefined);
                showToast('تم نسخ الرابط');
              }}
            >
              نسخ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{detail?.name}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div>
              {row('البريد الإلكتروني', detail.email)}
              {row('رقم الجوال', <bdi dir="ltr">{detail.phone}</bdi>)}
              {row('الدولة', countryOf(detail.phone))}
              {row('طريقة الإضافة', detail.via === 'رابط' ? 'رابط التسجيل' : 'دعوة')}
              {row('تاريخ الإضافة', detail.date)}
              {row('حالة الحساب', <StatusPill text={detail.state} />)}
              {row('الباقة', detail.plan)}
              {row('الدورة', detail.cycle)}
              {row('قيمة أول اشتراك', detailComm ? <Money v={detailComm.base} cur={v.cur} /> : '—')}
              {row(
                'العمولة',
                detailComm ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Money v={detailComm.amt} cur={v.cur} /> <StatusPill text={detailComm.st} />
                    {detailComm.st === 'معلّقة' && <small className="font-normal text-muted-foreground">باقي {detailComm.left} يوم</small>}
                  </span>
                ) : (
                  '—'
                )
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>إلغاء الدعوة</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            سيتم إلغاء دعوة <b>{cancelTarget?.name}</b>، وسيتوقف رابط الدعوة المرسل إليه.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>
              رجوع
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                cancelInvite(cancelId as number);
                setCancelId(null);
                showToast('تم إلغاء الدعوة');
              }}
            >
              إلغاء الدعوة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
