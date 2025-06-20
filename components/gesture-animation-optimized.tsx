"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion, useDevicePerformance, throttle } from "@/lib/animation-utils-optimized"

interface GestureAnimationProps {
  children: React.ReactNode
  className?: string
  swipeThreshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  disableOnLowPerformance?: boolean
}

export function GestureAnimationOptimized({
  children,
  className,
  swipeThreshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disableOnLowPerformance = false,
}: GestureAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | "down" | null>(null)

  const prefersReducedMotion = usePrefersReducedMotion()
  const devicePerformance = useDevicePerformance()

  // Disable gesture animations on low-performance devices if specified
  const disableGestures = prefersReducedMotion || (disableOnLowPerformance && devicePerformance === "low")

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disableGestures) return

      setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
      setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
      setIsSwiping(true)

      // Apply will-change for better performance during swipe
      if (containerRef.current) {
        containerRef.current.style.willChange = "transform"
      }
    },
    [disableGestures],
  )

  // Throttle touch move handler for better performance
  const handleTouchMove = useCallback(
    throttle((e: React.TouchEvent) => {
      if (disableGestures) return

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
    }, 16), // ~60fps
    [touchStart, swipeThreshold, disableGestures],
  )

  const handleTouchEnd = useCallback(() => {
    if (disableGestures) return

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
      containerRef.current.style.willChange = "auto"
    }
  }, [touchStart, touchEnd, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, disableGestures])

  // Calculate transform based on swipe direction
  const getTransform = useCallback(() => {
    if (!isSwiping || disableGestures) return "translate3d(0, 0, 0)"

    const xDiff = touchEnd.x - touchStart.x
    const yDiff = touchEnd.y - touchStart.y

    // Limit the movement to create resistance effect
    const limitedX = xDiff * 0.3
    const limitedY = yDiff * 0.3

    return `translate3d(${limitedX}px, ${limitedY}px, 0)`
  }, [isSwiping, touchEnd, touchStart, disableGestures])

  // Clean up any transforms on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.style.transform = "translate3d(0, 0, 0)"
        containerRef.current.style.willChange = "auto"
      }
    }
  }, [])

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
      }}
    >
      {children}
    </div>
  )
}
