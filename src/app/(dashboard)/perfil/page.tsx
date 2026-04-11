'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/client-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import {
  User,
  Mail,
  Hash,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | undefined | null;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[hsl(var(--border)/0.5)] last:border-0">
      <div className="flex items-center gap-2.5 text-xs text-[hsl(var(--muted-fg))]">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      <span className="text-xs font-medium">{value ?? '—'}</span>
    </div>
  );
}

function StatusBool({ value, label }: { value: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[hsl(var(--border)/0.5)] last:border-0">
      <span className="text-xs text-[hsl(var(--muted-fg))]">{label}</span>
      {value ? (
        <div className="flex items-center gap-1 text-xs text-[hsl(var(--destructive))]">
          <AlertCircle className="h-3.5 w-3.5" />
          Requiere acción
        </div>
      ) : (
        <div className="flex items-center gap-1 text-xs text-[hsl(var(--success))]">
          <CheckCircle className="h-3.5 w-3.5" />
          Al día
        </div>
      )}
    </div>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['perfil'],
    queryFn: () => clientApi.getPerfil(),
  });

  useEffect(() => {
    if (error && error.message === 'NO_AUTH') {
      router.push('/login');
    }
  }, [error, router]);

  if (error) return <ErrorState message="Error al cargar el perfil" onRetry={refetch} />;

  return (
    <div className="space-y-5 pb-8 max-w-2xl">
      <div className="animate-fade-up">
        <h2 className="text-xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-xs text-[hsl(var(--muted-fg))] mt-0.5">
          Información de tu cuenta InvertirOnline
        </p>
      </div>

      <Card className="animate-fade-up stagger-1">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--accent))] text-[hsl(var(--primary))]">
                  <span className="text-2xl font-bold">
                    {data?.nombre?.[0]?.toUpperCase()}
                    {data?.apellido?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {data?.nombre} {data?.apellido}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={data?.cuentaAbierta ? 'success' : 'destructive'}
                      className="text-[10px]"
                    >
                      {data?.cuentaAbierta ? (
                        <>
                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                          Cuenta activa
                        </>
                      ) : (
                        <>
                          <XCircle className="h-2.5 w-2.5 mr-1" />
                          Cuenta inactiva
                        </>
                      )}
                    </Badge>
                    {data?.perfilInversor && (
                      <Badge variant="secondary" className="text-[10px]">
                        Perfil: {data.perfilInversor}
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <>
              <InfoRow label="Correo electrónico" value={data?.email} icon={Mail} />
              <InfoRow label="Número de cuenta" value={data?.numeroCuenta} icon={Hash} />
              <InfoRow label="DNI" value={data?.dni} icon={CreditCard} />
              <InfoRow label="CUIT / CUIL" value={data?.cuitCuil} icon={Shield} />
              <InfoRow label="Sexo" value={data?.sexo} icon={User} />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="animate-fade-up stagger-2">
        <CardHeader>
          <CardTitle className="text-sm">Estado de documentación</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <>
              <StatusBool
                value={data?.actualizarDDJJ ?? false}
                label="DDJJ patrimonial"
              />
              <StatusBool
                value={data?.actualizarTestInversor ?? false}
                label="Test de inversor"
              />
              <StatusBool
                value={data?.actualizarTyC ?? false}
                label="Términos y condiciones"
              />
              <StatusBool value={data?.actualizarTyCApp ?? false} label="Términos app" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
