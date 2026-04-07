import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { AuthGuard } from "@/components/layout/AuthGuard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden" style={{ marginLeft: "var(--sidebar-width)" }}>
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
