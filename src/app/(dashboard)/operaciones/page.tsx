'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/client-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorState } from '@/components/ui/error-state';
import { cn, formatCurrency, formatDateShort, estadoToLabel } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SortKey = 'fechaOrden' | 'monto' | 'cantidad' | 'precio';
type SortDir = 'asc' | 'desc';

const ESTADOS = ['Todos', 'Pendientes', 'Terminadas', 'Canceladas'];
const PAISES = [
  { value: 'Todos', label: 'Todos los países' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'estados_Unidos', label: 'Estados Unidos' },
];

function estadoBadgeVariant(estado: string) {
  if (estado === 'ejecutada' || estado === 'terminada') return 'success';
  if (estado === 'cancelada' || estado === 'rechazada') return 'destructive';
  if (estado === 'pendiente' || estado === 'iniciada') return 'warning';
  return 'secondary';
}

export default function OperacionesPage() {
  const router = useRouter();
  const [estado, setEstado] = useState('Todos');
  const [pais, setPais] = useState('Todos');
  const [sortKey, setSortKey] = useState<SortKey>('fechaOrden');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const {
    data: operaciones,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['operaciones', estado, pais],
    queryFn: () =>
      clientApi.getOperaciones({
        estado: estado !== 'Todos' ? estado.toLowerCase() : undefined,
        pais: pais !== 'Todos' ? pais : undefined,
      }),
  });

  useEffect(() => {
    if (error && error.message === 'NO_AUTH') {
      router.push('/login');
    }
  }, [error, router]);

  const sorted = operaciones?.slice()?.sort((a, b) => {
    const mult = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'fechaOrden')
      return mult * (new Date(a.fechaOrden).getTime() - new Date(b.fechaOrden).getTime());
    return mult * (a[sortKey] - b[sortKey]);
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="animate-fade-up">
        <h2 className="text-xl font-bold tracking-tight">Operaciones</h2>
        <p className="text-xs text-[hsl(var(--muted-fg))] mt-0.5">
          Historial de órdenes ejecutadas y pendientes
        </p>
      </div>

      <Card className="animate-fade-up stagger-1">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-[hsl(var(--muted-fg))]" />
            <CardTitle className="text-sm">Filtros</CardTitle>
            <div className="flex flex-wrap gap-3 ml-auto">
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS?.map((e) => (
                    <SelectItem key={e} value={e} className="text-xs">
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pais} onValueChange={setPais}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  {PAISES?.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="text-xs">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error ? (
        <ErrorState message="Error al cargar las operaciones" onRetry={refetch} />
      ) : (
        <Card className="animate-fade-up stagger-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `${sorted?.length} operaciones`
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)]">
                    {(
                      [
                        ['fechaOrden', 'Fecha'],
                        [null, 'Símbolo'],
                        [null, 'Tipo'],
                        [null, 'Estado'],
                        [null, 'Mercado'],
                        ['cantidad', 'Cantidad'],
                        ['precio', 'Precio'],
                        ['monto', 'Monto'],
                        [null, 'Plazo'],
                      ] as [SortKey | null, string][]
                    ).map(([key, label]) => (
                      <th
                        key={label}
                        className={cn(
                          'px-4 py-3 text-left font-semibold text-[hsl(var(--muted-fg))] uppercase tracking-wide text-[10px]',
                          key && 'cursor-pointer hover:text-[hsl(var(--fg))] select-none'
                        )}
                        onClick={() => key && handleSort(key)}
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {key && <SortIcon col={key} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-[hsl(var(--border)/0.5)]">
                          {Array.from({ length: 9 }).map((_, j) => (
                            <td key={j} className="px-4 py-3">
                              <Skeleton className="h-3.5 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : sorted?.map((op, i) => (
                        <tr
                          key={op.numero}
                          className="border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.3)] transition-colors animate-fade-up"
                          style={{ animationDelay: `${i * 20}ms` }}
                        >
                          <td className="px-4 py-3 tabular-nums text-[hsl(var(--muted-fg))]">
                            {formatDateShort(op.fechaOrden)}
                          </td>
                          <td className="px-4 py-3 font-bold">{op.simbolo}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={op.tipo === 'compra' ? 'success' : 'destructive'}
                              className="text-[10px]"
                            >
                              {op.tipo}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                estadoBadgeVariant(op.estado) as
                                  | 'success'
                                  | 'destructive'
                                  | 'warning'
                                  | 'secondary'
                              }
                              className="text-[10px]"
                            >
                              {estadoToLabel(op.estado)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[hsl(var(--muted-fg))]">
                            {op.mercado}
                          </td>
                          <td className="px-4 py-3 tabular-nums">{op.cantidad || '–'}</td>
                          <td className="px-4 py-3 tabular-nums">
                            {formatCurrency(op.precio)}
                          </td>
                          <td className="px-4 py-3 tabular-nums font-semibold">
                            {formatCurrency(op.monto || op.montoOperado)}
                          </td>
                          <td className="px-4 py-3 text-[hsl(var(--muted-fg))] uppercase">
                            {op.plazo}
                          </td>
                        </tr>
                      ))}
                  {!isLoading && sorted?.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center text-[hsl(var(--muted-fg))]"
                      >
                        Sin operaciones para los filtros seleccionados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
