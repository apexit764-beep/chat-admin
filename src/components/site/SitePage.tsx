import { createContext, ReactNode, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublishBar, type Scopes } from './PublishBar';
import { TranslationBadges } from './TranslationBadges';

/** شاشة تُعرض داخل شاشة أخرى (قائمة الآراء داخل سكشن الآراء مثلاً) */
const Embedded = createContext<{ title?: string } | null>(null);

/**
 * يضع شاشة «موقع» داخل شاشة أخرى: تُرسم بعنوان فرعي، بلا زرّ رجوع ولا شريط
 * نشر — الشاشة المضيفة تنشر الأقسام كلها من شريط واحد.
 */
export function SiteEmbed({ title, children }: { title?: string; children: ReactNode }): JSX.Element {
  return <Embedded.Provider value={{ title }}>{children}</Embedded.Provider>;
}

/**
 * إطار شاشات «الموقع»: عنوان بنمط اللوحة، سطر يقول أين يظهر المحتوى، إجراءات
 * في جهة النهاية، وشريط النشر لقسم الشاشة.
 */
export function SitePage({
  title,
  lede,
  back,
  actions,
  scope,
  badges,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  /** رابط الرجوع — للشاشات الفرعية */
  back?: string;
  actions?: ReactNode;
  /** أقسام المحتوى التي تحرّرها الشاشة — تحدّد ما ينشره الشريط */
  scope?: Scopes;
  /** كيان تُعدّ ترجماته في الرأس */
  badges?: unknown;
  children: ReactNode;
}): JSX.Element {
  const embedded = useContext(Embedded);

  if (embedded) {
    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold">{embedded.title ?? title}</h3>
            {lede && <p className="text-sm text-muted-foreground">{lede}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {badges !== undefined && <TranslationBadges entity={badges} />}
            {actions}
          </div>
        </div>
        {children}
      </section>
    );
  }

  return (
    <div className="p-4 lg:p-6 flex flex-col min-h-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {back && (
            <Button variant="ghost" size="icon" asChild>
              <Link to={back} aria-label="رجوع">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">{title}</h2>
            {lede && <p className="text-sm text-muted-foreground">{lede}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {badges !== undefined && <TranslationBadges entity={badges} />}
          {actions}
        </div>
      </div>
      <div className="flex-1 space-y-5">{children}</div>
      <PublishBar scope={scope} />
    </div>
  );
}
