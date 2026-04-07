"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { clientApi } from "@/lib/client-api"

interface AuthState {
  authenticated: boolean
  userName: string
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    userName: "",
    loading: true,
  })

  useEffect(() => {
    clientApi.getMe()
      .then(({ authenticated, userName }) => {
        setState({ authenticated, userName, loading: false })
      })
      .catch(() => {
        setState({ authenticated: false, userName: "", loading: false })
      })
  }, [])

  async function login(username: string, password: string) {
    const { userName } = await clientApi.login(username, password)
    setState({ authenticated: true, userName, loading: false })
    router.push("/")
  }

  async function logout() {
    await clientApi.logout()
    setState({ authenticated: false, userName: "", loading: false })
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
