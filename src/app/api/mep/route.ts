import { NextRequest, NextResponse } from "next/server"
import { iolApi } from "@/lib/iol"

export async function GET(req: NextRequest) {
  try {
    const simbolo = req.nextUrl.searchParams.get("simbolo") ?? "AL30"
    const data = await iolApi.mepCotizacion(simbolo)
    return NextResponse.json(data)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NO_AUTH") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener dólar MEP" }, { status: 500 })
  }
}