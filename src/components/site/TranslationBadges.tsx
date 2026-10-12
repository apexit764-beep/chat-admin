import { missingTranslations } from '@/utils/siteContent';
import { cn } from '@/lib/utils';

/** «ع ✓ · EN ⚠ 3» — عدد الحقول الناقصة لكل لغة في أي عنصر */
export function TranslationBadges({ entity, className }: { entity: unknown; className?: string }): JSX.Element {
  const missing = missingTranslations(entity);
  return (
    <span className={cn('inline-flex gap-1', className)}>
      {(['ar', 'en'] as const).map((l) => {
        const n = missing[l];
        return (
          <span
            key={l}
            title={n === 0 ? 'الترجمة مكتملة' : `${n} حقول ناقصة`}
            className={cn(
              'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
              n === 0 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            )}
          >
            {l === 'ar' ? 'ع' : 'EN'} {n === 0 ? '✓' : `⚠ ${n}`}
          </span>
        );
      })}
    </span>
  );
}
