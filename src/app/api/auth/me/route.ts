import { NextResponse } from "next/server"
import { getTokens } from "@/lib/tokens"

export async function GET() {
  const tokens = await getTokens()
  if (!tokens) return NextResponse.json({ authenticated: false }, { status: 401 })
  return NextResponse.json({ authenticated: true, userName: tokens.userName })
}
