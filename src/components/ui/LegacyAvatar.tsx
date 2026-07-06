import { cn } from '@/lib/utils';
import { initials, avatarColor } from '@/utils/format';

interface LegacyAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  status?: 'online' | 'busy' | 'offline';
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

const statusDot = {
  online: 'bg-emerald-500',
  busy: 'bg-amber-500',
  offline: 'bg-muted-foreground/40',
};

export function LegacyAvatar({ name, size = 'md', className, status }: LegacyAvatarProps) {
  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold',
          sizeMap[size],
          avatarColor(name),
          className,
        )}
      >
        {initials(name)}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 start-0 h-2.5 w-2.5 rounded-full ring-2 ring-card',
            statusDot[status],
          )}
        />
      )}
    </div>
  );
}
