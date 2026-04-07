"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Cuenta } from "@/types"
import { formatCurrency } from "@/lib/utils"

interface AccountCardsProps {
  cuentas: Cuenta[]
  loading?: boolean
}

function monedaLabel(moneda: string) {
  return moneda === "peso_Argentino" ? "ARS" : "USD"
}

function estadoVariant(estado: string) {
  if (estado === "operable") return "success"
  if (estado === "bloqueada") return "destructive"
  return "secondary"
}

export function AccountCards({ cuentas, loading }: AccountCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map(i => (
          <Card key={i} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <CardHeader><Skeleton className="h-4 w-40" /></CardHeader>
            <CardContent className="space-y-3">
              {[0, 1, 2].map(j => <Skeleton key={j} className="h-4 w-full" />)}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cuentas.map((c, i) => (
        <Card
          key={c.numero}
          className="animate-fade-up hover:shadow-md transition-shadow"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-wide text-[hsl(var(--muted-fg))]">
                {c.tipo.replace(/_/g, " ")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-1.5">
                  {monedaLabel(c.moneda)}
                </Badge>
                <Badge variant={estadoVariant(c.estado) as "success" | "destructive" | "secondary"} className="text-[10px] px-1.5">
                  {c.estado}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-[hsl(var(--muted-fg))]">Saldo</span>
              <span className="text-lg font-bold tabular-nums">{formatCurrency(c.saldo, c.moneda)}</span>
            </div>
            <div className="h-px bg-[hsl(var(--border))]" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[hsl(var(--muted-fg))]">Disponible</p>
                <p className="font-semibold tabular-nums">{formatCurrency(c.disponible, c.moneda)}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--muted-fg))]">Comprometido</p>
                <p className="font-semibold tabular-nums">{formatCurrency(c.comprometido, c.moneda)}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--muted-fg))]">Títulos</p>
                <p className="font-semibold tabular-nums">{formatCurrency(c.titulosValorizados, c.moneda)}</p>
              </div>
              <div>
                <p className="text-[hsl(var(--muted-fg))]">Total</p>
                <p className="font-semibold tabular-nums">{formatCurrency(c.total, c.moneda)}</p>
              </div>
            </div>
            {c.saldos?.length > 0 && (
              <>
                <div className="h-px bg-[hsl(var(--border))]" />
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--muted-fg))] font-semibold">Liquidaciones</p>
                  {c.saldos.map((s, si) => (
                    <div key={si} className="flex justify-between text-xs">
                      <span className="text-[hsl(var(--muted-fg))]">{s.liquidacion}</span>
                      <span className="font-medium tabular-nums">{formatCurrency(s.disponibleOperar, c.moneda)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
