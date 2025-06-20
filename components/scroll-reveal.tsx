"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { optimizeAnimationProps, shouldEnableAnimations } from "@/lib/performance-utils"

interface ScrollRevealProps {
  children: React.ReactNode
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale"
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

export function ScrollReveal({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.8,
  once = true,
  className,
}: ScrollRevealProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px 0px" })
  const animationsEnabled = shouldEnableAnimations()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "slide-up" ? 20 : animation === "slide-down" ? -20 : 0,
      x: animation === "slide-left" ? 20 : animation === "slide-right" ? -20 : 0,
      scale: animation === "scale" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: optimizeAnimationProps({
        duration,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smoother animation
      }),
    },
  }

  useEffect(() => {
    if (mounted && isInView && animationsEnabled) {
      controls.start("visible")
    } else if (mounted && !animationsEnabled) {
      // If animations are disabled, immediately show content
      controls.set("visible")
    }
  }, [isInView, controls, animationsEnabled, mounted]);

  // If animations are disabled, we still want to render the children
  if (!animationsEnabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} initial={mounted ? "hidden" : false} animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
