import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  notificationsOpen: boolean;
  toast: { id: number; message: string; type: 'success' | 'error' | 'info' } | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (v: boolean) => void;
  toggleNotifications: () => void;
  setNotificationsOpen: (v: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  notificationsOpen: false,
  toast: null,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),
  setNotificationsOpen: (v) => set({ notificationsOpen: v }),
  showToast: (message, type = 'success') => {
    const id = Date.now();
    set({ toast: { id, message, type } });
    setTimeout(() => {
      set((s) => (s.toast?.id === id ? { toast: null } : {}));
    }, 3000);
  },
  hideToast: () => set({ toast: null }),
}));
