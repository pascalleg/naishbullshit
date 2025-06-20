"use client"

import type React from "react"

import { cn } from "@/lib/utils"

type Step = {
  id: number
  name: string
  component: React.ComponentType
}

type GigProgressBarProps = {
  currentStep: number
  steps: Step[]
}

export function GigProgressBar({ currentStep, steps }: GigProgressBarProps) {
  return (
    <div className="border-b border-white/10">
      <div className="hidden sm:block">
        <div className="grid grid-cols-5 divide-x divide-white/10">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "py-3 px-4 text-center text-sm font-medium transition-colors",
                currentStep === step.id
                  ? "bg-ethr-neonblue/10 text-ethr-neonblue"
                  : currentStep > step.id
                    ? "bg-ethr-neonblue/5 text-white/70"
                    : "text-white/50",
              )}
            >
              <span className="hidden md:inline">{step.name}</span>
              <span className="inline md:hidden">{step.id}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-white">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
          </span>
          <span className="text-sm text-white/50">{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="h-1 bg-white/10">
          <div
            className="h-1 bg-ethr-neonblue transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
