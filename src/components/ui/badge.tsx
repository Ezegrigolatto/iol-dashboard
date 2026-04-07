import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
        secondary: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]",
        destructive: "bg-[hsl(var(--destructive))/0.15] text-[hsl(var(--destructive))]",
        outline: "border border-[hsl(var(--border))] text-[hsl(var(--fg))]",
        success: "bg-[hsl(var(--success))/0.15] text-[hsl(var(--success))]",
        warning: "bg-[hsl(var(--warning))/0.15] text-[hsl(var(--warning))]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
