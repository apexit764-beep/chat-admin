import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Mail, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { SitePage } from '@components/site/SitePage';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSiteInboxStore } from '@/store/useSiteInboxStore';
import type { InboxItem, InboxStatus } from '@/types/siteContent';
import { cn } from '@/lib/utils';

const KINDS = {
  contact: { title: 'رسائل التواصل', lede: 'من نموذج «تواصل معنا» في الموقع.' },
  leads: { title: 'Leads المساعد', lede: 'زوّار تركوا بياناتهم في ويدجت المساعد، مع نصّ المحادثة.' },
  enterprise: { title: 'طلبات المؤسسات', lede: 'من نافذة «باقة المؤسسات» في صفحة الأسعار.' },
} as const;
const KIND_OF = { contact: 'contact', leads: 'lead', enterprise: 'enterprise' } as const;

const STATUS: Record<InboxStatus, { label: string; cls: string }> = {
  new: { label: 'جديد', cls: 'bg-primary/10 text-primary' },
  open: { label: 'قيد المتابعة', cls: 'bg-warning/10 text-warning' },
  closed: { label: 'مغلق', cls: 'bg-muted text-muted-foreground' },
};

function relative(iso: string): string {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (m < 60) return `قبل ${m} د`;
  if (m < 60 * 24) return `قبل ${Math.round(m / 60)} س`;
  return new Date(iso).toLocaleDateString('ar', { day: 'numeric', month: 'short' });
}

const e164 = (phone?: string): string => (phone ?? '').replace(/[^\d+]/g, '');

/**
 * الوارد (CMS-PROMPT §7.14): صندوق بريد بعمودين — قائمة وتفاصيل — مثل لوحة
 * العميل نفسها. إسناد، حالة، ملاحظات داخلية، وتصدير CSV.
 */
export default function SiteInbox(): JSX.Element {
  const { kind = 'contact' } = useParams<{ kind: keyof typeof KINDS }>();
  const all = useSiteInboxStore((s) => s.items);
  const { setStatus, assign, addNote, markOpened } = useSiteInboxStore();
  const team = useAdminStore((s) => s.adminUsers);
  const user = useAuthStore((s) => s.user);
  const [status, setFilter] = useState<InboxStatus | ''>('');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const items = useMemo(
    () => all.filter((i) => i.kind === KIND_OF[kind]).filter((i) => (!status || i.status === status) && (!q || JSON.stringify(i).includes(q))).sort((a, b) => b.at.localeCompare(a.at)),
    [all, kind, status, q]
  );
  const current = all.find((i) => i.id === sel && i.kind === KIND_OF[kind]) ?? null;

  const exportCsv = (): void => {
    const rows = items.map((i) => [i.at, i.name, i.email ?? '', i.phone ?? '', i.locale, i.page, STATUS[i.status].label, 'company' in i ? i.company ?? '' : '', 'message' in i ? i.message : 'note' in i ? i.note : ''].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob(['﻿' + ['الوقت,الاسم,البريد,الجوال,اللغة,الصفحة,الحالة,الشركة,الرسالة', ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `qhub-${kind}.csv`;
    a.click();
  };

  return (
    <SitePage title={KINDS[kind].title} lede={KINDS[kind].lede} actions={<Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 me-1" /> تصدير CSV</Button>}>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="space-y-2 border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث…" className="h-9 ps-8" />
            </div>
            <div className="flex gap-1">
              {(['', 'new', 'open', 'closed'] as const).map((s) => (
                <button key={s} type="button" onClick={() => setFilter(s)} className={cn('rounded-md px-2.5 py-1 text-xs', status === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                  {s ? STATUS[s].label : 'الكل'}
                </button>
              ))}
            </div>
          </div>
          <ul className="max-h-[65vh] overflow-y-auto">
            {items.map((i) => (
              <li key={i.id}>
                <button type="button" onClick={() => { setSel(i.id); markOpened(i.id); }} className={cn('flex w-full gap-2 border-b border-border p-3 text-start hover:bg-muted/50', sel === i.id && 'bg-primary/5')}>
                  {i.status === 'new' && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{i.name}</span>
                      <span className="ms-auto shrink-0 text-[11px] text-muted-foreground">{relative(i.at)}</span>
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{previewOf(i)}</span>
                    <span className="mt-1 flex gap-1 text-[10px]">
                      <span className={cn('rounded px-1.5 py-0.5', STATUS[i.status].cls)}>{STATUS[i.status].label}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5">{i.locale === 'ar' ? 'عربي' : 'EN'}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {items.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">لا شيء هنا.</li>}
          </ul>
        </Card>

        {current ? (
          <Card className="p-5 space-y-5">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{current.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {'company' in current && current.company ? `${current.company} · ` : ''}
                  {new Date(current.at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })} · من <code dir="ltr">{current.page}</code>
                </p>
              </div>
              <div className="flex gap-2">
                {current.email && (
                  <Button variant="outline" size="sm" asChild><a href={`mailto:${current.email}`}><Mail className="h-4 w-4 me-1" /> رد بالبريد</a></Button>
                )}
                {current.phone && (
                  <Button variant="outline" size="sm" asChild><a href={`https://wa.me/${e164(current.phone).replace('+', '')}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 me-1" /> واتساب</a></Button>
                )}
              </div>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {current.email && <Info label="البريد" value={current.email} ltr />}
              {current.phone && <Info label="الجوال (E.164)" value={e164(current.phone)} ltr />}
              {current.kind === 'contact' && <Info label="الموضوع" value={current.subject} />}
              {current.kind === 'enterprise' && <Info label="حجم الفريق" value={current.teamSize} />}
              {current.kind === 'enterprise' && current.channels && <Info label="القنوات" value={current.channels} />}
              {current.kind === 'enterprise' && current.convos && <Info label="المحادثات" value={current.convos} />}
            </dl>

            {current.kind === 'contact' && <p className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm" dir={current.locale === 'en' ? 'ltr' : 'rtl'}>{current.message}</p>}
            {current.kind === 'enterprise' && <p className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm" dir={current.locale === 'en' ? 'ltr' : 'rtl'}>{current.note}</p>}
            {current.kind === 'lead' && (
              <div className="space-y-2 rounded-lg bg-muted p-3" dir={current.locale === 'en' ? 'ltr' : 'rtl'}>
                {current.transcript.map((m, k) => (
                  <div key={k} className={cn('max-w-[80%] rounded-2xl px-3 py-2 text-sm', m.from === 'visitor' ? 'ms-auto bg-primary text-primary-foreground' : 'bg-card border border-border')}>
                    {m.text}
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="font-medium">الحالة</span>
                <select value={current.status} onChange={(e) => setStatus(current.id, e.target.value as InboxStatus)} className="h-9 w-full rounded-md border border-input bg-background px-2">
                  {(Object.keys(STATUS) as InboxStatus[]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-medium">المسؤول</span>
                <select value={current.assignee ?? ''} onChange={(e) => assign(current.id, e.target.value || null)} className="h-9 w-full rounded-md border border-input bg-background px-2">
                  <option value="">بلا إسناد</option>
                  {[...new Set([user?.name, ...team.map((t) => t.name)].filter(Boolean))].map((n) => <option key={n} value={n!}>{n}</option>)}
                </select>
              </label>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">ملاحظات داخلية</p>
              {current.notes.map((n, k) => (
                <div key={k} className="rounded-lg border border-border p-2.5 text-sm">
                  <p>{n.text}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.by} · {relative(n.at)}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="ملاحظة للفريق — لا تصل للعميل" />
                <Button disabled={!note.trim()} onClick={() => { addNote(current.id, user?.name ?? 'مدير', note.trim()); setNote(''); }}>إضافة</Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center p-10 text-sm text-muted-foreground">اختر عنصراً من القائمة.</Card>
        )}
      </div>
    </SitePage>
  );
}

function previewOf(i: InboxItem): string {
  if (i.kind === 'contact') return `${i.subject} — ${i.message}`;
  if (i.kind === 'lead') return i.transcript[0]?.text ?? '';
  return `${i.company} · ${i.teamSize}`;
}

function Info({ label, value, ltr }: { label: string; value: string; ltr?: boolean }): JSX.Element {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd dir={ltr ? 'ltr' : undefined} className={ltr ? 'text-end' : undefined}>{value}</dd>
    </div>
  );
}
