import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = "Error al cargar los datos", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--destructive)/0.1)]">
        <AlertTriangle className="h-6 w-6 text-[hsl(var(--destructive))]" />
      </div>
      <div>
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-[hsl(var(--muted-fg))] mt-1">Verificá tu conexión e intentá de nuevo</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
