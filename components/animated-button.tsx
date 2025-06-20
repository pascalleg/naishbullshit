"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
  hover?: "lift" | "glow" | "scale" | "none"
  ripple?: boolean
  onClick?: () => void
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  hover = "none",
  ripple = false,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 })

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setRippleEffect({ active: true, x, y })
      setTimeout(() => setRippleEffect({ active: false, x: 0, y: 0 }), 600)
    }

    if (onClick) {
      onClick()
    }
  }

  // Hover effects
  const getHoverClass = () => {
    switch (hover) {
      case "lift":
        return "transform transition-transform duration-300 hover:-translate-y-1"
      case "glow":
        return "transition-shadow duration-300 hover:shadow-glow"
      case "scale":
        return "transform transition-transform duration-300 hover:scale-105"
      default:
        return ""
    }
  }

  // Gradient variant
  const getVariantClass = () => {
    if (variant === "gradient") {
      return "bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white hover:from-ethr-neonblue/90 hover:to-ethr-neonpurple/90"
    }
    return ""
  }

  return (
    <motion.div whileTap={{ scale: 0.98 }} className="relative">
      <Button
        className={cn(
          getHoverClass(),
          getVariantClass(),
          "relative overflow-hidden transition-all duration-300",
          className,
        )}
        variant={variant === "gradient" ? "default" : variant}
        size={size}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {children}
        {ripple && rippleEffect.active && (
          <span
            className="absolute rounded-full bg-white/20 animate-ripple"
            style={{
              top: rippleEffect.y,
              left: rippleEffect.x,
              width: "200px",
              height: "200px",
              marginLeft: "-100px",
              marginTop: "-100px",
            }}
          />
        )}
      </Button>
    </motion.div>
  )
}
