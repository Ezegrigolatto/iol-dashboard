"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { TrendingUp } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/login")
    }
  }, [authenticated, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary))] animate-pulse">
            <TrendingUp className="h-6 w-6 text-[hsl(var(--primary-foreground))]" />
          </div>
          <p className="text-sm text-[hsl(var(--muted-fg))]">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) return null

  return <>{children}</>
}
