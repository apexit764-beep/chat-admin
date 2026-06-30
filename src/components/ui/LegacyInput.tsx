import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LegacyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const LegacyInput = forwardRef<HTMLInputElement, LegacyInputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-muted-foreground block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all w-full h-10',
            icon && 'pe-10',
            error && 'border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),
);
LegacyInput.displayName = 'LegacyInput';

export interface LegacyTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const LegacyTextarea = forwardRef<HTMLTextAreaElement, LegacyTextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-muted-foreground block">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all w-full min-h-[80px] resize-y',
          error && 'border-destructive',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),
);
LegacyTextarea.displayName = 'LegacyTextarea';
