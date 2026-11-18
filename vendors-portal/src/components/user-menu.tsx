import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useVendorStore } from '@v/store/useVendorStore';
import { FX } from '@v/lib/vendorMath';
import { initialsOf } from './profile-section';

/** signed-in vendor: avatar in the header, with account and sign-out */
export function UserMenu(): JSX.Element | null {
  const navigate = useNavigate();
  const me = useVendorStore((s) => s.vendors.find((v) => v.id === s.meId));
  const logout = useVendorStore((s) => s.logout);
  if (!me) return null;

  const avatar = (size: string): JSX.Element => (
    <Avatar className={`${size} rounded-lg`}>
      {me.avatar && <AvatarImage src={me.avatar} alt={me.name} className="object-cover" />}
      <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-bold text-primary">{initialsOf(me.name)}</AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="قائمة الحساب"
          className="flex items-center gap-1.5 rounded-lg p-0.5 pe-1.5 transition-colors hover:bg-muted data-[state=open]:bg-muted"
        >
          {avatar('h-8 w-8')}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-60 rounded-lg">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-2">
            {avatar('h-9 w-9')}
            <div className="grid min-w-0 flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{me.name}</span>
              <span className="truncate text-xs text-muted-foreground" dir="ltr" style={{ textAlign: 'right' }}>
                {me.email}
              </span>
            </div>
          </div>
          <div className="px-2 pb-2 text-xs text-muted-foreground">العملة {FX[me.cur].sym}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onClick={() => navigate('/account')}>
          <UserCog className="h-4 w-4" />
          حسابي
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
