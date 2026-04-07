"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Activo } from "@/types"
import { formatCurrency, tipoToLabel } from "@/lib/utils"

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 60%, 45%)",
  "hsl(38, 80%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 72%, 55%)",
  "hsl(196, 75%, 50%)",
  "hsl(330, 70%, 55%)",
]

interface PortfolioChartProps {
  activos: Activo[]
  loading?: boolean
  isUSD?: boolean
}

interface ChartEntry {
  name: string
  value: number
  fill: string
}

function CustomTooltip({ active, payload, isUSD }: { active?: boolean; payload?: { payload: ChartEntry; value: number }[]; isUSD?: boolean }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-lg text-xs">
      <p className="font-semibold mb-1">{d.payload.name}</p>
      <p className="text-[hsl(var(--muted-fg))]">{formatCurrency(d.value, isUSD ? "USD" : "ARS")}</p>
    </div>
  )
}

export function PortfolioDonutChart({ activos, loading, isUSD }: PortfolioChartProps) {
  if (loading) {
    return (
      <Card className="animate-fade-up stagger-3">
        <CardHeader><Skeleton className="h-4 w-40" /></CardHeader>
        <CardContent className="flex items-center justify-center">
          <Skeleton className="h-56 w-56 rounded-full" />
        </CardContent>
      </Card>
    )
  }


  const grouped = activos.reduce<Record<string, number>>((acc, a) => {
    const key = tipoToLabel(a.titulo.tipo)
    acc[key] = (acc[key] ?? 0) + a.valorizado
    return acc
  }, {})

  const data: ChartEntry[] = Object.entries(grouped)
    .map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card className="animate-fade-up stagger-3">
      <CardHeader>
        <CardTitle className="text-sm">Composición del portafolio</CardTitle>
        <p className="text-xs text-[hsl(var(--muted-fg))]">
          Total valorizado: {formatCurrency(total, isUSD ? "USD" : "ARS")}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isUSD={isUSD} />} />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: "11px", color: "hsl(var(--fg))" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
