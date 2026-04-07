import { NextRequest, NextResponse } from "next/server"
import { saveTokens } from "@/lib/tokens"
import { TokenResponse } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 })
    }

    const body = new URLSearchParams({
      username,
      password,
      grant_type: "password",
    })

    const res = await fetch(`${process.env.IOL_TOKEN_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    const data: TokenResponse = await res.json()
    await saveTokens(data)

    return NextResponse.json({ ok: true, userName: data.userName })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
