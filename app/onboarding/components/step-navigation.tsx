"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepNavigationProps {
  prevStep?: string
  nextStep: string
  isLastStep?: boolean
  isNextDisabled?: boolean
  onNext?: () => Promise<boolean> | boolean
}

export function StepNavigation({
  prevStep,
  nextStep,
  isLastStep = false,
  isNextDisabled = false,
  onNext,
}: StepNavigationProps) {
  const router = useRouter()

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext()
      if (!canProceed) return
    }

    router.push(`/onboarding/${nextStep}`)
  }

  const handlePrev = () => {
    if (prevStep) {
      router.push(`/onboarding/${prevStep}`)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex justify-between mt-auto pt-8">
      <div>
        {prevStep && (
          <Button variant="ghost" onClick={handlePrev} className="text-muted-foreground hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <div className="flex space-x-4">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground hover:text-white">
          Skip for now
        </Button>

        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
        >
          {isLastStep ? "Complete" : "Continue"}
          {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
