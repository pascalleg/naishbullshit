"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { usePrefersReducedMotion } from "@/lib/animation-utils"

interface ParallaxBackgroundProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function ParallaxBackground({ children, strength = 40, className = "" }: ParallaxBackgroundProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [prefersReducedMotion])

  const transform = prefersReducedMotion ? "" : `translate3d(${position.x * strength}px, ${position.y * strength}px, 0)`

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform }}>
        {children}
      </div>
    </div>
  )
}
