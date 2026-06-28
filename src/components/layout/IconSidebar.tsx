import { NavLink } from 'react-router-dom';
import {
  Inbox as InboxIcon,
  Users,
  BarChart3,
  Megaphone,
  UsersRound,
  MessageSquareQuote,
  Settings,
  LogOut,
  HelpCircle,
  Building2,
  Smartphone,
  Sparkles,
  Globe,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { Avatar } from '@components/ui';
import { cn } from '@/utils/cn';

const mainNav = [
  { to: '/inbox', label: 'صندوق الوارد', icon: InboxIcon, badgeKey: 'inboxUnread' as const },
  { to: '/contacts', label: 'جهات الاتصال', icon: Users },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
];

const orgNav = [
  { to: '/channels', label: 'القنوات', icon: Smartphone },
  { to: '/departments', label: 'الأقسام', icon: Building2 },
  { to: '/team', label: 'الفريق', icon: UsersRound },
];

const featuresNav = [
  { to: '/campaigns', label: 'الحملات', icon: Megaphone },
  { to: '/saved-replies', label: 'الردود المحفوظة', icon: MessageSquareQuote },
  { to: '/widget', label: 'Live Chat Widget', icon: Globe },
  { to: '/integrations', label: 'التكاملات', icon: Sparkles },
];

const billingNav = [
  { to: '/billing', label: 'الفوترة والاشتراك', icon: CreditCard },
];

import { useState } from 'react';
import { HelpDrawer } from './HelpDrawer';

export function IconSidebar(): JSX.Element {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const conversations = useDataStore((s) => s.conversations);
  const inboxUnread = conversations.reduce((acc, c) => acc + (c.unreadCount > 0 ? 1 : 0), 0);
  const [helpOpen, setHelpOpen] = useState(false);

  const renderItem = (item: { to: string; label: string; icon: typeof InboxIcon; badgeKey?: 'inboxUnread' }): JSX.Element => {
    const Icon = item.icon;
    const badge = item.badgeKey === 'inboxUnread' ? inboxUnread : 0;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        title={item.label}
        className={({ isActive }) =>
          cn(
            'h-9 w-9 rounded-lg flex items-center justify-center transition-colors relative group',
            isActive
              ? 'bg-primary text-white'
              : 'text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark hover:text-current'
          )
        }
      >
        <Icon className="h-[18px] w-[18px]" />
        {badge > 0 && (
          <span className="absolute -top-1 -end-1 h-4 min-w-4 px-1 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-dark">
            {badge}
          </span>
        )}
        <span className="absolute start-full ms-2 px-2 py-1 bg-[#111827] text-white text-small rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
          {item.label}
        </span>
      </NavLink>
    );
  };

  return (
    <aside className="w-[52px] flex-shrink-0 h-screen sticky top-0 bg-white dark:bg-surface-dark border-l border-border-light dark:border-border-dark flex flex-col items-center py-3 z-30">
      <NavLink to="/inbox" className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-primary/20 mb-4">
        س
      </NavLink>

      <nav className="flex flex-col gap-1 flex-1">
        {mainNav.map(renderItem)}
        <div className="h-px w-6 bg-border-light dark:bg-border-dark my-1.5 mx-auto" />
        {orgNav.map(renderItem)}
        <div className="h-px w-6 bg-border-light dark:bg-border-dark my-1.5 mx-auto" />
        {featuresNav.map(renderItem)}
        <div className="h-px w-6 bg-border-light dark:bg-border-dark my-1.5 mx-auto" />
        {billingNav.map(renderItem)}
      </nav>

      <div className="flex flex-col items-center gap-1 mt-auto">
        <NavLink
          to="/settings"
          title="الإعدادات"
          className={({ isActive }) =>
            cn(
              'h-9 w-9 rounded-lg flex items-center justify-center transition-colors',
              isActive
                ? 'bg-primary text-white'
                : 'text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark hover:text-current'
            )
          }
        >
          <Settings className="h-[18px] w-[18px]" />
        </NavLink>
        <button
          title="المساعدة"
          onClick={() => setHelpOpen(true)}
          className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark hover:text-current transition-colors"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>
        <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />
        <button
          onClick={logout}
          title={user ? `تسجيل الخروج (${user.name})` : 'تسجيل الخروج'}
          className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-danger/10 hover:text-danger transition-colors mb-1"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
        {user && <Avatar name={user.name} size="xs" />}
      </div>
    </aside>
  );
}
