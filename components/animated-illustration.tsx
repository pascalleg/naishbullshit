"use client"

import type React from "react"

import { useRef, useEffect, useState, memo } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/animation-utils"
import { getAnimationSettings, isLowEndDevice } from "@/lib/performance-utils"

interface AnimatedIllustrationProps {
  children: React.ReactNode
  className?: string
  animationType?: "pulse" | "float" | "rotate" | "morph" | "draw"
  duration?: number
  delay?: number
  hoverEffect?: boolean
  scrollEffect?: boolean
  priority?: boolean
}

// Use memo to prevent unnecessary re-renders
export const AnimatedIllustration = memo(function AnimatedIllustration({
  children,
  className,
  animationType = "float",
  duration = 3,
  delay = 0,
  hoverEffect = false,
  scrollEffect = false,
  priority = false,
}: AnimatedIllustrationProps) {
  const illustrationRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!scrollEffect)
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isLowEnd = isLowEndDevice()
  
  // Skip complex animations on low-end devices unless they're priority
  const shouldAnimate = !prefersReducedMotion && (priority || !isLowEnd)
  
  // Get performance-optimized settings
  const settings = getAnimationSettings()
  
  // Adjust animation parameters based on device capabilities
  const optimizedDuration = settings.complexity === 'low' ? duration * 1.5 : duration
  
  useEffect(() => {
    if (!scrollEffect || !shouldAnimate) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "100px" } // Increased rootMargin for earlier loading
    )

    if (illustrationRef.current) {
      observer.observe(illustrationRef.current)
    }

    return () => {
      if (illustrationRef.current) {
        observer.unobserve(illustrationRef.current)
      }
    }
  }, [scrollEffect, shouldAnimate])
  
  // Apply will-change before animation starts
  useEffect(() => {
    if (!illustrationRef.current || !shouldAnimate) return
    
    if (isVisible) {
      // Apply will-change before animation
      illustrationRef.current.style.willChange = 'transform, opacity'
      
      // Remove will-change after animation stabilizes
      const timer = setTimeout(() => {
        if (illustrationRef.current && animationType !== 'morph' && animationType !== 'draw') {
          illustrationRef.current.style.willChange = 'auto'
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, animationType, shouldAnimate])

  // Apply animation styles based on type
  const getAnimationStyle = () => {
    if (!isVisible || !shouldAnimate) return {}

    const baseStyle = {
      animationDuration: `${optimizedDuration}s`,
      animationDelay: `${delay}s`,
      animationFillMode: "both" as const,
      animationTimingFunction: "ease-in-out" as const,
      animationIterationCount: "infinite" as const,
      // Force hardware acceleration
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden' as const,
      perspective: 1000,
    }

    // Simplify animations for low-end devices
    if (settings.complexity === 'low' && !priority) {
      // For low-end devices, only use simple animations
      switch (animationType) {
        case "pulse":
        case "float":
          return {
            ...baseStyle,
            animationName: "pulse",
            animationDuration: "3s",
          }
        case "rotate":
        case "morph":
        case "draw":
          // Skip these more complex animations on low-end devices
          return {}
        default:
          return baseStyle
      }
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
  const handleMouseEnter = () => {
    if (hoverEffect && shouldAnimate) {
      setIsHovered(true)
      
      // Apply will-change for hover animation
      if (illustrationRef.current) {
        illustrationRef.current.style.willChange = 'transform'
      }
    }
  }

  const handleMouseLeave = () => {
    if (hoverEffect && shouldAnimate) {
      setIsHovered(false)
      
      // Reset will-change after hover
      if (illustrationRef.current) {
        setTimeout(() => {
          if (illustrationRef.current) {
            illustrationRef.current.style.willChange = 'auto'
          }
        }, 300)
      }
    }
  }

  // If reduced motion is preferred or it's a low-end device and not priority, render without animations
  if (prefersReducedMotion || (isLowEnd && !priority)) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={illustrationRef}
      className={cn("transition-all duration-300", className)}
      style={{
        ...getAnimationStyle(),
        transform: isHovered ? "scale3d(1.05, 1.05, 1)" : "scale3d(1, 1, 1)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
})
