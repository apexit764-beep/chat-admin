import { cn } from '@/lib/utils';
import { initials } from '@/utils/format';

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

const colorPalette = [
  'bg-primary/20 text-primary',
  'bg-blue-500/20 text-blue-600',
  'bg-emerald-500/20 text-emerald-600',
  'bg-amber-500/20 text-amber-600',
  'bg-rose-500/20 text-rose-600',
  'bg-whatsapp/20 text-whatsapp',
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

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
