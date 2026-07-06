import { useState } from 'react';
import {
  MessageCircle,
  MessageSquare,
  HelpCircle,
  Copy,
  Check,
  Send,
  X,
  Minus,
  Smile,
  Paperclip,
  ChevronDown,
  Code2,
  Palette,
  Layout,
  Type,
  ToggleRight,
  Globe,
} from 'lucide-react';
import { useSettingsStore, type WidgetSettings as WidgetSettingsType } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ICON_OPTIONS: { value: WidgetSettingsType['bubbleIcon']; label: string; icon: React.ElementType }[] = [
  { value: 'chat', label: 'محادثة', icon: MessageCircle },
  { value: 'message', label: 'رسالة', icon: MessageSquare },
  { value: 'help', label: 'مساعدة', icon: HelpCircle },
];

const COLOR_PRESETS = [
  '#1565A0',
  '#0D9488',
  '#7C3AED',
  '#DC2626',
  '#EA580C',
  '#CA8A04',
  '#16A34A',
  '#2563EB',
  '#DB2777',
  '#4F46E5',
  '#0891B2',
  '#334155',
];

export default function WidgetSettingsPage(): JSX.Element {
  const widget = useSettingsStore((s) => s.widget);
  const setWidget = useSettingsStore((s) => s.setWidget);
  const showToast = useUIStore((s) => s.showToast);

  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);

  const BubbleIcon = ICON_OPTIONS.find((o) => o.value === widget.bubbleIcon)?.icon ?? MessageCircle;

  const embedCode = `<!-- Qhub Live Chat Widget -->
<script>
  (function(w,d,s,o){
    var j=d.createElement(s);j.async=true;
    j.src='https://cdn.qhub.app/widget.js';
    j.onload=function(){w.QhubWidget.init(o)};
    d.head.appendChild(j);
  })(window,document,'script',{
    tenantId: 'YOUR_TENANT_ID',
    color: '${widget.primaryColor}',
    position: '${widget.position}',
    icon: '${widget.bubbleIcon}'
  });
</script>`;

  const handleCopyCode = (): void => {
    navigator.clipboard.writeText(embedCode).catch(() => {});
    setCopied(true);
    showToast('تم نسخ كود التضمين', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">إعدادات الويدجت</h2>
        <p className="text-sm text-muted-foreground">تخصيص شكل وسلوك Live Chat Widget للعملاء المشتركين</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
        {/* Settings Column */}
        <div className="space-y-5">
          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center',
                    widget.enabled ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{widget.enabled ? 'الويدجت مفعّل' : 'الويدجت معطّل'}</p>
                    <p className="text-sm text-muted-foreground">
                      {widget.enabled ? 'يظهر للزوار على مواقع العملاء' : 'مخفي عن جميع الزوار'}
                    </p>
                  </div>
                </div>
                <Switch checked={widget.enabled} onCheckedChange={(v) => setWidget({ enabled: v })} />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">المظهر</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label>اللون الأساسي</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setWidget({ primaryColor: color })}
                      className={cn(
                        'h-9 w-9 rounded-lg transition-all border-2',
                        widget.primaryColor === color
                          ? 'border-foreground scale-110 shadow-md'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="relative">
                    <input
                      type="color"
                      value={widget.primaryColor}
                      onChange={(e) => setWidget({ primaryColor: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer w-9 h-9"
                    />
                    <div className="h-9 w-9 rounded-lg border-2 border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground hover:border-foreground/50 transition-colors">
                      <Palette className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={widget.primaryColor}
                    onChange={(e) => setWidget({ primaryColor: e.target.value })}
                    className="w-32 font-mono text-sm"
                    dir="ltr"
                  />
                  <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: widget.primaryColor }} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>موضع الويدجت</Label>
                  <Select value={widget.position} onValueChange={(v) => setWidget({ position: v as WidgetSettingsType['position'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">أسفل اليمين</SelectItem>
                      <SelectItem value="bottom-left">أسفل اليسار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>أيقونة الفقاعة</Label>
                  <div className="flex gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setWidget({ bubbleIcon: opt.value })}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
                            widget.bubbleIcon === opt.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-muted'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">المحتوى والنصوص</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الفريق</Label>
                  <Input
                    value={widget.teamName}
                    onChange={(e) => setWidget({ teamName: e.target.value })}
                    placeholder="فريق الدعم"
                  />
                </div>
                <div className="space-y-2">
                  <Label>وقت الاستجابة</Label>
                  <Input
                    value={widget.responseTime}
                    onChange={(e) => setWidget({ responseTime: e.target.value })}
                    placeholder="نرد عادةً خلال دقائق"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>رسالة الترحيب</Label>
                <Textarea
                  value={widget.welcomeMessage}
                  onChange={(e) => setWidget({ welcomeMessage: e.target.value })}
                  placeholder="مرحباً! كيف يمكننا مساعدتك؟"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>رسالة الرد التلقائي</Label>
                <Textarea
                  value={widget.autoReplyMessage}
                  onChange={(e) => setWidget({ autoReplyMessage: e.target.value })}
                  placeholder="شكراً لتواصلك! سنرد عليك قريباً."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>رسالة عند عدم التوفر (Offline)</Label>
                <Textarea
                  value={widget.offlineMessage}
                  onChange={(e) => setWidget({ offlineMessage: e.target.value })}
                  placeholder="نحن غير متاحين حالياً..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Behavior */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ToggleRight className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">السلوك والخيارات</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {([
                  { key: 'showAvatar' as const, label: 'عرض صورة الموظف', desc: 'إظهار الأفاتار في المحادثة' },
                  { key: 'collectEmail' as const, label: 'طلب البريد الإلكتروني', desc: 'يُطلب من الزائر قبل بدء المحادثة' },
                  { key: 'collectPhone' as const, label: 'طلب رقم الهاتف', desc: 'حقل اختياري أو إلزامي قبل المحادثة' },
                  { key: 'autoReply' as const, label: 'رد تلقائي', desc: 'إرسال رسالة ترحيبية تلقائية' },
                  { key: 'brandingHidden' as const, label: 'إخفاء شعار Qhub', desc: 'متاح لباقة Business وما فوق' },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 px-1 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={widget[item.key]}
                      onCheckedChange={(v) => setWidget({ [item.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">كود التضمين</h3>
                </div>
                <Badge variant="secondary" className="text-xs">يُنسخ للعملاء</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                يضيفه العميل في موقعه قبل وسم {'<'}/body{'>'} لتفعيل الويدجت
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre
                  dir="ltr"
                  className="bg-muted rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed text-foreground/80 border"
                >
                  {embedCode}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-3 end-3 h-8 gap-1.5"
                  onClick={handleCopyCode}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'تم النسخ' : 'نسخ'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-20 h-fit space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">معاينة مباشرة</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setPreviewOpen(!previewOpen)}
            >
              {previewOpen ? 'إخفاء' : 'عرض'}
            </Button>
          </div>

          {previewOpen && (
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl border overflow-hidden" style={{ height: 580 }}>
              {/* Fake browser bar */}
              <div className="bg-white dark:bg-slate-950 border-b px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-muted rounded-md h-6 mx-4 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground font-mono">example.com</span>
                </div>
              </div>

              {/* Fake page content */}
              <div className="p-6 space-y-3">
                <div className="h-4 w-3/4 bg-white/60 dark:bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/40 dark:bg-white/5 rounded" />
                <div className="h-3 w-5/6 bg-white/40 dark:bg-white/5 rounded" />
                <div className="h-20 w-full bg-white/30 dark:bg-white/5 rounded-lg mt-4" />
                <div className="h-3 w-2/3 bg-white/40 dark:bg-white/5 rounded" />
                <div className="h-3 w-3/4 bg-white/40 dark:bg-white/5 rounded" />
              </div>

              {/* Widget Preview */}
              <div className={cn(
                'absolute bottom-4',
                widget.position === 'bottom-right' ? 'end-4' : 'start-4'
              )}>
                {/* Chat Window */}
                <div
                  className="mb-3 w-[300px] rounded-2xl shadow-2xl overflow-hidden border border-black/10"
                  style={{ direction: 'rtl' }}
                >
                  {/* Header */}
                  <div
                    className="px-4 py-3 text-white"
                    style={{ backgroundColor: widget.primaryColor }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5 opacity-70 cursor-pointer" />
                        <Minus className="h-3.5 w-3.5 opacity-70 cursor-pointer" />
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </div>
                    {widget.showAvatar && (
                      <div className="flex -space-x-2 space-x-reverse mb-2">
                        <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center text-[10px] font-bold">أ</div>
                        <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center text-[10px] font-bold">م</div>
                        <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center text-[10px] font-bold">س</div>
                      </div>
                    )}
                    <p className="text-sm font-bold">{widget.teamName || 'فريق الدعم'}</p>
                    <p className="text-xs opacity-80">{widget.responseTime || 'نرد عادةً خلال دقائق'}</p>
                  </div>
                  {/* Messages */}
                  <div className="bg-white dark:bg-slate-950 px-4 py-3 space-y-2.5 min-h-[140px]">
                    <div className="flex gap-2 items-end">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: widget.primaryColor }}>
                        أ
                      </div>
                      <div className="rounded-xl rounded-br-sm px-3 py-2 text-xs max-w-[200px]"
                        style={{ backgroundColor: widget.primaryColor + '15', color: widget.primaryColor }}
                      >
                        {widget.welcomeMessage || 'مرحباً! كيف يمكننا مساعدتك؟'}
                      </div>
                    </div>
                    {widget.autoReply && (
                      <div className="flex gap-2 items-end">
                        <div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: widget.primaryColor }}>
                          Q
                        </div>
                        <div className="rounded-xl rounded-br-sm px-3 py-2 text-xs bg-muted max-w-[200px] text-muted-foreground">
                          {widget.autoReplyMessage?.slice(0, 60) || 'شكراً لتواصلك!'}
                          {(widget.autoReplyMessage?.length ?? 0) > 60 ? '...' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Input */}
                  <div className="bg-white dark:bg-slate-950 border-t px-3 py-2.5">
                    {widget.collectEmail && (
                      <div className="mb-2 px-1">
                        <div className="h-7 w-full rounded-md border bg-muted/50 flex items-center px-2">
                          <span className="text-[10px] text-muted-foreground">البريد الإلكتروني...</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-8 flex items-center px-3">
                        <span className="text-[10px] text-muted-foreground">اكتب رسالتك...</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        <Smile className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: widget.primaryColor }}>
                          <Send className="h-3 w-3" style={{ transform: 'scaleX(-1)' }} />
                        </div>
                      </div>
                    </div>
                    {!widget.brandingHidden && (
                      <p className="text-center text-[9px] text-muted-foreground/50 mt-1.5">Powered by Qhub</p>
                    )}
                  </div>
                </div>

                {/* Bubble */}
                <div className={cn(
                  'flex',
                  widget.position === 'bottom-right' ? 'justify-end' : 'justify-start'
                )}>
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: widget.primaryColor }}
                  >
                    <BubbleIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
