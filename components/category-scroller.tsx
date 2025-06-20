"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const categories = [
  { name: "EVENTS", href: "/events" },
  { name: "PARTY", href: "/party" },
  { name: "MUSIC", href: "/music" },
  { name: "AFTERS", href: "/afters" },
  { name: "COMMUNITY", href: "/community" },
  { name: "CULINARY", href: "/culinary" },
  { name: "HEALTH & WELLNESS", href: "/health-wellness" },
  { name: "FITNESS", href: "/fitness" },
  { name: "POP-UPS", href: "/pop-ups" },
  { name: "ART & FASHION", href: "/art-fashion" },
]

export function CategoryScroller() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrolling = true
    let animationFrameId: number
    let lastTime = 0
    const speed = 0.5 // pixels per millisecond - very slow

    const scroll = (timestamp: number) => {
      if (!scrollContainer || !scrolling) return

      if (lastTime === 0) {
        lastTime = timestamp
        animationFrameId = requestAnimationFrame(scroll)
        return
      }

      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      scrollContainer.scrollLeft += speed * deltaTime

      // Reset scroll position when reaching the end
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    // Start scrolling
    animationFrameId = requestAnimationFrame(scroll)

    // Pause on hover
    const handleMouseEnter = () => {
      scrolling = false
      lastTime = 0
      cancelAnimationFrame(animationFrameId)
    }

    const handleMouseLeave = () => {
      scrolling = true
      lastTime = 0
      animationFrameId = requestAnimationFrame(scroll)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="w-full bg-black/50 backdrop-blur-md border-y border-white/10 py-4 overflow-hidden">
      <div ref={scrollRef} className="flex space-x-8 px-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
        {categories.map((category) => {
          const isActive = pathname === category.href

          return (
            <Link
              key={category.name}
              href={category.href}
              className={cn(
                "text-sm font-light tracking-wide transition-colors duration-300 hover:text-ethr-neonblue py-1",
                isActive ? "text-ethr-neonblue" : "text-white/70",
              )}
            >
              {category.name}
            </Link>
          )
        })}

        {/* Duplicate categories for seamless looping */}
        {categories.map((category) => {
          const isActive = pathname === category.href

          return (
            <Link
              key={`${category.name}-duplicate`}
              href={category.href}
              className={cn(
                "text-sm font-light tracking-wide transition-colors duration-300 hover:text-ethr-neonblue py-1",
                isActive ? "text-ethr-neonblue" : "text-white/70",
              )}
            >
              {category.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
