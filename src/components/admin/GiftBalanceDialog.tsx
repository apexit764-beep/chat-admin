import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/useAdminStore';
import { useAIBalanceStore, formatTokens, tokensFor } from '@/store/useAIBalanceStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldHint } from '@/components/ui/field-hint';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  clientId: string | null;
  onClose: () => void;
}

/** Admin gives a client free assistant balance, with a mandatory reason */
export function GiftBalanceDialog({ clientId, onClose }: Props): JSX.Element {
  const client = useAdminStore((s) => s.clients.find((c) => c.id === clientId));
  const price = useAIBalanceStore((s) => s.settings.pricePerMillion);
  const addGift = useAIBalanceStore((s) => s.addGift);
  const showToast = useUIStore((s) => s.showToast);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (clientId) {
      setAmount('');
      setReason('');
    }
  }, [clientId]);

  const usd = Number(amount);

  const submit = (): void => {
    if (!clientId) return;
    if (!(usd > 0)) return showToast('أدخل مبلغاً أكبر من صفر', 'error');
    if (!reason.trim()) return showToast('أدخل السبب', 'error');
    addGift(clientId, usd, reason.trim());
    showToast('تمت إضافة الرصيد المجاني');
    onClose();
  };

  return (
    <Dialog open={!!clientId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة رصيد مجاني</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="text-sm">
            العميل: <b>{client?.companyName}</b>
          </div>
          <div className="space-y-1.5">
            <Label>المبلغ ($) *</Label>
            <div className="flex items-center gap-3">
              <Input dir="ltr" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <b className="whitespace-nowrap text-sm text-primary min-w-[120px]">
                {usd > 0 ? `≈ ${formatTokens(tokensFor(usd, price))} توكن` : ''}
              </b>
            </div>
            <FieldHint>مطلوب. رقم أكبر من صفر بالدولار، ولا يقبل السالب (الإضافة فقط).</FieldHint>
          </div>
          <div className="space-y-1.5">
            <Label>السبب *</Label>
            <Textarea
              rows={3}
              placeholder="مثلاً: تعويض عن عطل في الخدمة"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <FieldHint>مطلوب. نص غير فارغ، ويُسجل في سجل حركات العميل.</FieldHint>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={submit}>إضافة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
