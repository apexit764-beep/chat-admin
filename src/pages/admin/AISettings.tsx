import { useState } from 'react';
import {
  Sparkles,
  Link2,
  Languages,
  BookOpen,
  ArrowLeftRight,
  Eye,
  EyeOff,
  ExternalLink,
  RotateCcw,
  Clock,
  UserCheck,
  X,
  Plus,
  Ban,
  MessageSquareText,
  Mic,
} from 'lucide-react';
import { useSettingsStore, type AISettings } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export type AITab = 'connection' | 'language' | 'knowledge' | 'handoff';

export const AI_TABS: { key: AITab; label: string; icon: React.ElementType }[] = [
  { key: 'connection', label: 'إعدادات الربط', icon: Link2 },
  { key: 'language', label: 'اللغة والأسلوب', icon: Mic },
  { key: 'knowledge', label: 'المعرفة والقيود', icon: BookOpen },
  { key: 'handoff', label: 'التحويل والجدولة', icon: ArrowLeftRight },
];

const PROVIDERS: { value: AISettings['provider']; label: string; desc: string; icon: string }[] = [
  { value: 'chatgpt', label: 'ChatGPT', desc: 'الأشهر — مجموعة GPT-4o', icon: '/icons/openai.svg' },
  { value: 'claude', label: 'Claude', desc: 'الأذكى في التحليل والمحادثات الطويلة', icon: '/icons/claude.svg' },
  { value: 'gemini', label: 'Gemini', desc: 'سياق طويل ودعم وسائط متعددة', icon: '/icons/gemini.svg' },
];

const MODELS: Record<AISettings['provider'], { value: string; label: string; desc: string }[]> = {
  chatgpt: [
    { value: 'gpt-4o-mini', label: 'GPT-4o mini · موصى به', desc: 'سريع واقتصادي — مناسب لمعظم الردود' },
    { value: 'gpt-4o', label: 'GPT-4o', desc: 'أقوى — للمحادثات المعقدة' },
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini', desc: 'أحدث وأسرع' },
  ],
  claude: [
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 · موصى به', desc: 'توازن بين السرعة والجودة' },
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', desc: 'الأسرع والأوفر' },
  ],
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash · موصى به', desc: 'سريع ومتعدد الاستخدام' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', desc: 'الأقوى من Google' },
  ],
};

const TONES: { value: AISettings['tone']; label: string; desc: string; icon: string }[] = [
  { value: 'concise', label: 'مختصر ومباشر', desc: 'إجابات سريعة بدون تفاصيل زائدة', icon: '⚡' },
  { value: 'friendly', label: 'ودود وحماسي', desc: 'لطيف، يستخدم رموز تعبيرية أحياناً', icon: '😊' },
  { value: 'formal', label: 'رسمي ومحترف', desc: 'لغة جدية احترامية ومنظمة', icon: '🏛️' },
  { value: 'luxury', label: 'فاخر وراقي', desc: 'أسلوب أنيق يناسب العلامات الفاخرة', icon: '👑' },
];

const DIALECTS: { value: AISettings['dialect']; label: string; desc: string }[] = [
  { value: 'fus7a', label: 'فصحى مبسّطة', desc: 'مفهومة لكل العرب' },
  { value: 'khaleeji', label: 'خليجية', desc: 'لهجة دول الخليج المتحدة' },
  { value: 'masri', label: 'مصرية', desc: 'لهجة مصرية شعبية' },
  { value: 'shami', label: 'شامية', desc: 'سوريا، لبنان، الأردن، فلسطين' },
];

const LANGUAGES: { code: string; label: string; labelEn: string }[] = [
  { code: 'ar', label: 'العربية', labelEn: 'AR' },
  { code: 'en', label: 'English', labelEn: 'EN' },
];

const DAYS: { value: string; label: string }[] = [
  { value: 'sunday', label: 'الأحد' },
  { value: 'monday', label: 'الإثنين' },
  { value: 'tuesday', label: 'الثلاثاء' },
  { value: 'wednesday', label: 'الأربعاء' },
  { value: 'thursday', label: 'الخميس' },
  { value: 'friday', label: 'الجمعة' },
  { value: 'saturday', label: 'السبت' },
];

export default function AISettingsPage(): JSX.Element {
  const ai = useSettingsStore((s) => s.ai);
  const setAI = useSettingsStore((s) => s.setAI);
  const showToast = useUIStore((s) => s.showToast);

  const [tab, setTab] = useState<AITab>('connection');
  const [showKey, setShowKey] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = (): void => {
    const kw = newKeyword.trim();
    if (!kw || ai.handoffKeywords.includes(kw)) return;
    setAI({ handoffKeywords: [...ai.handoffKeywords, kw] });
    setNewKeyword('');
  };

  const removeKeyword = (kw: string): void => {
    setAI({ handoffKeywords: ai.handoffKeywords.filter((k) => k !== kw) });
  };

  const toggleLang = (code: string): void => {
    if (ai.languages.includes(code)) {
      if (ai.languages.length <= 1) return;
      setAI({ languages: ai.languages.filter((l) => l !== code) });
    } else {
      setAI({ languages: [...ai.languages, code] });
    }
  };

  const toggleDay = (day: string): void => {
    if (ai.workDays.includes(day)) {
      setAI({ workDays: ai.workDays.filter((d) => d !== day) });
    } else {
      setAI({ workDays: [...ai.workDays, day] });
    }
  };

  const handleReset = (): void => {
    showToast('تم إعادة ضبط الإعدادات', 'success');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">إعدادات الذكاء الاصطناعي</h2>
          <p className="text-sm text-muted-foreground">تحكم كامل في طريقة رد المساعد الذكي على عملائك</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          إعادة ضبط
        </Button>
      </div>

      {/* AI Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-11 w-11 rounded-xl flex items-center justify-center',
                ai.enabled ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">المساعد الذكي</p>
                <p className="text-sm text-muted-foreground">
                  {ai.enabled ? 'مفعّل — يرد على عملائك تلقائياً حسب الإعدادات' : 'معطّل — لن يرد على أي عميل'}
                </p>
              </div>
            </div>
            <Switch checked={ai.enabled} onCheckedChange={(v) => setAI({ enabled: v })} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-0 -mb-px overflow-x-auto">
          {AI_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  tab === t.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {tab === 'connection' && <ConnectionTab ai={ai} setAI={setAI} showKey={showKey} setShowKey={setShowKey} />}
      {tab === 'language' && <LanguageTab ai={ai} setAI={setAI} toggleLang={toggleLang} />}
      {tab === 'knowledge' && <KnowledgeTab ai={ai} setAI={setAI} />}
      {tab === 'handoff' && (
        <HandoffTab
          ai={ai}
          setAI={setAI}
          newKeyword={newKeyword}
          setNewKeyword={setNewKeyword}
          addKeyword={addKeyword}
          removeKeyword={removeKeyword}
          toggleDay={toggleDay}
        />
      )}
    </div>
  );
}

/* ─── Tab 1: Connection ─── */
export function ConnectionTab({
  ai, setAI, showKey, setShowKey,
}: {
  ai: AISettings;
  setAI: (p: Partial<AISettings>) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
}): JSX.Element {
  return (
    <div className="space-y-5">
      {/* Provider */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">المصدر</h3>
          <p className="text-sm text-muted-foreground">اختر مزوّد الـ AI (Claude / ChatGPT / Gemini). المفتاح محفوظ عندك ولا يُشارَك مع أي طرف ثالث.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setAI({ provider: p.value, model: MODELS[p.value][0].value })}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 text-start transition-all',
                  ai.provider === p.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                )}
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  {p.value === 'chatgpt' ? '🤖' : p.value === 'claude' ? '🧠' : '✨'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
                </div>
                {ai.provider === p.value && (
                  <div className="ms-auto text-primary">✓</div>
                )}
              </button>
            ))}
          </div>

          <Separator />

          {/* API Key */}
          <div className="space-y-2">
            <Label>مفتاح API</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={ai.apiKey}
                  onChange={(e) => setAI({ apiKey: e.target.value })}
                  placeholder="sk-..."
                  dir="ltr"
                  className="pe-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <a
              href={
                ai.provider === 'chatgpt'
                  ? 'https://platform.openai.com/api-keys'
                  : ai.provider === 'claude'
                    ? 'https://console.anthropic.com/settings/keys'
                    : 'https://aistudio.google.com/apikey'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              احصل على مفتاح API
            </a>
          </div>

          <Separator />

          {/* Model */}
          <div className="space-y-2">
            <Label>النموذج</Label>
            <Select value={ai.model} onValueChange={(v) => setAI({ model: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS[ai.provider].map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {MODELS[ai.provider].find((m) => m.value === ai.model)?.desc}
            </p>
          </div>

          <Separator />

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label>حد طول الرد</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={ai.maxTokens}
                onChange={(e) => setAI({ maxTokens: Number(e.target.value) || 600 })}
                className="w-28 font-mono text-sm"
                dir="ltr"
                min={100}
                max={4000}
              />
              <span className="text-sm text-muted-foreground">رمز</span>
            </div>
            <p className="text-xs text-muted-foreground">
              الحد الأقصى لطول الرد بالرموز (tokens). {ai.maxTokens} رمز ≈ {Math.round(ai.maxTokens * 0.75)} كلمة.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Tab 2: Language & Style ─── */
export function LanguageTab({
  ai, setAI, toggleLang,
}: {
  ai: AISettings;
  setAI: (p: Partial<AISettings>) => void;
  toggleLang: (code: string) => void;
}): JSX.Element {
  return (
    <div className="space-y-5">
      {/* Languages */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">لغات الرد</h3>
          </div>
          <p className="text-sm text-muted-foreground">المساعد يكتشف لغة العميل ويرد بها تلقائياً. اختر اللغات المدعومة.</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleLang(l.code)}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all min-w-[140px] justify-between',
                  ai.languages.includes(l.code)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <span className="font-medium">{l.label}</span>
                <Badge variant="secondary" className="text-xs">{l.labelEn}</Badge>
                {ai.languages.includes(l.code) && (
                  <span className="text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tone */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">نبرة وأسلوب الرد</h3>
          </div>
          <p className="text-sm text-muted-foreground">حدّد شخصية المساعد عند التحدث مع العملاء.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setAI({ tone: t.value })}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 text-start transition-all',
                  ai.tone === t.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <span className="text-xl">{t.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialect */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">اللهجة العربية</h3>
          </div>
          <p className="text-sm text-muted-foreground">لهجة الرد عندما يكون العميل عربياً.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DIALECTS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setAI({ dialect: d.value })}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all',
                  ai.dialect === d.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                {ai.dialect === d.value && (
                  <div className="h-4 w-4 rounded-full border-[5px] border-primary" />
                )}
                {ai.dialect !== d.value && (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
                )}
                <p className="text-sm font-semibold">{d.label}</p>
                <p className="text-xs text-muted-foreground">{d.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Tab 3: Knowledge & Restrictions ─── */
export function KnowledgeTab({
  ai, setAI,
}: {
  ai: AISettings;
  setAI: (p: Partial<AISettings>) => void;
}): JSX.Element {
  return (
    <div className="space-y-5">
      {/* Company Prompt */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">معرفة الشركة (Prompt)</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            اكتب كل ما يعتمد عليه المساعد للرد: وصف الشركة، الخدمات، الأسعار المحددة، طريق الدقيق، قواعد التحويل، أي تفاصيل يحتاجها.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            value={ai.companyPrompt}
            onChange={(e) => setAI({ companyPrompt: e.target.value })}
            placeholder="مثال: نحن شركة دعم فني عبر الواتساب والبريد، ساعات عمل من 9 ص إلى 5 م..."
            rows={8}
            maxLength={4000}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              <Sparkles className="h-3 w-3 inline me-1" />
              نصيحة: اكتب الأسماء والأسعار بوضوح ليستخدمها المساعد مباشرة.
            </p>
            <span>{ai.companyPrompt.length} / 4,000 حرف</span>
          </div>
        </CardContent>
      </Card>

      {/* Learning Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">مصادر التعلم</h3>
          </div>
          <p className="text-sm text-muted-foreground">حدد المصادر التي يتعلم منها المساعد الذكي لتحسين جودة ردوده على العملاء.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[
              { key: 'learnFromDocs' as const, label: 'التعلم من الوثائق المرفوعة', desc: 'يستخدم الملفات والمستندات المرفوعة كمرجع' },
              { key: 'learnFromReplies' as const, label: 'التعلم من ردود الموظفين', desc: 'يتعلم من أسلوب وطريقة رد الموظفين' },
              { key: 'learnFromKnowledge' as const, label: 'التعلم من مقالات قاعدة المعرفة', desc: 'يستخدم المقالات المنشورة في قاعدة المعرفة' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 px-1 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={ai[item.key]}
                  onCheckedChange={(v) => setAI({ [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forbidden Topics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">مواضيع ممنوعة</h3>
          </div>
          <p className="text-sm text-muted-foreground">مواضيع يجب ألا يتحدث عنها المساعد أبداً — موضوع في كل سطر.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>قائمة المواضيع</Label>
            <Textarea
              value={ai.forbiddenTopics}
              onChange={(e) => setAI({ forbiddenTopics: e.target.value })}
              placeholder={"أسعار المنافسين أو مقارنات معهم\nوعود بمدد إنجاز خارج المعلن\nمعلومات داخلية أو مالية عن الشركة\nمواضيع سياسية أو دينية\nنصائح قانونية أو طبية"}
              rows={5}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>رسالة الرد على المواضيع الممنوعة</Label>
            <Textarea
              value={ai.forbiddenReply}
              onChange={(e) => setAI({ forbiddenReply: e.target.value })}
              placeholder="عذراً لا أستطيع المساعدة في هذا الموضوع..."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">هذه الرسالة يرسلها المساعد للعميل تلقائياً عندما يطلب أحد المواضيع أعلاه.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Tab 4: Handoff & Scheduling ─── */
export function HandoffTab({
  ai, setAI, newKeyword, setNewKeyword, addKeyword, removeKeyword, toggleDay,
}: {
  ai: AISettings;
  setAI: (p: Partial<AISettings>) => void;
  newKeyword: string;
  setNewKeyword: (v: string) => void;
  addKeyword: () => void;
  removeKeyword: (kw: string) => void;
  toggleDay: (day: string) => void;
}): JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Human Handoff */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">التحويل لموظف بشري</h3>
          </div>
          <p className="text-sm text-muted-foreground">متى يحوّل المساعد المحادثة لموظف بشري، ولمَن تذهب المحادثة بعد التحويل.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[
              { key: 'handoffOnRequest' as const, label: 'عند طلب العميل التحدث مع موظف بشكل مباشر' },
              { key: 'handoffOnFailure' as const, label: 'عند عجز المساعد عن الإجابة' },
              { key: 'handoffOnNegative' as const, label: 'عند الكشف عن انفعال سلبي' },
              { key: 'handoffOnRepeat' as const, label: 'عند تكرار نفس السؤال أكثر من مرة' },
              { key: 'handoffOnPayment' as const, label: 'عند السؤال عن الدفع أو الاسترداد' },
              { key: 'handoffOnUrgent' as const, label: 'عند وجود طلب عاجل أو حساس' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 px-1">
                <p className="text-sm">{item.label}</p>
                <Switch
                  checked={ai[item.key]}
                  onCheckedChange={(v) => setAI({ [item.key]: v })}
                />
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Keywords */}
          <div className="space-y-3">
            <Label>كلمات مفتاحية تُفعّل التحويل</Label>
            <div className="flex flex-wrap gap-2">
              {ai.handoffKeywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="gap-1 px-2.5 py-1 text-xs">
                  {kw}
                  <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="أضف كلمة مفتاحية..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button variant="outline" size="icon" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">لما يذكر العميل أي من هذه الكلمات — تحويل فوري لموظف.</p>
          </div>

          <Separator className="my-4" />

          {/* Assign to */}
          <div className="space-y-2">
            <Label>تحويل المحادثة إلى موظف</Label>
            <Select value={ai.handoffAssignee} onValueChange={(v) => setAI({ handoffAssignee: v })}>
              <SelectTrigger>
                <SelectValue placeholder="— اختر موظف —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">— اختر موظف —</SelectItem>
                <SelectItem value="auto">تلقائي (أقل عبء)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">المحادثة تُحوّل لهذا الموظف عند تفعيل أي شرط من الأعلى.</p>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">ساعات عمل المساعد</h3>
          </div>
          <p className="text-sm text-muted-foreground">المساعد الذكي يعمل دائماً افتراضياً. حدّد دوام الموظفين البشريين — خارجه يرد المساعد ويسجّل الطلب.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">تشغيل المساعد 24/7</p>
              <p className="text-xs text-muted-foreground">المساعد يرد في كل الأوقات بدون قيود دوام.</p>
            </div>
            <Switch checked={ai.is24_7} onCheckedChange={(v) => setAI({ is24_7: v })} />
          </div>

          {!ai.is24_7 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>دوام الموظفين البشريين</Label>
                <p className="text-xs text-muted-foreground">اختر أيام العمل</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                        ai.workDays.includes(d.value)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>ساعات العمل للأيام المختارة</Label>
                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">من</span>
                    <Input
                      type="time"
                      value={ai.workFrom}
                      onChange={(e) => setAI({ workFrom: e.target.value })}
                      className="w-32"
                      dir="ltr"
                    />
                  </div>
                  <span className="text-muted-foreground mt-5">—</span>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">إلى</span>
                    <Input
                      type="time"
                      value={ai.workTo}
                      onChange={(e) => setAI({ workTo: e.target.value })}
                      className="w-32"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>رسالة خارج الدوام</Label>
                <Textarea
                  value={ai.offlineMessage}
                  onChange={(e) => setAI({ offlineMessage: e.target.value })}
                  rows={3}
                  placeholder="أهلاً خارج ساعات الدوام حالياً..."
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
