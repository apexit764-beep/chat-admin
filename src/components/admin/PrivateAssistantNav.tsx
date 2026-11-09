import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { to: '/ai-balance', label: 'أرصدة العملاء', end: false },
  { to: '/ai-balance/settings', label: 'إعدادات الرصيد', end: true },
];

/** Header shared by every «المساعد الخاص» page: back link, title and tabs */
export function PrivateAssistantNav(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <div className="space-y-3">
      <Link
        to="/widget"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        إعدادات المساعد الذكي
      </Link>
      <h2 className="text-2xl font-bold">المساعد الخاص</h2>
      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => {
              // «أرصدة العملاء» stays active on a client's detail page, but not on the settings tab
              const active = t.to === '/ai-balance' ? isActive && !pathname.endsWith('/settings') : isActive;
              return cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              );
            }}
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
