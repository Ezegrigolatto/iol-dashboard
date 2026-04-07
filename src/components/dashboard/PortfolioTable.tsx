"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activo } from "@/types"
import { formatCurrency, formatNumber, formatPercent, tipoToLabel } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

type SortKey = "simbolo" | "valorizado" | "gananciaPorcentaje" | "variacionDiaria"
type SortDir = "asc" | "desc"

interface PortfolioTableProps {
  activos: Activo[]
  loading?: boolean
}

export function PortfolioTable({ activos, loading }: PortfolioTableProps) {
  const [tipo, setTipo] = useState("todos")
  const [sortKey, setSortKey] = useState<SortKey>("valorizado")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const tipos = ["todos", ...Array.from(new Set(activos.map(a => a.titulo.tipo)))]

  const filtered = activos
    .filter(a => tipo === "todos" || a.titulo.tipo === tipo)
    .slice()
    .sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1
      if (sortKey === "simbolo") return mult * a.titulo.simbolo.localeCompare(b.titulo.simbolo)
      return mult * (a[sortKey] - b[sortKey])
    })

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-40" />
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Card className="animate-fade-up stagger-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-up stagger-5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm">Posiciones abiertas</CardTitle>
          <p className="text-xs text-[hsl(var(--muted-fg))] mt-0.5">{filtered.length} activos</p>
        </div>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {tipos.map(t => (
              <SelectItem key={t} value={t} className="text-xs">
                {t === "todos" ? "Todos los tipos" : tipoToLabel(t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)]">
                {([
                  ["simbolo", "Símbolo"],
                  [null, "Tipo"],
                  [null, "Cantidad"],
                  [null, "Precio"],
                  [null, "PPC"],
                  ["variacionDiaria", "Var. Diaria"],
                  ["gananciaPorcentaje", "G/P %"],
                  ["valorizado", "Valorizado"],
                ] as [SortKey | null, string][]).map(([key, label]) => (
                  <th
                    key={label}
                    className={cn(
                      "px-4 py-2.5 text-left font-semibold text-[hsl(var(--muted-fg))] uppercase tracking-wide text-[10px]",
                      key && "cursor-pointer hover:text-[hsl(var(--fg))] select-none"
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
              {filtered.map((a, i) => {
                const isPos = a.gananciaPorcentaje >= 0
                const diariaPos = a.variacionDiaria >= 0
                return (
                  <tr
                    key={a.titulo.simbolo}
                    className="border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.3)] transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3 font-bold tracking-wide">{a.titulo.simbolo}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {tipoToLabel(a.titulo.tipo)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatNumber(a.cantidad)}</td>
                    <td className="px-4 py-3 tabular-nums">{formatCurrency(a.ultimoPrecio, a.titulo.moneda)}</td>
                    <td className="px-4 py-3 tabular-nums">{formatCurrency(a.ppc, a.titulo.moneda)}</td>
                    <td className={cn("px-4 py-3 tabular-nums font-medium", diariaPos ? "positive" : "negative")}>
                      {diariaPos ? "+" : ""}{a.variacionDiaria.toFixed(2)}%
                    </td>
                    <td className={cn("px-4 py-3 tabular-nums font-medium", isPos ? "positive" : "negative")}>
                      {isPos ? "+" : ""}{a.gananciaPorcentaje.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold">
                      {formatCurrency(a.valorizado, a.titulo.moneda)}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[hsl(var(--muted-fg))]">
                    Sin posiciones para el filtro seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
