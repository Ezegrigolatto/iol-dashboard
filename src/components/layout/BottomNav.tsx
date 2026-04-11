'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart2, User, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useQueryClient } from '@tanstack/react-query';

const leftItems = [
  { href: '/operaciones', label: 'Ops', icon: BarChart2 },
  { href: '/perfil', label: 'Perfil', icon: User },
];

const ITEM_W = 72;

export function BottomNav() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isHome = pathname === '/';

  const handleLogout = () => {
    logout().then(() => {
      queryClient.clear();
    });
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <div className="flex items-end gap-0">
        <div
          className="relative flex items-center rounded-l-2xl rounded-r-none p-1.5
                     border border-r-0 border-[hsl(var(--border)/0.6)]
                     bg-[hsl(var(--card)/0.85)] backdrop-blur-xl
                     shadow-2xl shadow-black/20"
        >
          {leftItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{ width: ITEM_W }}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-[10px]',
                  'text-[10px] font-semibold tracking-wide transition-all duration-200',
                  active
                    ? 'bg-[hsl(var(--primary))] text-white shadow-[0_0_18px_hsl(var(--primary)/0.45)]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                )}
              >
                <Icon
                  className="h-[18px] w-[18px]"
                  style={{
                    transform: active ? 'scale(1.15) translateY(-1px)' : 'scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="relative flex flex-col items-center" style={{ width: 72 }}>
          <div
            className="absolute bottom-0 left-0 right-0 h-[60px]
                       border-y border-[hsl(var(--border)/0.6)]
                       bg-[hsl(var(--card)/0.85)] backdrop-blur-xl"
            style={{ boxShadow: '0 8px 32px -4px hsl(0 0% 0% / 0.20)' }}
          />

          <Link
            href="/"
            className={cn(
              'relative z-10 mb-3 flex h-14 w-14 flex-col items-center justify-center gap-0.5',
              'rounded-full border-[3px] transition-all duration-300',
              'text-[10px] font-semibold tracking-wide',
              isHome
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white shadow-[0_0_24px_hsl(var(--primary)/0.55)]'
                : 'border-[hsl(var(--border)/0.8)] bg-[hsl(var(--card)/0.95)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.6)] hover:text-[hsl(var(--primary))]'
            )}
            style={{
              transform: isHome
                ? 'translateY(-14px) scale(1.08)'
                : 'translateY(-10px) scale(1)',
              transition:
                'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
            }}
          >
            <LayoutDashboard
              className="h-5 w-5"
              style={{
                transform: isHome ? 'scale(1.1) translateY(-1px)' : 'scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
            Inicio
          </Link>
        </div>

        <div
          className="relative flex items-center rounded-r-2xl rounded-l-none p-1.5
                     border border-l-0 border-[hsl(var(--border)/0.6)]
                     bg-[hsl(var(--card)/0.85)] backdrop-blur-xl
                     shadow-2xl shadow-black/20"
        >
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ width: ITEM_W }}
            className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-[10px]
                       text-[10px] font-semibold tracking-wide
                       text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]
                       transition-colors duration-150"
          >
            <span className="relative h-[18px] w-[18px]">
              <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </span>
            Tema
          </button>

          <button
            onClick={handleLogout}
            style={{ width: ITEM_W }}
            className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-[10px]
                       text-[10px] font-semibold tracking-wide
                       text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]
                       transition-colors duration-150"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
