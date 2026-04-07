'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function LoginPage() {
  const { login, authenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.replace('/');
    }
  }, [authenticated, authLoading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(var(--background))]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(217, 91%, 60%), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(142, 60%, 45%), transparent 70%)',
          }}
        />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4 animate-fade-up">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary)/0.3)]">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">IOL Dashboard</h1>
            <p className="text-sm text-[hsl(var(--muted-fg))] mt-1">
              Ingresá con tu cuenta de InvertirOnline
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xl shadow-black/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="tu@email.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))] hover:text-[hsl(var(--fg))] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-fade-up rounded-lg bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.2)] px-3 py-2.5 text-xs text-[hsl(var(--destructive))]">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-[10px] text-[hsl(var(--muted-fg))]">
            Todas las operaciones impactan en el entorno real de IOL
          </p>
          <p className="text-center text-[10px] text-[hsl(var(--muted-fg))] mt-2">
            El uso de la API de IOL está sujeto a sus términos y condiciones, que pueden
            ser actualizados en cualquier momento. Al momento del desarrollo de esta
            aplicación, la API es de uso gratuito hasta 25.000 API Calls en el mes. Ver
            mas visitando{' '}
            <a
              href="https://www.invertironline.com/tarifas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[hsl(var(--primary))] hover:underline"
            >
              https://www.invertironline.com/tarifas
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
