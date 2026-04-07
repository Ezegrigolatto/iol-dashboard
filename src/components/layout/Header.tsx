'use client';

import { usePathname } from 'next/navigation';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/operaciones': 'Operaciones',
  '/perfil': 'Mi Perfil',
};

export function Header() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const title = titles[pathname] ?? 'Dashboard';
  const [spinning, setSpinning] = useState(false);

  function handleRefresh() {
    if (spinning) return;
    setSpinning(true);
    queryClient.invalidateQueries();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.9)] px-4 lg:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex lg:hidden h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--primary))] shrink-0">
          <TrendingUp className="h-3.5 w-3.5 text-white" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight">
          <span className="lg:hidden">{title}</span>
          <span className="hidden lg:inline text-[hsl(var(--muted-fg))] font-normal">
            Webapp /&nbsp;
          </span>
          <span className="hidden lg:inline">{title}</span>
        </h1>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        title="Actualizar datos"
        className="cursor-pointer"
      >
        <RefreshCw
          className="h-4 w-4 transition-transform"
          style={{
            animation: spinning ? 'spin-once 0.5s ease-in-out forwards' : 'none',
          }}
          onAnimationEnd={() => setSpinning(false)}
        />
      </Button>

      <style>{`
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(720deg); }
        }
      `}</style>
    </header>
  );
}
