"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { GigBasicInfo } from "./components/gig-basic-info"
import { GigRequirements } from "./components/gig-requirements"
import { GigBudget } from "./components/gig-budget"
import { GigMedia } from "./components/gig-media"
import { GigPreview } from "./components/gig-preview"
import { GigFormProvider } from "./components/gig-form-context"
import { GigProgressBar } from "./components/gig-progress-bar"

export default function PostGigPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const steps = [
    { id: 1, name: "Basic Info", component: GigBasicInfo },
    { id: 2, name: "Requirements", component: GigRequirements },
    { id: 3, name: "Budget", component: GigBudget },
    { id: 4, name: "Media", component: GigMedia },
    { id: 5, name: "Preview", component: GigPreview },
  ]

  const CurrentStepComponent = steps[currentStep - 1].component

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSaveDraft = () => {
    // In a real app, this would save the current state to the backend
    alert("Gig saved as draft!")
  }

  return (
    <main className="flex min-h-screen flex-col bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-light text-white mb-4">POST A GIG</h1>
              <p className="text-white/70 max-w-2xl mx-auto">
                Connect with the perfect talent for your event. Fill out the details below to post your gig.
              </p>
            </div>
          </ScrollReveal>

          <GigFormProvider>
            <div className="bg-ethr-darkgray/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden mb-8">
              <GigProgressBar currentStep={currentStep} steps={steps} />

              <div className="p-6 md:p-8">
                <CurrentStepComponent />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                    className="border-white/20 text-white hover:bg-white/5 rounded-full"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="border-white/20 text-white hover:bg-white/5 rounded-full"
              >
                <Save className="mr-2 h-4 w-4" /> Save Draft
              </Button>

              <div>
                {currentStep < totalSteps ? (
                  <Button
                    onClick={goToNextStep}
                    className="bg-ethr-neonblue hover:bg-ethr-neonblue/90 text-white rounded-full"
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="bg-ethr-neonblue hover:bg-ethr-neonblue/90 text-white rounded-full">
                    Publish Gig
                  </Button>
                )}
              </div>
            </div>
          </GigFormProvider>
        </div>
      </div>
    </main>
  )
}
