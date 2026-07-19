import { useNavigate } from 'react-router-dom';
import { Bell, CreditCard, Users, Package, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useNotificationStore, type NotificationType } from '@/store/useNotificationStore';
import { timeAgo } from '@/utils/format';

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

export function NotificationDropdown(): JSX.Element {
  const navigate = useNavigate();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const unreadCount = useNotificationStore((s) => s.unreadCount)();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold text-white bg-destructive rounded-full ring-2 ring-background">
                  {unreadCount > 9 ? '+9' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>الإشعارات</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 rounded-2xl shadow-xl border border-border/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">الإشعارات</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-bold">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3" />
              تعيين الكل كمقروء
            </Button>
          )}
        </div>

        {/* Notification list */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-border/30">
              {sorted.map((notification) => {
                const Icon = typeIcons[notification.type];
                const colorClass = typeColors[notification.type];

                return (
                  <button
                    key={notification.id}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/50',
                      !notification.read && 'bg-primary/[0.03]'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl mt-0.5',
                        colorClass
                      )}
                    >
                      <Icon className="h-4 w-4" />
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
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1">
                        {timeAgo(notification.timestamp)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notification.read && (
                      <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        <div className="border-t border-border/40 px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/notifications')}
          >
            عرض جميع الإشعارات
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
