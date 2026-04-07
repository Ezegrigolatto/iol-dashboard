"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cuenta } from "@/types"
import { formatCurrency } from "@/lib/utils"

interface AccountBalanceChartProps {
  cuentas: Cuenta[]
  loading?: boolean
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-lg text-xs space-y-1.5">
      <p className="font-semibold text-[hsl(var(--muted-fg))]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-medium">{formatCurrency(p.value)}</p>
      ))}
    </div>
  )
}

export function AccountBalanceChart({ cuentas, loading }: AccountBalanceChartProps) {
  if (loading) {
    return (
      <Card className="animate-fade-up stagger-2">
        <CardHeader><Skeleton className="h-4 w-40" /></CardHeader>
        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    )
  }

  const data = cuentas.map(c => ({
    cuenta: c.tipo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    saldo: c.saldo,
    disponible: c.disponible,
    valorizado: c.titulosValorizados,
  }))

  return (
    <Card className="animate-fade-up stagger-2">
      <CardHeader>
        <CardTitle className="text-sm">Balance por cuenta</CardTitle>
        <p className="text-xs text-[hsl(var(--muted-fg))]">Saldo y disponible en cada cuenta</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDisponible" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="cuenta"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-fg))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--muted-fg))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v).toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fill="url(#colorSaldo)"
            />
            <Area
              type="monotone"
              dataKey="disponible"
              stroke="hsl(142, 60%, 45%)"
              strokeWidth={2}
              fill="url(#colorDisponible)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
