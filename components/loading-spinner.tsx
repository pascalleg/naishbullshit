"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "blue" | "purple" | "gradient"
  className?: string
}

export function LoadingSpinner({ size = "md", color = "blue", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const colorClasses = {
    blue: "border-t-ethr-neonblue",
    purple: "border-t-ethr-neonpurple",
    gradient:
      "border-t-transparent before:absolute before:inset-0 before:rounded-full before:border-2 before:border-t-transparent before:border-l-ethr-neonblue before:border-r-ethr-neonpurple before:border-b-ethr-neonblue/50",
  }

  return (
    <div
      className={cn(
        "relative rounded-full border-2 border-muted animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    />
  )
}
