"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Star } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function OnboardingComplete() {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti animation when the component mounts
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since we're using up the particles over time, let's use more at the start
      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00FFFF", "#FF00FF", "#FFFFFF"],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center text-center py-8">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-ethr-neonblue/20 mb-6">
          <CheckCircle className="h-12 w-12 text-ethr-neonblue" />
        </div>
        <h1 className="text-3xl font-bold mb-2">You're all set!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your profile is now complete and you're ready to start connecting with the music industry
        </p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="text-lg font-medium mb-4">What's next?</h2>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-ethr-neonblue/20 p-2 rounded-md">
              <Star className="h-5 w-5 text-ethr-neonblue" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-medium">Explore opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Browse available gigs, venues, and collaboration opportunities
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-ethr-neonblue/20 p-2 rounded-md">
              <Star className="h-5 w-5 text-ethr-neonblue" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-medium">Complete your portfolio</h3>
              <p className="text-sm text-muted-foreground">Add more media to showcase your work and attract bookings</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-ethr-neonblue/20 p-2 rounded-md">
              <Star className="h-5 w-5 text-ethr-neonblue" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-medium">Connect your calendar</h3>
              <p className="text-sm text-muted-foreground">Sync your availability to make booking seamless</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleGoToDashboard}
        className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
        size="lg"
      >
        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
