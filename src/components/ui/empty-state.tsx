import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ElementType;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'لا توجد بيانات',
  message,
  action,
  className,
  compact = false,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'py-16',
        className
      )}
    >
      <div
        className={cn(
          'rounded-2xl bg-muted/40 flex items-center justify-center mb-4',
          compact ? 'h-14 w-14' : 'h-20 w-20'
        )}
      >
        <Icon
          className={cn('text-muted-foreground/60', compact ? 'h-6 w-6' : 'h-9 w-9')}
        />
      </div>
      <p className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>
        {title}
      </p>
      {message && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
