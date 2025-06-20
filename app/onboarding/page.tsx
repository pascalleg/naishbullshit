"use client"

import { useState } from "react"
import { StepNavigation } from "./components/step-navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Music, Building2, Headphones } from "lucide-react"

export default function OnboardingWelcome() {
  const [accountType, setAccountType] = useState<string>("artist")

  return (
    <div className="flex flex-col flex-1">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to ETHR</h1>
        <p className="text-muted-foreground">Let's set up your profile to get you connected with the music industry</p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">What best describes you?</h2>
        <p className="text-muted-foreground mb-6">
          We'll customize your experience based on your role in the music industry
        </p>

        <RadioGroup value={accountType} onValueChange={setAccountType} className="space-y-4">
          <div
            className={`
            flex items-start p-4 rounded-lg border-2 transition-all
            ${accountType === "artist" ? "border-ethr-neonblue bg-ethr-neonblue/10" : "border-transparent hover:bg-ethr-black/50"}
          `}
          >
            <RadioGroupItem value="artist" id="artist" className="mt-1" />
            <Label htmlFor="artist" className="flex-1 ml-3 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-ethr-neonblue/20 p-2 rounded-md">
                  <Music className="h-5 w-5 text-ethr-neonblue" />
                </div>
                <span className="ml-3 font-medium">Artist / Performer</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Musicians, DJs, bands, and performers looking to book gigs and connect with venues
              </p>
            </Label>
          </div>

          <div
            className={`
            flex items-start p-4 rounded-lg border-2 transition-all
            ${accountType === "venue" ? "border-ethr-neonblue bg-ethr-neonblue/10" : "border-transparent hover:bg-ethr-black/50"}
          `}
          >
            <RadioGroupItem value="venue" id="venue" className="mt-1" />
            <Label htmlFor="venue" className="flex-1 ml-3 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-ethr-neonblue/20 p-2 rounded-md">
                  <Building2 className="h-5 w-5 text-ethr-neonblue" />
                </div>
                <span className="ml-3 font-medium">Venue / Event Organizer</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Clubs, festivals, event spaces, and promoters looking to book talent
              </p>
            </Label>
          </div>

          <div
            className={`
            flex items-start p-4 rounded-lg border-2 transition-all
            ${accountType === "production" ? "border-ethr-neonblue bg-ethr-neonblue/10" : "border-transparent hover:bg-ethr-black/50"}
          `}
          >
            <RadioGroupItem value="production" id="production" className="mt-1" />
            <Label htmlFor="production" className="flex-1 ml-3 cursor-pointer">
              <div className="flex items-center">
                <div className="bg-ethr-neonblue/20 p-2 rounded-md">
                  <Headphones className="h-5 w-5 text-ethr-neonblue" />
                </div>
                <span className="ml-3 font-medium">Production Professional</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Sound engineers, lighting technicians, stage managers, and other production specialists
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <StepNavigation nextStep="profile" />
    </div>
  )
}
