'use client';

import { usePathname } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.9)] px-6 backdrop-blur-sm">
      <h1 className="text-base font-semibold tracking-tight">{title ? `Webapp / ${title}` : ""}</h1>
      <div className="flex items-center gap-2">
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
      </div>
      <style>{`
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(720deg); }
        }
      `}</style>
    </header>
  );
}
