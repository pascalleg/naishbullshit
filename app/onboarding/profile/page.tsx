"use client"

import type React from "react"

import { useState } from "react"
import { StepNavigation } from "../components/step-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"

export default function OnboardingProfile() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = formData.name.trim() !== "" && formData.location.trim() !== ""

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Tell us about yourself</h1>
        <p className="text-muted-foreground">This information will be displayed on your public profile</p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full name or artist name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., DJ Synapse"
            value={formData.name}
            onChange={handleChange}
            className="bg-ethr-black border-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              name="location"
              placeholder="e.g., Los Angeles, CA"
              value={formData.location}
              onChange={handleChange}
              className="bg-ethr-black border-muted pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-xs text-muted-foreground">{formData.bio.length}/250 characters</span>
          </div>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about your experience, style, and what makes you unique..."
            value={formData.bio}
            onChange={handleChange}
            maxLength={250}
            rows={5}
            className="bg-ethr-black border-muted resize-none"
          />
        </div>
      </div>

      <StepNavigation prevStep="welcome" nextStep="photo" isNextDisabled={!isFormValid} />
    </div>
  )
}
