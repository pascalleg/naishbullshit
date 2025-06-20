"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/animation-utils"
import { throttle } from "@/lib/performance-utils"

interface GestureAnimationProps {
  children: React.ReactNode
  className?: string
  swipeThreshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  disabled?: boolean
}

export function GestureAnimation({
  children,
  className,
  swipeThreshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disabled = false,
}: GestureAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | "down" | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Skip gesture animations if reduced motion is preferred or component is disabled
  if (prefersReducedMotion || disabled) {
    return <div className={className}>{children}</div>
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
    setIsSwiping(true)
    
    // Apply will-change for better performance during swipe
    if (containerRef.current) {
      containerRef.current.style.willChange = 'transform'
    }
  }

  // Throttle the touch move handler to improve performance
  const handleTouchMove = throttle((e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })

    const xDiff = touchStart.x - e.targetTouches[0].clientX
    const yDiff = touchStart.y - e.targetTouches[0].clientY

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > swipeThreshold / 2) {
        setSwipeDirection("left")
      } else if (xDiff < -swipeThreshold / 2) {
        setSwipeDirection("right")
      }
    } else {
      if (yDiff > swipeThreshold / 2) {
        setSwipeDirection("up")
      } else if (yDiff < -swipeThreshold / 2) {
        setSwipeDirection("down")
      }
    }
  }, 16) // Throttle to approximately 60fps

  const handleTouchEnd = () => {
    const xDiff = touchStart.x - touchEnd.x
    const yDiff = touchStart.y - touchEnd.y

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (Math.abs(xDiff) > swipeThreshold) {
        if (xDiff > 0 && onSwipeLeft) {
          onSwipeLeft()
        } else if (xDiff < 0 && onSwipeRight) {
          onSwipeRight()
        }
      }
    } else {
      if (Math.abs(yDiff) > swipeThreshold) {
        if (yDiff > 0 && onSwipeUp) {
          onSwipeUp()
        } else if (yDiff < 0 && onSwipeDown) {
          onSwipeDown()
        }
      }
    }

    setIsSwiping(false)
    setSwipeDirection(null)
    
    // Reset will-change after animation completes
    if (containerRef.current) {
      // Small delay to allow transition to complete
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.willChange = 'auto'
        }
      }, 300)
    }
  }

  // Calculate transform based on swipe direction
  const getTransform = () => {
    if (!isSwiping) return "translate3d(0, 0, 0)"

    const xDiff = touchEnd.x - touchStart.x
    const yDiff = touchEnd.y - touchStart.y

    // Limit the movement to create resistance effect
    // Use a smaller factor for better performance
    const limitedX = xDiff * 0.2
    const limitedY = yDiff * 0.2

    return `translate3d(${limitedX}px, ${limitedY}px, 0)`
  }

  return (
    <div
      ref={containerRef}
      className={cn("touch-manipulation", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: getTransform(),
        transition: isSwiping ? "none" : "transform 0.3s ease-out",
        // Force hardware acceleration
        backfaceVisibility: "hidden",
        perspective: 1000,
      }}
    >
      {children}
    </div>
  )
}
