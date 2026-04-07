'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { clientApi } from '@/lib/client-api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PortfolioTable } from '@/components/dashboard/PortfolioTable';
import { AccountCards } from '@/components/dashboard/AccountCards';
import { PortfolioDonutChart } from '@/components/charts/PortfolioDonutChart';
import { VariationBarChart } from '@/components/charts/VariationBarChart';
import { AccountBalanceChart } from '@/components/charts/AccountBalanceChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorState } from '@/components/ui/error-state';

export default function DashboardPage() {
  const [pais, setPais] = useState('argentina');

  const {
    data: cuenta,
    isLoading: loadingCuenta,
    error: errorCuenta,
    refetch: refetchCuenta,
  } = useQuery({
    queryKey: ['cuenta'],
    queryFn: () => clientApi.getEstadoCuenta(),
  });

  const {
    data: portafolio,
    isLoading: loadingPortafolio,
    error: errorPortafolio,
    refetch: refetchPortafolio,
  } = useQuery({
    queryKey: ['portafolio', pais],
    queryFn: () => clientApi.getPortafolio(pais),
  });

  const { data: dolarMep, isLoading: loadingMep } = useQuery({
    queryKey: ['dolarMep'],
    queryFn: () => clientApi.getCotizaciónMEP('AL30'),
  });

  const activos = portafolio?.activos ?? [];
  const cuentas = cuenta?.cuentas ?? [];

  const activosARS = activos.filter((a) => a.titulo.moneda === 'peso_Argentino');
  const activosUSD = activos.filter((a) => a.titulo.moneda === 'dolar_Estadounidense');

  const totalizadoARS = activosARS.reduce((s, a) => s + a.valorizado, 0);
  const totalizadoUSD = activosUSD.reduce((s, a) => s + a.valorizado, 0);

  const gananciaARS = activosARS.reduce((s, a) => s + a.gananciaDinero, 0);
  const gananciaUSD = activosUSD.reduce((s, a) => s + a.gananciaDinero, 0);

  const pctGananciaARS = activosARS.length
    ? activosARS.reduce((s, a) => s + a.gananciaPorcentaje, 0) / activosARS.length
    : 0;

  const pctGananciaUSD = activosUSD.length
    ? activosUSD.reduce((s, a) => s + a.gananciaPorcentaje, 0) / activosUSD.length
    : 0;

  const variacionPromedio = activos.length
    ? activos.reduce((s, a) => s + a.variacionDiaria, 0) / activos.length
    : 0;

  const totalEnPesos =
    totalizadoARS +
    totalizadoUSD * (dolarMep ?? 0) +
    (cuenta?.cuentas?.find((c) => c.moneda === 'peso_Argentino')?.disponible ?? 0) +
    (cuenta?.cuentas?.find((c) => c.moneda === 'dolar_Estadounidense')?.disponible ?? 0) *
      (dolarMep ?? 0);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight animate-fade-up">
            Resumen de cartera
          </h2>
          <p className="text-xs text-[hsl(var(--muted-fg))] animate-fade-up stagger-1">
            Datos en tiempo real de tu cuenta IOL
          </p>
        </div>
        <Select value={pais} onValueChange={setPais}>
          <SelectTrigger className="w-40 h-8 text-xs animate-fade-up stagger-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="argentina">Argentina</SelectItem>
            <SelectItem value="estados_Unidos">Estados Unidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {errorCuenta && !loadingCuenta ? (
        <ErrorState
          message="Error al cargar el estado de cuenta"
          onRetry={refetchCuenta}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            title="Portafolio ARS"
            value={totalizadoARS}
            currency="ARS"
            change={pctGananciaARS}
            icon={DollarSign}
            loading={loadingPortafolio}
            delay={60}
          />
          <StatCard
            title="Portafolio USD"
            value={totalizadoUSD}
            currency="USD"
            change={pctGananciaUSD}
            icon={DollarSign}
            loading={loadingPortafolio}
            delay={120}
          />
          <StatCard
            title="Portafolio total en Pesos"
            value={totalEnPesos}
            currency="ARS"
            icon={Wallet}
            loading={loadingPortafolio || loadingMep}
            delay={180}
          />
        </div>
      )}

      {!errorCuenta && !loadingCuenta && (
        <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3 animate-fade-up stagger-2">
          <StatCard
            title="Ganancia ARS"
            value={gananciaARS}
            currency="ARS"
            icon={TrendingUp}
            loading={loadingPortafolio}
            delay={0}
          />
          <StatCard
            title="Ganancia USD"
            value={gananciaUSD}
            currency="USD"
            icon={TrendingUp}
            loading={loadingPortafolio}
            delay={60}
          />
          <StatCard
            title="Variación diaria prom."
            change={variacionPromedio}
            icon={Activity}
            loading={loadingPortafolio}
            delay={180}
          />
        </div>
      )}

      <Tabs defaultValue="portafolio">
        <TabsList className="animate-fade-up stagger-3">
          <TabsTrigger value="portafolio" className="text-xs">
            Portafolio
          </TabsTrigger>
          <TabsTrigger value="cuentas" className="text-xs">
            Cuentas
          </TabsTrigger>
          <TabsTrigger value="graficos" className="text-xs">
            Gráficos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portafolio">
          {errorPortafolio ? (
            <ErrorState
              message="Error al cargar el portafolio"
              onRetry={refetchPortafolio}
            />
          ) : (
            <PortfolioTable activos={activos} loading={loadingPortafolio} />
          )}
        </TabsContent>

        <TabsContent value="cuentas">
          {errorCuenta ? (
            <ErrorState message="Error al cargar las cuentas" onRetry={refetchCuenta} />
          ) : (
            <div className="space-y-4">
              <AccountBalanceChart cuentas={cuentas} loading={loadingCuenta} />
              <AccountCards cuentas={cuentas} loading={loadingCuenta} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="graficos">
          {errorPortafolio ? (
            <ErrorState message="Error al cargar gráficos" onRetry={refetchPortafolio} />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PortfolioDonutChart activos={activosARS} loading={loadingPortafolio} />
              <PortfolioDonutChart
                activos={activosUSD}
                loading={loadingPortafolio}
                isUSD
              />
              <VariationBarChart activos={activos} loading={loadingPortafolio} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
