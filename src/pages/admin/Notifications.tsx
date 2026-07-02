import { useState } from 'react';
import {
  Bell,
  CreditCard,
  Users,
  Package,
  AlertTriangle,
  Check,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useNotificationStore,
  type NotificationType,
} from '@/store/useNotificationStore';
import { timeAgo } from '@/utils/format';

type FilterTab = 'all' | 'unread' | NotificationType;

const typeIcons: Record<NotificationType, React.ElementType> = {
  client: Users,
  payment: CreditCard,
  subscription: Package,
  system: Bell,
  alert: AlertTriangle,
};

const typeColors: Record<NotificationType, string> = {
  client: 'text-blue-500 bg-blue-500/10',
  payment: 'text-emerald-500 bg-emerald-500/10',
  subscription: 'text-violet-500 bg-violet-500/10',
  system: 'text-slate-500 bg-slate-500/10',
  alert: 'text-amber-500 bg-amber-500/10',
};

const tabs: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'unread', label: 'غير مقروءة' },
  { value: 'client', label: 'عملاء' },
  { value: 'payment', label: 'مدفوعات' },
  { value: 'subscription', label: 'اشتراكات' },
  { value: 'system', label: 'النظام' },
  { value: 'alert', label: 'تنبيهات' },
];

export default function Notifications(): JSX.Element {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const unreadCount = useNotificationStore((s) => s.unreadCount)();

  const filtered = [...notifications]
    .filter((n) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !n.read;
      return n.type === activeTab;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return (
    <div className="p-4 lg:p-6 space-y-6 page-fade">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">الإشعارات</h2>
          <p className="text-sm text-muted-foreground">
            جميع الإشعارات والتنبيهات
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={markAllAsRead}
          >
            <Check className="h-4 w-4" />
            تعيين الكل كمقروء
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-bold ms-1">
              {unreadCount}
            </Badge>
          </Button>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Bell className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-sm">لا توجد إشعارات</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((notification) => {
            const Icon = typeIcons[notification.type];
            const colorClass = typeColors[notification.type];

            return (
              <Card
                key={notification.id}
                className={cn(
                  'group flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50',
                  !notification.read && 'bg-primary/[0.03] border-primary/10'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl mt-0.5',
                    colorClass
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm leading-tight',
                      notification.read
                        ? 'font-normal text-foreground/80'
                        : 'font-bold text-foreground'
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                    {timeAgo(notification.timestamp)}
                  </p>
                </div>

                {/* Unread dot */}
                {!notification.read && (
                  <span className="flex-shrink-0 h-2.5 w-2.5 mt-2 rounded-full bg-primary" />
                )}

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
