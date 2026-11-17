import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldHint } from '@/components/ui/field-hint';

const OTP = '123456'; // demo code; the real one is sent by SMS from the backend
const OTP_RESEND_SECONDS = 30;
const OTP_MAX_ATTEMPTS = 3;

/** confirms a phone number change: the code goes to the NEW number */
export function OtpStep({ phone, onVerified, onBack }: { phone: string; onVerified: () => void; onBack: () => void }): JSX.Element {
  const showToast = useUIStore((s) => s.showToast);
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [wait, setWait] = useState(OTP_RESEND_SECONDS);
  const masked = `••••${phone.replace(/\D/g, '').slice(-4)}`;

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = (): void => {
    if (code.trim() === OTP) return onVerified();
    const left = OTP_MAX_ATTEMPTS - attempts - 1;
    setAttempts(attempts + 1);
    setCode('');
    if (left <= 0) {
      showToast('تجاوزت عدد المحاولات، ابدأ من جديد', 'error');
      return onBack();
    }
    showToast(`الرمز غير صحيح، بقي ${left} ${left === 1 ? 'محاولة' : 'محاولات'}`, 'error');
  };

  return (
    <div className="space-y-3 py-1">
      <p className="text-sm leading-relaxed">
        أرسلنا رمز تأكيد إلى رقم الجوال الجديد <bdi dir="ltr" className="font-bold">{masked}</bdi>. أدخله لتأكيد تغيير الرقم. الرمز صالح لمدة 5 دقائق.
      </p>
      <div className="space-y-1.5">
        <Label>رمز التأكيد *</Label>
        <Input
          autoFocus
          dir="ltr"
          inputMode="numeric"
          maxLength={6}
          placeholder="للتجربة: 123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && verify()}
        />
        <FieldHint>مطلوب. 6 أرقام فقط، صالح لمدة 5 دقائق، و3 محاولات بحد أقصى.</FieldHint>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          className="text-xs text-primary disabled:text-muted-foreground"
          disabled={wait > 0}
          onClick={() => {
            setWait(OTP_RESEND_SECONDS);
            showToast('تم إرسال رمز جديد');
          }}
        >
          {wait > 0 ? `إعادة إرسال الرمز بعد ${wait} ثانية` : 'إعادة إرسال الرمز'}
        </button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            رجوع
          </Button>
          <Button disabled={code.trim().length < 6} onClick={verify}>
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
}
