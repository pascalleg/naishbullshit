"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type GigFormData = {
  // Basic Info
  title: string
  description: string
  eventType: string
  date: Date | undefined
  startTime: string
  endTime: string
  venue: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  isVirtual: boolean

  // Requirements
  artistType: string[]
  experienceLevel: string
  equipmentProvided: string[]
  equipmentRequired: string[]
  performanceDuration: string
  setupTime: string
  additionalRequirements: string

  // Budget
  paymentType: string
  fixedAmount: number
  minBudget: number
  maxBudget: number
  depositRequired: boolean
  depositAmount: number
  paymentTerms: string

  // Media
  images: File[]
  stagePlot: File | null
  technicalRider: File | null
  audioSamples: File[]
  videoLinks: string[]
}

const defaultFormData: GigFormData = {
  // Basic Info
  title: "",
  description: "",
  eventType: "",
  date: undefined,
  startTime: "",
  endTime: "",
  venue: {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  },
  isVirtual: false,

  // Requirements
  artistType: [],
  experienceLevel: "",
  equipmentProvided: [],
  equipmentRequired: [],
  performanceDuration: "",
  setupTime: "",
  additionalRequirements: "",

  // Budget
  paymentType: "fixed",
  fixedAmount: 0,
  minBudget: 0,
  maxBudget: 0,
  depositRequired: false,
  depositAmount: 0,
  paymentTerms: "",

  // Media
  images: [],
  stagePlot: null,
  technicalRider: null,
  audioSamples: [],
  videoLinks: [],
}

type GigFormContextType = {
  formData: GigFormData
  updateFormData: (newData: Partial<GigFormData>) => void
}

const GigFormContext = createContext<GigFormContextType | undefined>(undefined)

export function GigFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<GigFormData>(defaultFormData)

  const updateFormData = (newData: Partial<GigFormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }))
  }

  return <GigFormContext.Provider value={{ formData, updateFormData }}>{children}</GigFormContext.Provider>
}

export function useGigForm() {
  const context = useContext(GigFormContext)
  if (context === undefined) {
    throw new Error("useGigForm must be used within a GigFormProvider")
  }
  return context
}
