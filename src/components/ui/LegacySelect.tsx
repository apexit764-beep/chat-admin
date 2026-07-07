import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LegacySelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const LegacySelect = forwardRef<HTMLSelectElement, LegacySelectProps>(
  ({ className, label, children, ...props }, ref) => (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-muted-foreground block">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'appearance-none bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all w-full h-10 pe-9 cursor-pointer',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  ),
);
LegacySelect.displayName = 'LegacySelect';
