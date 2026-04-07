import { cookies } from "next/headers"
import { AuthTokens, TokenResponse } from "@/types"

const COOKIE_ACCESS = "iol_access"
const COOKIE_REFRESH = "iol_refresh"
const COOKIE_EXPIRES = "iol_expires"
const COOKIE_USER = "iol_user"

export async function saveTokens(data: TokenResponse): Promise<void> {
  const cookieStore = await cookies()
  const expiresAt = Date.now() + data.expires_in * 1000

  cookieStore.set(COOKIE_ACCESS, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  cookieStore.set(COOKIE_REFRESH, data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  cookieStore.set(COOKIE_EXPIRES, String(expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  cookieStore.set(COOKIE_USER, data.userName, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_ACCESS)
  cookieStore.delete(COOKIE_REFRESH)
  cookieStore.delete(COOKIE_EXPIRES)
  cookieStore.delete(COOKIE_USER)
}

export async function getTokens(): Promise<AuthTokens | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(COOKIE_ACCESS)?.value
  const refreshToken = cookieStore.get(COOKIE_REFRESH)?.value
  const expiresAt = cookieStore.get(COOKIE_EXPIRES)?.value
  const userName = cookieStore.get(COOKIE_USER)?.value

  if (!accessToken || !refreshToken || !expiresAt) return null

  return {
    accessToken,
    refreshToken,
    expiresAt: Number(expiresAt),
    userName: userName ?? "",
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const body = new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    })

    const res = await fetch(`${process.env.IOL_TOKEN_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getTokens()
  if (!tokens) return null

  const bufferMs = 60 * 1000
  if (Date.now() + bufferMs < tokens.expiresAt) {
    return tokens.accessToken
  }

  const refreshed = await refreshAccessToken(tokens.refreshToken)
  if (!refreshed) return null

  await saveTokens(refreshed)
  return refreshed.access_token
}
