import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  const hasToken = req.cookies.has("iol_access")

  if (!isPublic && !hasToken && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isPublic && hasToken) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
