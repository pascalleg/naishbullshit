"use client"

import type React from "react"

import { useInViewOptimized, usePrefersReducedMotion, useDevicePerformance } from "@/lib/animation-utils-optimized"
import { cn } from "@/lib/utils"
import { type ReactNode, useEffect, useState, useRef } from "react"

type AnimationType =
  | "fade-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "scale-down"
  | "rotate-in"
  | "bounce"
  | "pulse"

interface AnimatedElementProps {
  children: ReactNode
  animation: AnimationType
  duration?: number
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
  priority?: boolean // For high-priority animations that should always run
  disableOnLowPerformance?: boolean // Option to disable on low-performance devices
}

export function AnimatedElementOptimized({
  children,
  animation,
  duration = 600,
  delay = 0,
  threshold = 0.1,
  once = true,
  className,
  priority = false,
  disableOnLowPerformance = false,
}: AnimatedElementProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const devicePerformance = useDevicePerformance()
  const shouldDisableForPerformance = disableOnLowPerformance && devicePerformance === "low" && !priority

  // Disable animations based on user preferences and device capabilities
  const disableAnimations = prefersReducedMotion || shouldDisableForPerformance

  const [ref, isInView] = useInViewOptimized({ threshold }, disableAnimations)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isInView && once) {
      setHasAnimated(true)
    }
  }, [isInView, once])

  // Determine if animation should run
  const shouldAnimate = disableAnimations ? true : once ? isInView || hasAnimated : isInView

  // Use will-change only during animation to optimize performance
  useEffect(() => {
    if (!elementRef.current || disableAnimations) return

    if (shouldAnimate) {
      // Apply will-change before animation starts
      switch (animation) {
        case "fade-in":
          elementRef.current.style.willChange = "opacity"
          break
        case "slide-up":
        case "slide-down":
        case "slide-left":
        case "slide-right":
          elementRef.current.style.willChange = "opacity, transform"
          break
        case "scale-up":
        case "scale-down":
          elementRef.current.style.willChange = "opacity, transform"
          break
        case "rotate-in":
          elementRef.current.style.willChange = "opacity, transform"
          break
        default:
          elementRef.current.style.willChange = "auto"
      }

      // Remove will-change after animation completes to free up resources
      const cleanupTimer = setTimeout(
        () => {
          if (elementRef.current) {
            elementRef.current.style.willChange = "auto"
          }
        },
        duration + delay + 100,
      ) // Add a small buffer

      return () => clearTimeout(cleanupTimer)
    }
  }, [shouldAnimate, animation, duration, delay, disableAnimations])

  const animationClasses = {
    "fade-in": "opacity-0 animate-fade-in",
    "slide-up": "opacity-0 translate-y-8 animate-slide-up",
    "slide-down": "opacity-0 -translate-y-8 animate-slide-down",
    "slide-left": "opacity-0 translate-x-8 animate-slide-left",
    "slide-right": "opacity-0 -translate-x-8 animate-slide-right",
    "scale-up": "opacity-0 scale-95 animate-scale-up",
    "scale-down": "opacity-0 scale-105 animate-scale-down",
    "rotate-in": "opacity-0 rotate-12 animate-rotate-in",
    bounce: "animate-bounce",
    pulse: "animate-pulse",
  }

  return (
    <div
      // @ts-ignore - ref is properly typed but TypeScript doesn't recognize it
      ref={(el) => {
        // @ts-ignore - Combine refs
        ref.current = el
        elementRef.current = el
      }}
      className={cn(
        className,
        shouldAnimate ? animationClasses[animation] : "opacity-0",
        disableAnimations ? "" : "transition-all duration-[var(--duration)] delay-[var(--delay)]",
      )}
      style={
        disableAnimations
          ? { opacity: 1, transform: "none" }
          : ({
              "--duration": `${duration}ms`,
              "--delay": `${delay}ms`,
            } as React.CSSProperties)
      }
    >
      {children}
    </div>
  )
}
