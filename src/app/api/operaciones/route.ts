import { NextRequest, NextResponse } from "next/server"
import { iolApi } from "@/lib/iol"

export async function GET(req: NextRequest) {
  try {
    const params: Record<string, string> = {}
    const estado = req.nextUrl.searchParams.get("estado")
    const fechaDesde = req.nextUrl.searchParams.get("fechaDesde")
    const fechaHasta = req.nextUrl.searchParams.get("fechaHasta")
    const pais = req.nextUrl.searchParams.get("pais")

    if (estado) params["filtro.estado"] = estado
    if (fechaDesde) params["filtro.fechaDesde"] = fechaDesde
    if (fechaHasta) params["filtro.fechaHasta"] = fechaHasta
    if (pais) params["filtro.pais"] = pais

    const data = await iolApi.operaciones(Object.keys(params).length ? params : undefined)
    return NextResponse.json(data)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NO_AUTH") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener operaciones" }, { status: 500 })
  }
}
