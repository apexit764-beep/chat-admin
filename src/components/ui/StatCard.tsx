import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: { value: number; positive: boolean };
}

export function StatCard({
  label,
  value,
  icon,
  iconBg = 'bg-primary/15',
  iconColor = 'text-primary',
  trend,
}: StatCardProps): JSX.Element {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center', iconBg, iconColor)}>
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md',
              trend.positive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
            )}
          >
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
}
