"use client"

import { useEffect, useState, useRef, useCallback } from "react"

// Hook to detect when an element is in viewport with performance optimizations
export function useInViewOptimized(options = {}, disabled = false) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (disabled || !ref.current) return

    // Use IntersectionObserver with a callback that's optimized for performance
    const observer = new IntersectionObserver(
      (entries) => {
        // Only update state when necessary
        const entry = entries[0]
        if (entry.isIntersecting !== isInView) {
          // Use requestAnimationFrame to batch state updates with browser paint cycle
          requestAnimationFrame(() => {
            setIsInView(entry.isIntersecting)
          })
        }
      },
      { threshold: 0.1, ...options },
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      observer.disconnect()
    }
  }, [options, disabled, isInView])

  return [ref, isInView]
}

// Hook to detect scroll position with throttling for performance
export function useScrollPositionOptimized(throttleMs = 100) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null)

  const updatePosition = useCallback(() => {
    setScrollPosition(window.scrollY)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          requestAnimationFrame(updatePosition)
          throttleTimeout.current = null
        }, throttleMs)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    updatePosition()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current)
    }
  }, [throttleMs, updatePosition])

  return scrollPosition
}

// Hook to check if user prefers reduced motion
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check on initial load
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    // Add listener for changes
    const onChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    // Use modern event listener pattern
    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return prefersReducedMotion
}

// Hook to detect device performance capabilities
export function useDevicePerformance() {
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("medium")

  useEffect(() => {
    // Simple heuristic to estimate device performance
    const estimatePerformance = () => {
      // Check for low-end devices
      if (
        // Check if device has limited memory
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        // Check if device has limited cores
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        // Check if device is in battery saving mode
        (navigator.connection && (navigator.connection as any).saveData === true)
      ) {
        return "low"
      }

      // Check for high-end devices
      if (
        // Check if device has ample memory
        (navigator.deviceMemory && navigator.deviceMemory >= 8) ||
        // Check if device has many cores
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8)
      ) {
        return "high"
      }

      // Default to medium
      return "medium"
    }

    setPerformanceLevel(estimatePerformance())
  }, [])

  return performanceLevel
}

// Utility to create optimized CSS animations
export function createOptimizedAnimation(
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: KeyframeAnimationOptions,
): Animation | null {
  if (typeof document === "undefined") return null

  const element = document.createElement("div")
  const animation = element.animate(keyframes, options)

  // Pause the animation immediately to prevent unnecessary work
  animation.pause()

  return animation
}

// Utility to throttle function calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let inThrottle = false
  let lastResult: ReturnType<T> | undefined

  return function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (!inThrottle) {
      lastResult = func.apply(this, args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }

    return lastResult
  }
}
