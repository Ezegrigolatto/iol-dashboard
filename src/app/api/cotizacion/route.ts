import { NextRequest, NextResponse } from "next/server"
import { iolApi } from "@/lib/iol"

export async function GET(req: NextRequest) {
  try {
    const mercado = req.nextUrl.searchParams.get("mercado") ?? "bCBA"
    const simbolo = req.nextUrl.searchParams.get("simbolo")
    const desde = req.nextUrl.searchParams.get("desde")
    const hasta = req.nextUrl.searchParams.get("hasta")

    if (!simbolo) {
      return NextResponse.json({ error: "Símbolo requerido" }, { status: 400 })
    }

    if (desde && hasta) {
      const data = await iolApi.serieHistorica(mercado, simbolo, desde, hasta)
      return NextResponse.json(data)
    }

    const data = await iolApi.cotizacionDetalle(mercado, simbolo)
    return NextResponse.json(data)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NO_AUTH") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener cotización" }, { status: 500 })
  }
}
