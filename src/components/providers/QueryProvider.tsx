"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, ReactNode } from "react"

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message === "NO_AUTH") return false
              return failureCount < 2
            },
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
