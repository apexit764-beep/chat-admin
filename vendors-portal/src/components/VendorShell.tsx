import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Home, Users, Wallet, UserCog, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast } from '@/components/ui/Toast';
import { useVendorStore } from '@v/store/useVendorStore';
import { FX } from '@v/lib/vendorMath';
import { Note } from './ui-bits';

const NAV = [
  { to: '/home', label: 'الرئيسية', icon: Home },
  { to: '/clients', label: 'العملاء', icon: Users },
  { to: '/payouts', label: 'السحب', icon: Wallet },
  { to: '/account', label: 'حسابي', icon: UserCog },
];

export function VendorShell(): JSX.Element {
  const navigate = useNavigate();
  const me = useVendorStore((s) => s.vendors.find((v) => v.id === s.meId));
  const logout = useVendorStore((s) => s.logout);
  if (!me) return <Navigate to="/login" replace />;
  if (me.status === 'مجمّد') {
    logout();
    return <Navigate to="/login" replace />;
  }

  const link = ({ isActive }: { isActive: boolean }): string =>
    cn(
      'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
      isActive ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
    );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-56 flex-none flex-col bg-emerald-900 p-4 text-white md:flex">
        <div className="text-lg font-extrabold">Qhub Partners</div>
        <div className="mb-5 text-xs text-white/60">لوحة المورد</div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={link}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="text-xs leading-relaxed text-white/75">
            {me.name}
            <br />
            {me.country} · {FX[me.cur].sym}
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-1 overflow-x-auto bg-emerald-900 p-2 md:hidden">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('whitespace-nowrap rounded-lg px-3 py-1.5 text-sm', isActive ? 'bg-white/15 text-white' : 'text-white/70')}>
              {label}
            </NavLink>
          ))}
          <button className="mr-auto whitespace-nowrap px-3 text-sm text-white/70" onClick={() => { logout(); navigate('/login'); }}>
            خروج
          </button>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
}

export function FrozenNote(): JSX.Element | null {
  return <Note tone="error">حسابك مجمّد حاليًا. تواصل مع فريق Qhub.</Note>;
}
