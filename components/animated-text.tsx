"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface AnimatedTextProps {
  text: string
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  animation?: "fade" | "slide-up" | "word-by-word" | "letter-by-letter"
  className?: string
  delay?: number
  gradient?: boolean
}

export function AnimatedText({
  text,
  tag = "h1",
  animation = "fade",
  className,
  delay = 0,
  gradient = false,
}: AnimatedTextProps) {
  const Tag = tag as keyof JSX.IntrinsicElements
  const textClass = cn(className, { "gradient-text": gradient })

  // For simple fade or slide-up animations
  if (animation === "fade" || animation === "slide-up") {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: animation === "slide-up" ? 20 : 0,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: delay / 1000,
          ease: [0.22, 1, 0.36, 1], // Custom easing for smoother animation
        }}
      >
        <Tag className={textClass}>{text}</Tag>
      </motion.div>
    )
  }

  // For word-by-word animation
  if (animation === "word-by-word") {
    const words = text.split(" ")

    return (
      <Tag className={cn("flex flex-wrap", className)}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={cn("mr-2 inline-block", { "gradient-text": gradient })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay / 1000 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    )
  }

  // For letter-by-letter animation
  if (animation === "letter-by-letter") {
    const letters = text.split("")

    return (
      <Tag className={className}>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className={cn("inline-block", { "gradient-text": gradient })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: delay / 1000 + i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </Tag>
    )
  }

  // Default fallback
  return <Tag className={textClass}>{text}</Tag>
}
