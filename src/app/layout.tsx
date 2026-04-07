import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { AuthProvider } from "@/hooks/useAuth"
import "./globals.css"

export const metadata: Metadata = {
  title: "IOL Dashboard",
  description: "Panel de inversiones InvertirOnline",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
