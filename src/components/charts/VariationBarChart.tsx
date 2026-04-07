"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Activo } from "@/types"

interface VariationBarChartProps {
  activos: Activo[]
  loading?: boolean
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p className={v >= 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}>
        {v >= 0 ? "+" : ""}{v.toFixed(2)}%
      </p>
    </div>
  )
}

export function VariationBarChart({ activos, loading }: VariationBarChartProps) {
  if (loading) {
    return (
      <Card className="animate-fade-up stagger-4">
        <CardHeader><Skeleton className="h-4 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-56 w-full" /></CardContent>
      </Card>
    )
  }

  const data = activos
    .filter(a => a.gananciaPorcentaje !== 0)
    .sort((a, b) => Math.abs(b.gananciaPorcentaje) - Math.abs(a.gananciaPorcentaje))
    .slice(0, 12)
    .map(a => ({
      simbolo: a.titulo.simbolo,
      variacion: parseFloat(a.gananciaPorcentaje.toFixed(2)),
    }))

  return (
    <Card className="animate-fade-up stagger-4">
      <CardHeader>
        <CardTitle className="text-sm">Rendimiento por activo (%)</CardTitle>
        <p className="text-xs text-[hsl(var(--muted-fg))]">Ganancia/pérdida total de cada posición</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="simbolo"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-fg))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-fg))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
            <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1.5} />
            <Bar dataKey="variacion" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.variacion >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
