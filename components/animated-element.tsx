"use client"

import type React from "react"

import { useInView } from "@/lib/animation-utils"
import { usePrefersReducedMotion } from "@/lib/animation-utils"
import { cn } from "@/lib/utils"
import { getAnimationSettings } from "@/lib/performance-utils"
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
}

export function AnimatedElement({
  children,
  animation,
  duration = 600,
  delay = 0,
  threshold = 0.1,
  once = true,
  className,
  priority = false,
}: AnimatedElementProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [ref, isInView] = useInView({ threshold, rootMargin: "50px" }) // Add rootMargin for earlier loading
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)
  
  // Get performance-optimized animation settings
  const settings = getAnimationSettings()
  
  // Adjust duration based on device capabilities
  const optimizedDuration = priority ? duration : settings.complexity === 'low' ? duration * 0.7 : duration
  
  useEffect(() => {
    if (isInView && once) {
      setHasAnimated(true)
    }
  }, [isInView, once])

  // Apply will-change only before animation starts
  useEffect(() => {
    if (!elementRef.current || prefersReducedMotion) return
    
    if (!hasAnimated && !isInView) {
      // Apply will-change before element comes into view
      elementRef.current.style.willChange = 'opacity, transform'
    } else if (hasAnimated || isInView) {
      // Remove will-change after animation completes
      const timer = setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.style.willChange = 'auto'
        }
      }, optimizedDuration + delay)
      
      return () => clearTimeout(timer)
    }
  }, [hasAnimated, isInView, optimizedDuration, delay, prefersReducedMotion])

  const shouldAnimate = prefersReducedMotion ? true : once ? isInView || hasAnimated : isInView

  // Use hardware-accelerated properties for animations
  const getHardwareAcceleratedStyles = () => {
    if (prefersReducedMotion) return {}
    
    const baseStyles: React.CSSProperties = {
      transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
      backfaceVisibility: 'hidden',
      perspective: 1000,
    }
    
    if (!shouldAnimate) {
      switch (animation) {
        case "fade-in":
          return { ...baseStyles, opacity: 0 }
        case "slide-up":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(0, 20px, 0)' }
        case "slide-down":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(0, -20px, 0)' }
        case "slide-left":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(20px, 0, 0)' }
        case "slide-right":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(-20px, 0, 0)' }
        case "scale-up":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(0, 0, 0) scale(0.95)' }
        case "scale-down":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(0, 0, 0) scale(1.05)' }
        case "rotate-in":
          return { ...baseStyles, opacity: 0, transform: 'translate3d(0, 0, 0) rotate(12deg)' }
        default:
          return baseStyles
      }
    }
    
    return baseStyles
  }

  const animationClasses = {
    "fade-in": "opacity-0 animate-fade-in",
    "slide-up": "opacity-0 animate-slide-up",
    "slide-down": "opacity-0 animate-slide-down",
    "slide-left": "opacity-0 animate-slide-left",
    "slide-right": "opacity-0 animate-slide-right",
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
        // @ts-ignore
        ref.current = el
        elementRef.current = el
      }}
      className={cn(
        className,
        shouldAnimate ? animationClasses[animation] : "opacity-0",
        prefersReducedMotion ? "" : "transition-all duration-[var(--duration)] delay-[var(--delay)]",
      )}
      style={{
        ...getHardwareAcceleratedStyles(),
        ...(prefersReducedMotion
          ? {}
          : ({
              "--duration": `${optimizedDuration}ms`,
              "--delay": `${delay}ms`,
              transitionTimingFunction: settings.easing,
            } as React.CSSProperties)),
      }}
    >
      {children}
    </div>
  )
}
