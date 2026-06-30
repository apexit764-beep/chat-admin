import { useState } from 'react';
import {
  Copy,
  Check,
  Code,
  Eye,
  Globe,
  Paintbrush,
  MessageCircle,
  Type,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Send,
  Smile,
  Paperclip,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { Card, Input, Textarea } from '@components/ui';
import { useDataStore } from '@/store/useDataStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/utils/cn';
import type { WidgetConfig } from '@/types';

const presetColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#0F172A'];

export default function Widget(): JSX.Element {
  const config = useDataStore((s) => s.widgetConfig);
  const updateConfig = useDataStore((s) => s.updateWidgetConfig);
  const showToast = useUIStore((s) => s.showToast);

  const [tab, setTab] = useState<'appearance' | 'messages' | 'behavior' | 'install'>('appearance');
  const [previewOpen, setPreviewOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const widgetId = 'wdgt_qhub_8f3a2b';
  const installCode = `<!-- Qhub Live Chat Widget -->
<script>
  (function(s,e,k,a){
    s.QhubChat=k;
    s[k]=s[k]||function(){(s[k].q=s[k].q||[]).push(arguments)};
    var d=e.createElement('script'),x=e.getElementsByTagName('script')[0];
    d.async=1;d.src='https://chat-client.apexes.click/widget.js';
    d.setAttribute('data-id',a);x.parentNode.insertBefore(d,x);
  })(window,document,'qhub','${widgetId}');
</script>`;

  const npmInstall = `npm install @qhub/chat-widget

// In your app:
import QhubChat from '@qhub/chat-widget';
QhubChat.init({ widgetId: '${widgetId}' });`;

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).catch(() => undefined);
    setCopied(true);
    showToast('تم النسخ', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex bg-bg-light dark:bg-bg-dark">
      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0 border-l border-border-light dark:border-border-dark overflow-hidden">
        {/* Header with enable toggle */}
        <div className="px-6 py-4 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-h2 font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Live Chat Widget
            </h2>
            <p className="text-small text-muted-light dark:text-muted-dark">
              widget على موقعك يستقبل رسائل العملاء مباشرة في صندوق Qhub
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-small font-medium">{config.enabled ? 'مُفعّل' : 'معطّل'}</span>
              <button
                onClick={() => updateConfig({ enabled: !config.enabled })}
                className={cn('relative h-6 w-11 rounded-full transition-colors', config.enabled ? 'bg-success' : 'bg-border-light dark:bg-border-dark')}
                role="switch"
                aria-checked={config.enabled}
              >
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all', config.enabled ? 'start-0.5' : 'end-0.5')} />
              </button>
            </label>
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              className="lg:hidden h-9 px-3 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              معاينة
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center gap-2 overflow-x-auto flex-shrink-0">
          {[
            { key: 'appearance', label: 'المظهر', icon: <Paintbrush className="h-4 w-4" /> },
            { key: 'messages', label: 'الرسائل', icon: <MessageCircle className="h-4 w-4" /> },
            { key: 'behavior', label: 'السلوك', icon: <SettingsIcon className="h-4 w-4" /> },
            { key: 'install', label: 'التثبيت', icon: <Code className="h-4 w-4" /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-small font-medium border-b-2 transition-colors -mb-px',
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-light dark:text-muted-dark hover:text-current'
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-h3 font-bold mb-3">لون الـ Brand</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateConfig({ primaryColor: c })}
                      className={cn(
                        'h-10 w-10 rounded-full transition-all',
                        config.primaryColor === c && 'ring-2 ring-offset-2 ring-current'
                      )}
                      style={{ background: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="h-10 w-10 rounded-full cursor-pointer border border-border-light dark:border-border-dark"
                    title="لون مخصص"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="h-10 px-3 rounded-input bg-bg-light dark:bg-bg-dark border border-transparent text-body font-mono w-32 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-h3 font-bold mb-3">موضع الـ Widget</h3>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    onClick={() => updateConfig({ position: 'bottom-right' })}
                    className={cn(
                      'rounded-card border-2 p-4 transition-all text-start',
                      config.position === 'bottom-right' ? 'border-primary ring-2 ring-primary/20' : 'border-border-light dark:border-border-dark hover:border-primary/30'
                    )}
                  >
                    <div className="h-20 rounded-lg bg-bg-light dark:bg-bg-dark relative">
                      <div className="absolute bottom-2 end-2 h-6 w-6 rounded-full" style={{ background: config.primaryColor }} />
                    </div>
                    <p className="text-body font-medium mt-2">يمين الأسفل</p>
                  </button>
                  <button
                    onClick={() => updateConfig({ position: 'bottom-left' })}
                    className={cn(
                      'rounded-card border-2 p-4 transition-all text-start',
                      config.position === 'bottom-left' ? 'border-primary ring-2 ring-primary/20' : 'border-border-light dark:border-border-dark hover:border-primary/30'
                    )}
                  >
                    <div className="h-20 rounded-lg bg-bg-light dark:bg-bg-dark relative">
                      <div className="absolute bottom-2 start-2 h-6 w-6 rounded-full" style={{ background: config.primaryColor }} />
                    </div>
                    <p className="text-body font-medium mt-2">يسار الأسفل</p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-h3 font-bold mb-3">أيقونة الـ Bubble</h3>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { key: 'chat', icon: <MessageCircle className="h-5 w-5" /> },
                    { key: 'message', icon: <Type className="h-5 w-5" /> },
                    { key: 'help', icon: <HelpCircle className="h-5 w-5" /> },
                  ] as const).map((b) => (
                    <button
                      key={b.key}
                      onClick={() => updateConfig({ bubbleIcon: b.key })}
                      className={cn(
                        'h-14 w-14 rounded-full transition-all flex items-center justify-center text-white',
                        config.bubbleIcon === b.key && 'ring-2 ring-offset-2 ring-current scale-110'
                      )}
                      style={{ background: config.primaryColor }}
                    >
                      {b.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-h3 font-bold mb-3">إعدادات إضافية</h3>
                <div className="space-y-3 max-w-md">
                  <SwitchRow
                    label="إظهار صورة الموظف"
                    hint="عرض avatar الموظف الذي يرد"
                    checked={config.showAvatar}
                    onChange={(v) => updateConfig({ showAvatar: v })}
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'messages' && (
            <div className="space-y-5 max-w-2xl">
              <Input
                label="اسم الفريق"
                value={config.teamName}
                onChange={(e) => updateConfig({ teamName: e.target.value })}
                placeholder="فريق Qhub"
                icon={<ImageIcon className="h-4 w-4" />}
              />
              <Textarea
                label="رسالة الترحيب"
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                rows={3}
                placeholder="مرحباً 👋 كيف يمكننا مساعدتك اليوم؟"
              />
              <Input
                label="وقت الاستجابة المتوقع"
                value={config.responseTime}
                onChange={(e) => updateConfig({ responseTime: e.target.value })}
                placeholder="نرد عادةً خلال دقائق"
              />
            </div>
          )}

          {tab === 'behavior' && (
            <div className="space-y-3 max-w-2xl">
              <SwitchRow
                label="جمع البريد الإلكتروني"
                hint="اطلب من الزائر بريده قبل بدء المحادثة"
                checked={config.collectEmail}
                onChange={(v) => updateConfig({ collectEmail: v })}
              />
              <SwitchRow
                label="إظهار ساعات العمل"
                hint="عرض حالة 'متصل/غير متصل' حسب ساعات الدوام"
                checked={true}
                onChange={() => undefined}
              />
              <SwitchRow
                label="السماح بالمرفقات"
                hint="الزائر يقدر يبعت صور وملفات"
                checked={true}
                onChange={() => undefined}
              />
              <SwitchRow
                label="رسائل صوتية"
                hint="السماح بإرسال رسائل صوتية"
                checked={false}
                onChange={() => undefined}
              />
              <SwitchRow
                label="إشعار بالصوت"
                hint="تشغيل صوت تنبيه عند رسالة جديدة"
                checked={true}
                onChange={() => undefined}
              />
            </div>
          )}

          {tab === 'install' && (
            <div className="space-y-6 max-w-3xl">
              <Card className="p-5 bg-primary/5 border-primary/20">
                <h3 className="text-h3 font-bold mb-2 flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Widget ID
                </h3>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-surface-dark">
                  <code className="flex-1 text-body font-mono font-semibold">{widgetId}</code>
                  <button
                    onClick={() => copyToClipboard(widgetId)}
                    className="h-8 w-8 rounded-full hover:bg-bg-light dark:hover:bg-bg-dark text-muted-light dark:text-muted-dark flex items-center justify-center"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </Card>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-h3 font-bold">شفرة التثبيت (HTML)</h3>
                  <button
                    onClick={() => copyToClipboard(installCode)}
                    className="h-9 px-3 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    نسخ الكود
                  </button>
                </div>
                <p className="text-small text-muted-light dark:text-muted-dark mb-3">
                  أضف هذه الشفرة قبل تاج <code className="px-1 rounded bg-bg-light dark:bg-bg-dark font-mono">{'</body>'}</code> في كل صفحة تريد ظهور الـ widget فيها
                </p>
                <pre className="p-4 rounded-card bg-[#0F172A] text-[#E2E8F0] text-small font-mono overflow-x-auto leading-relaxed" dir="ltr">
                  <code>{installCode}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-h3 font-bold">React / Next.js</h3>
                  <button
                    onClick={() => copyToClipboard(npmInstall)}
                    className="h-9 px-3 rounded-full border border-border-light dark:border-border-dark text-small font-medium hover:bg-bg-light dark:hover:bg-bg-dark flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    نسخ
                  </button>
                </div>
                <pre className="p-4 rounded-card bg-[#0F172A] text-[#E2E8F0] text-small font-mono overflow-x-auto leading-relaxed" dir="ltr">
                  <code>{npmInstall}</code>
                </pre>
              </div>

              <Card className="p-4 bg-bg-light dark:bg-bg-dark border-0">
                <h4 className="text-body font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  جرّبه الآن
                </h4>
                <p className="text-small text-muted-light dark:text-muted-dark mb-3">
                  بعد إضافة الكود، سيظهر زر شات في الموقع. كل رسالة تصل ستظهر في صندوق Qhub فوراً
                </p>
                <a
                  href={`https://chat-client.apexes.click/preview/widget?id=${widgetId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-small font-medium"
                >
                  <Globe className="h-4 w-4" />
                  افتح صفحة الاختبار
                </a>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <aside
        className={cn(
          'w-[400px] flex-shrink-0 bg-bg-light dark:bg-bg-dark border-s border-border-light dark:border-border-dark overflow-hidden hidden lg:flex flex-col',
          previewOpen && 'flex'
        )}
      >
        <div className="px-4 py-3 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between flex-shrink-0">
          <p className="text-small font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            معاينة مباشرة
          </p>
          <span className="text-[10px] text-muted-light dark:text-muted-dark font-mono">qhub.com</span>
        </div>
        <div className="flex-1 relative overflow-hidden" style={{
          backgroundImage: 'linear-gradient(to bottom right, #f1f5f9, #e2e8f0)',
        }}>
          {/* Fake website content */}
          <div className="absolute inset-4 bg-white rounded-card shadow-sm p-4 opacity-70">
            <div className="h-3 w-32 bg-slate-200 rounded mb-2" />
            <div className="h-2 w-full bg-slate-100 rounded mb-1.5" />
            <div className="h-2 w-3/4 bg-slate-100 rounded mb-3" />
            <div className="h-20 bg-slate-100 rounded mb-3" />
            <div className="h-2 w-full bg-slate-100 rounded mb-1.5" />
            <div className="h-2 w-2/3 bg-slate-100 rounded" />
          </div>

          {/* The actual widget preview */}
          <WidgetPreview config={config} />
        </div>
      </aside>
    </div>
  );
}

function WidgetPreview({ config }: { config: WidgetConfig }): JSX.Element {
  const [open, setOpen] = useState(true);
  const positionCls = config.position === 'bottom-right' ? 'bottom-4 end-4' : 'bottom-4 start-4';

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          dir="rtl"
          className={cn(
            'absolute w-[320px] max-w-[calc(100%-32px)] bg-white rounded-card shadow-2xl overflow-hidden flex flex-col',
            config.position === 'bottom-right' ? 'bottom-20 end-4' : 'bottom-20 start-4'
          )}
          style={{ height: 440 }}
        >
          {/* Header */}
          <div
            className="p-4 text-white relative"
            style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${shade(config.primaryColor, -15)})` }}
          >
            <div className="flex items-center gap-3">
              {config.showAvatar && (
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-base">
                  س
                </div>
              )}
              <div>
                <p className="font-bold">{config.teamName}</p>
                <p className="text-[11px] opacity-90 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  متصل · {config.responseTime}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="absolute top-3 end-3 h-7 w-7 rounded-full hover:bg-white/15 flex items-center justify-center" aria-label="إغلاق">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#F8F9FC]">
            <div className="flex">
              <div className="max-w-[85%] bg-white border border-border-light px-3 py-2 rounded-2xl rounded-bl-sm text-small shadow-sm">
                {config.welcomeMessage}
              </div>
            </div>
            {config.collectEmail && (
              <div className="flex">
                <div className="max-w-[85%] bg-white border border-border-light px-3 py-2 rounded-2xl rounded-bl-sm text-small shadow-sm">
                  قبل ما نبدأ، ممكن نأخذ بريدك الإلكتروني؟ ✉️
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-sm text-small text-white shadow-sm" style={{ background: config.primaryColor }}>
                مرحباً! بدي أستفسر عن شقة في الخوض
              </div>
            </div>
            <div className="flex">
              <div className="max-w-[85%] bg-white border border-border-light px-3 py-2 rounded-2xl rounded-bl-sm text-small shadow-sm">
                أهلاً وسهلاً! نعم، لدينا عدة خيارات. كم غرفة تحتاج؟
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border-light p-2 flex items-center gap-1">
            <button className="h-8 w-8 rounded-full text-muted-light hover:bg-bg-light flex items-center justify-center">
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-full text-muted-light hover:bg-bg-light flex items-center justify-center">
              <Smile className="h-4 w-4" />
            </button>
            <input
              placeholder="اكتب رسالتك..."
              className="flex-1 h-9 bg-bg-light rounded-full px-3 text-small focus:outline-none border-0"
            />
            <button
              className="h-9 w-9 rounded-full text-white flex items-center justify-center"
              style={{ background: config.primaryColor }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center py-1.5 text-[10px] text-muted-light border-t border-border-light/60">
            🚀 يعمل بواسطة Qhub
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn('absolute h-14 w-14 rounded-full text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110', positionCls)}
        style={{ background: config.primaryColor }}
      >
        {open ? '✕' :
          config.bubbleIcon === 'chat' ? <MessageCircle className="h-6 w-6" /> :
          config.bubbleIcon === 'message' ? <Mail className="h-6 w-6" /> :
          <HelpCircle className="h-6 w-6" />
        }
      </button>
    </>
  );
}

function SwitchRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}): JSX.Element {
  return (
    <label className="flex items-center justify-between p-3 rounded-card bg-bg-light dark:bg-bg-dark cursor-pointer">
      <div>
        <p className="text-body font-medium">{label}</p>
        {hint && <p className="text-small text-muted-light dark:text-muted-dark">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 rounded-full transition-colors flex-shrink-0', checked ? 'bg-primary' : 'bg-border-light dark:bg-border-dark')}
        role="switch"
        aria-checked={checked}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all', checked ? 'start-0.5' : 'end-0.5')} />
      </button>
    </label>
  );
}

function shade(hex: string, percent: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const adjust = (v: number): number =>
    Math.max(0, Math.min(255, Math.round(v + (percent / 100) * 255)));
  return '#' + [adjust(r), adjust(g), adjust(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}
