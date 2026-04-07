import { NextRequest, NextResponse } from "next/server"
import { iolApi } from "@/lib/iol"

export async function GET(req: NextRequest) {
  try {
    const pais = req.nextUrl.searchParams.get("pais") ?? "argentina"
    const data = await iolApi.portafolio(pais)
    return NextResponse.json(data)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NO_AUTH") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener portafolio" }, { status: 500 })
  }
}
