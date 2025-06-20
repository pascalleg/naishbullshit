"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion, useDevicePerformance, useInViewOptimized } from "@/lib/animation-utils-optimized"

interface AnimatedIllustrationProps {
  children: React.ReactNode
  className?: string
  animationType?: "pulse" | "float" | "rotate" | "morph" | "draw"
  duration?: number
  delay?: number
  hoverEffect?: boolean
  scrollEffect?: boolean
  disableOnLowPerformance?: boolean
  priority?: boolean
}

export function AnimatedIllustrationOptimized({
  children,
  className,
  animationType = "float",
  duration = 3,
  delay = 0,
  hoverEffect = false,
  scrollEffect = false,
  disableOnLowPerformance = false,
  priority = false,
}: AnimatedIllustrationProps) {
  const illustrationRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const prefersReducedMotion = usePrefersReducedMotion()
  const devicePerformance = useDevicePerformance()
  const shouldDisableForPerformance = disableOnLowPerformance && devicePerformance === "low" && !priority

  // Disable animations based on user preferences and device capabilities
  const disableAnimations = prefersReducedMotion || shouldDisableForPerformance

  // Use optimized in-view detection
  const [inViewRef, isInView] = useInViewOptimized({ threshold: 0.1 }, disableAnimations || !scrollEffect)
  const [isVisible, setIsVisible] = useState(!scrollEffect)

  // Combine refs
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      illustrationRef.current = element

      // Only set inViewRef if scrollEffect is enabled
      if (scrollEffect && !disableAnimations) {
        // @ts-ignore - inViewRef is a function
        if (typeof inViewRef === "function") {
          inViewRef(element)
        }
      }
    },
    [inViewRef, scrollEffect, disableAnimations],
  )

  useEffect(() => {
    if (scrollEffect && isInView) {
      setIsVisible(true)
    }
  }, [scrollEffect, isInView])

  // Apply will-change only during animation to optimize performance
  useEffect(() => {
    if (!illustrationRef.current || disableAnimations) return

    if (isVisible) {
      // Apply will-change before animation starts
      switch (animationType) {
        case "pulse":
          illustrationRef.current.style.willChange = "opacity"
          break
        case "float":
          illustrationRef.current.style.willChange = "transform"
          break
        case "rotate":
          illustrationRef.current.style.willChange = "transform"
          break
        case "morph":
        case "draw":
          // These are SVG animations, so we don't need will-change
          break
      }

      // Remove will-change after animation completes to free up resources
      // For continuous animations, we'll remove after a reasonable time
      const cleanupTimer = setTimeout(() => {
        if (illustrationRef.current) {
          illustrationRef.current.style.willChange = "auto"
        }
      }, 5000) // After 5 seconds, even for infinite animations

      return () => clearTimeout(cleanupTimer)
    }
  }, [isVisible, animationType, disableAnimations])

  // Apply animation styles based on type
  const getAnimationStyle = () => {
    if (!isVisible || disableAnimations) return {}

    const baseStyle = {
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      animationFillMode: "both" as const,
      animationTimingFunction: "ease-in-out" as const,
      animationIterationCount: "infinite" as const,
    }

    switch (animationType) {
      case "pulse":
        return {
          ...baseStyle,
          animationName: "pulse",
        }
      case "float":
        return {
          ...baseStyle,
          animationName: "float",
        }
      case "rotate":
        return {
          ...baseStyle,
          animationName: "rotate",
          transformOrigin: "center",
        }
      case "morph":
        return {
          ...baseStyle,
          animationName: "morph",
        }
      case "draw":
        return {
          ...baseStyle,
          animationName: "draw",
        }
      default:
        return baseStyle
    }
  }

  // Add hover effect
  const handleMouseEnter = useCallback(() => {
    if (hoverEffect && !disableAnimations) {
      setIsHovered(true)

      // Apply will-change for hover effect
      if (illustrationRef.current) {
        illustrationRef.current.style.willChange = "transform"
      }
    }
  }, [hoverEffect, disableAnimations])

  const handleMouseLeave = useCallback(() => {
    if (hoverEffect && !disableAnimations) {
      setIsHovered(false)

      // Reset will-change after hover
      if (illustrationRef.current) {
        illustrationRef.current.style.willChange = "auto"
      }
    }
  }, [hoverEffect, disableAnimations])

  return (
    <div
      ref={setRefs}
      className={cn("transition-all duration-300", className)}
      style={{
        ...(disableAnimations ? {} : getAnimationStyle()),
        transform: isHovered && !disableAnimations ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
