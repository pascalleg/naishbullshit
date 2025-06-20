"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useDevicePerformance, usePrefersReducedMotion } from "@/lib/animation-utils-optimized"

type PerformanceLevel = "high" | "medium" | "low" | "off"

interface PerformanceContextType {
  performanceLevel: PerformanceLevel
  setPerformanceLevel: (level: PerformanceLevel) => void
  prefersReducedMotion: boolean
  devicePerformance: "high" | "medium" | "low"
  isAnimationEnabled: (priority?: boolean) => boolean
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const devicePerformance = useDevicePerformance()

  // Initialize performance level based on device and user preferences
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>(() => {
    // Check if we have a stored preference
    if (typeof window !== "undefined") {
      const storedLevel = localStorage.getItem("animation-performance-level")
      if (storedLevel && ["high", "medium", "low", "off"].includes(storedLevel)) {
        return storedLevel as PerformanceLevel
      }
    }

    // Default based on device and preferences
    if (prefersReducedMotion) return "off"
    return devicePerformance
  })

  // Save performance level to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("animation-performance-level", performanceLevel)
    }
  }, [performanceLevel])

  // Function to determine if a specific animation should be enabled
  const isAnimationEnabled = (priority = false): boolean => {
    if (performanceLevel === "off") return false
    if (performanceLevel === "low" && !priority) return false
    return true
  }

  const value = {
    performanceLevel,
    setPerformanceLevel,
    prefersReducedMotion,
    devicePerformance,
    isAnimationEnabled,
  }

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>
}

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider")
  }
  return context
}
