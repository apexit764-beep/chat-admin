import { useState } from 'react';
import { Link2, Plus, RotateCw } from 'lucide-react';
import { useVendorStore } from '@v/store/useVendorStore';
import { useUIStore } from '@/store/useUIStore';
import { FieldHint, Money, Note, PageHeader, StatusPill } from '@v/components/ui-bits';
import { isEmail, isPhoneDigits, lengthBetween } from '@v/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CODES = [
  ['+20', '🇪🇬 +20'],
  ['+968', '🇴🇲 +968'],
  ['+966', '🇸🇦 +966'],
  ['+970', '🇵🇸 +970'],
  ['+971', '🇦🇪 +971'],
];

function AddClientDialog({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
  const addClient = useVendorStore((s) => s.addClient);
  const showToast = useUIStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('+20');
  const [phone, setPhone] = useState('');

  const submit = (): void => {
    if (!lengthBetween(name, 2, 100)) return showToast('اسم الشركة مطلوب، من حرفين إلى 100 حرف', 'error');
    if (!isEmail(email)) return showToast('أدخل بريدًا إلكترونيًا صحيحًا', 'error');
    if (!isPhoneDigits(phone)) return showToast('رقم الجوال أرقام فقط، من 6 إلى 15 رقمًا', 'error');
    const r = addClient({ name: name.trim(), email: email.trim(), phone: `${code} ${phone.trim()}` });
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
              <Select value={code} onValueChange={setCode}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CODES.map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
  const [adding, setAdding] = useState(false);
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
    <div>
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {['العميل', 'طريقة الإضافة', 'تاريخ الإضافة', 'الحالة', 'الباقة', 'الدورة', 'العمولة', 'الإجراءات'].map((h) => (
                  <TableHead key={h} className="text-start">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    لم تُضف أي عميل بعد.
                  </TableCell>
                </TableRow>
              )}
              {mine.map((c) => {
                const k = comms.find((x) => x.cid === c.id);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.name}
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </TableCell>
                    <TableCell>
                      <StatusPill text={c.via ?? 'دعوة'} />
                    </TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>
                      <StatusPill text={c.state} />
                    </TableCell>
                    <TableCell>{c.plan}</TableCell>
                    <TableCell>{c.cycle}</TableCell>
                    <TableCell>
                      {k ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Money v={k.amt} cur={v.cur} /> <StatusPill text={k.st} />
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
                        <Button size="sm" variant="outline" onClick={() => setDetailId(c.id)}>
                          التفاصيل
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
              {row('طريقة الإضافة', detail.via === 'رابط' ? 'رابط التسجيل' : 'دعوة')}
              {row('تاريخ الإضافة', detail.date)}
              {row('الحالة', <StatusPill text={detail.state} />)}
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
