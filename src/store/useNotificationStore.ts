import { create } from 'zustand';

export type NotificationType = 'client' | 'payment' | 'subscription' | 'system' | 'alert';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: () => number;
}

const STORAGE_KEY = 'qhub_admin_notifications';

function ts(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

const defaultNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'عميل جديد',
    body: 'Dubai Real Estate Co. سجّل في المنصة',
    timestamp: ts(12),
    read: false,
    type: 'client',
  },
  {
    id: 'n2',
    title: 'فاتورة فاشلة',
    body: 'TechFlow Egypt — مبلغ 978 ج.م',
    timestamp: ts(35),
    read: false,
    type: 'payment',
  },
  {
    id: 'n3',
    title: 'فترة تجريبية تنتهي',
    body: 'صالون لمسة جمال — تنتهي خلال 3 أيام',
    timestamp: ts(90),
    read: false,
    type: 'subscription',
  },
  {
    id: 'n4',
    title: 'تجديد اشتراك',
    body: 'Royal Auto Kuwait — باقة المؤسسات',
    timestamp: ts(150),
    read: false,
    type: 'subscription',
  },
  {
    id: 'n5',
    title: 'عميل موقوف',
    body: 'مكتبة المعرفة — دفع متأخر 10 أيام',
    timestamp: ts(240),
    read: false,
    type: 'alert',
  },
  {
    id: 'n6',
    title: 'تحديث نظام',
    body: 'تم تفعيل خاصية الحملات الجماعية',
    timestamp: ts(400),
    read: true,
    type: 'system',
  },
  {
    id: 'n7',
    title: 'تقرير شهري جاهز',
    body: 'إيرادات مايو 2026 — 48,230 د.ك',
    timestamp: ts(720),
    read: true,
    type: 'system',
  },
  {
    id: 'n8',
    title: 'عميل جديد',
    body: 'مطعم بيت الشام — خطة تجريبية',
    timestamp: ts(1080),
    read: false,
    type: 'client',
  },
  {
    id: 'n9',
    title: 'دفعة مستلمة',
    body: 'شركة النور للتجارة — 1,250 ر.س',
    timestamp: ts(1440),
    read: true,
    type: 'payment',
  },
  {
    id: 'n10',
    title: 'ترقية باقة',
    body: 'فندق القصر الذهبي — من الأساسية إلى الاحترافية',
    timestamp: ts(2000),
    read: true,
    type: 'subscription',
  },
  {
    id: 'n11',
    title: 'تنبيه أمان',
    body: 'محاولة دخول مشبوهة من عنوان IP غير معروف',
    timestamp: ts(2880),
    read: false,
    type: 'alert',
  },
  {
    id: 'n12',
    title: 'عميل جديد',
    body: 'عيادة الرازي الطبية — الرياض',
    timestamp: ts(3200),
    read: true,
    type: 'client',
  },
  {
    id: 'n13',
    title: 'إلغاء اشتراك',
    body: 'متجر الأناقة — السبب: تكلفة مرتفعة',
    timestamp: ts(4320),
    read: true,
    type: 'subscription',
  },
  {
    id: 'n14',
    title: 'تحديث نظام',
    body: 'تم إضافة دعم الدفع عبر Apple Pay',
    timestamp: ts(5760),
    read: true,
    type: 'system',
  },
  {
    id: 'n15',
    title: 'فاتورة متأخرة',
    body: 'شركة الخليج للتوظيف — 2,400 د.إ مستحقة منذ 15 يوم',
    timestamp: ts(7200),
    read: true,
    type: 'payment',
  },
  {
    id: 'n16',
    title: 'عميل جديد',
    body: 'أكاديمية المستقبل للتعليم — البحرين',
    timestamp: ts(8640),
    read: true,
    type: 'client',
  },
  {
    id: 'n17',
    title: 'صيانة مجدولة',
    body: 'صيانة الخوادم يوم الجمعة 2:00 ص - 4:00 ص',
    timestamp: ts(10080),
    read: true,
    type: 'system',
  },
  {
    id: 'n18',
    title: 'حد الرسائل',
    body: 'مؤسسة الريادة — وصلت إلى 90% من حد الرسائل الشهري',
    timestamp: ts(11520),
    read: true,
    type: 'alert',
  },
];

function loadNotifications(): Notification[] {
  if (typeof window === 'undefined') return defaultNotifications;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Notification[];
    }
  } catch {
    // ignore
  }
  return defaultNotifications;
}

function persist(notifications: Notification[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: loadNotifications(),

  markAsRead: (id: string) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      persist(notifications);
      return { notifications };
    }),

  markAllAsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, read: true }));
      persist(notifications);
      return { notifications };
    }),

  deleteNotification: (id: string) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      persist(notifications);
      return { notifications };
    }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
