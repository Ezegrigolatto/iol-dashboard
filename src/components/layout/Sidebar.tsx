'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, BarChart2, LogOut, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { useQueryClient } from '@tanstack/react-query';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/operaciones', label: 'Operaciones', icon: BarChart2 },
  { href: '/perfil', label: 'Mi Perfil', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { userName, logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      queryClient.clear();
    });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[hsl(var(--border))]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">IOL Dashboard</p>
          <p className="text-[10px] text-[hsl(var(--muted-fg))]">InvertirOnline</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }, i) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'animate-slide-in flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition-all duration-150',
                `stagger-${i + 1}`,
                active
                  ? 'bg-[hsl(var(--accent))] text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-fg))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--fg))]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[hsl(var(--border))] p-3 space-y-1">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{userName}</p>
            <p className="text-[10px] text-[hsl(var(--muted-fg))]">Cuenta activa</p>
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-[hsl(var(--muted-fg))] hover:bg-[hsl(var(--destructive))/0.1] hover:text-[hsl(var(--destructive))] transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
