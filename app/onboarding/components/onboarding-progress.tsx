"use client"

import { usePathname } from "next/navigation"
import { Check } from "lucide-react"

const steps = [
  { id: "welcome", name: "Welcome" },
  { id: "profile", name: "Basic Info" },
  { id: "photo", name: "Profile Photo" },
  { id: "details", name: "Details" },
  { id: "portfolio", name: "Portfolio" },
  { id: "connections", name: "Connections" },
  { id: "complete", name: "Complete" },
]

export function OnboardingProgress() {
  const pathname = usePathname()
  const currentStepId = pathname.split("/").pop() || "welcome"

  // Find the index of the current step
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Your Progress</h2>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="relative">
        {/* Progress bar background */}
        <div className="h-2 bg-ethr-darkgray rounded-full w-full" />

        {/* Active progress */}
        <div
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div
                key={step.id}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs
                  ${
                    isCompleted
                      ? "bg-ethr-neonblue text-ethr-black"
                      : isCurrent
                        ? "bg-ethr-neonpurple text-white border-2 border-ethr-neonpurple"
                        : "bg-ethr-darkgray text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-6 px-1">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div
              key={step.id}
              className={`text-xs ${
                isCompleted ? "text-ethr-neonblue" : isCurrent ? "text-white font-medium" : "text-muted-foreground"
              }`}
              style={{ width: "14%", textAlign: "center" }}
            >
              {step.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
