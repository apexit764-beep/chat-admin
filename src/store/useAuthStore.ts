import { create } from 'zustand';

interface AuthUser {
  email: string;
  name: string;
  role: 'admin';
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const STORAGE_KEY = 'apex_admin_auth';

function readInitial(): { isAuthenticated: boolean; user: AuthUser | null } {
  if (typeof window === 'undefined') return { isAuthenticated: false, user: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, user: null };
    const parsed = JSON.parse(raw) as AuthUser;
    return { isAuthenticated: true, user: parsed };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

const initial = readInitial();

const ADMIN_CREDS = { email: 'admin@apexes.click', password: 'admin123', name: 'محمد الكندي' };

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: initial.isAuthenticated,
  user: initial.user,
  login: (email, password) => {
    const cleaned = email.trim().toLowerCase();
    if (cleaned === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
      const user: AuthUser = { email: cleaned, name: ADMIN_CREDS.name, role: 'admin' };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {/*ignore*/}
      set({ isAuthenticated: true, user });
      return { ok: true };
    }
    return { ok: false, error: 'بيانات الدخول غير صحيحة' };
  },
  logout: () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {/*ignore*/}
    set({ isAuthenticated: false, user: null });
  },
}));
