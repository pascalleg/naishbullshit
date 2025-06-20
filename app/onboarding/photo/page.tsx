"use client"

import type React from "react"

import { useState, useRef } from "react"
import { StepNavigation } from "../components/step-navigation"
import { Button } from "@/components/ui/button"
import { Upload, X, Camera, User } from "lucide-react"
import Image from "next/image"

export default function OnboardingPhoto() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhoto(null)
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Add a profile photo</h1>
        <p className="text-muted-foreground">A professional photo helps people recognize you and builds trust</p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6 flex flex-col items-center">
        {photo ? (
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden">
              <Image
                src={photo || "/placeholder.svg"}
                alt="Profile preview"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 bg-ethr-black rounded-full p-1 border border-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className={`
              w-40 h-40 rounded-full flex flex-col items-center justify-center
              border-2 border-dashed transition-colors
              ${isDragging ? "border-ethr-neonblue bg-ethr-neonblue/10" : "border-muted"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <User className="h-16 w-16 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">No photo selected</span>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload photo
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-muted text-muted-foreground hover:bg-ethr-black/50"
            >
              <Camera className="mr-2 h-4 w-4" />
              Take photo
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">Recommended: Square image, at least 400x400 pixels</p>
        </div>
      </div>

      <StepNavigation prevStep="profile" nextStep="details" />
    </div>
  )
}
