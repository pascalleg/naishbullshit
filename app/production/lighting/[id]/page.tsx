"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { ProfessionalProfileLayout } from "@/components/professional-profile-layout"
import { ProfessionalBookingForm } from "@/components/professional-booking-form"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for lighting designer
const mockLightingDesigner = {
  id: "ld-001",
  name: "Sophia Chen",
  title: "Creative Lighting Designer & Programmer",
  profileImage: "/placeholder.svg?height=160&width=160&query=lighting designer headshot",
  coverImage: "/placeholder.svg?height=320&width=1920&query=concert lighting design",
  rating: 4.8,
  reviewCount: 64,
  location: "New York, NY",
  bio: "Award-winning lighting designer with a passion for creating immersive visual experiences. I specialize in concert lighting, theatrical productions, and architectural installations. My approach combines technical expertise with artistic vision to transform spaces and enhance performances. I've designed lighting for major music tours, Broadway productions, and high-profile corporate events.",
  skills: [
    "Concert Lighting",
    "Theatrical Design",
    "Lighting Programming",
    "MA3 Programming",
    "Pixel Mapping",
    "LED Technology",
    "DMX Systems",
  ],
  experience: "12+ years",
  hourlyRate: 90,
  dayRate: 700,
  availability: "Flexible Schedule",
  portfolio: [
    {
      title: "Electronic Music Tour 2023",
      description: "Designed and programmed full lighting production for 25-city tour",
      image: "/placeholder.svg?height=192&width=384&query=electronic music concert lighting",
    },
    {
      title: "Broadway Production",
      description: "Associate lighting designer for Tony-nominated musical",
      image: "/placeholder.svg?height=192&width=384&query=broadway stage lighting",
    },
    {
      title: "Corporate Product Launch",
      description: "Created custom lighting design for major tech company event",
      image: "/placeholder.svg?height=192&width=384&query=corporate event lighting",
    },
    {
      title: "Architectural Installation",
      description: "Permanent LED lighting installation for modern art museum",
      image: "/placeholder.svg?height=192&width=384&query=architectural lighting design",
    },
  ],
  clients: ["Live Nation", "Broadway Productions", "Apple", "Ultra Music Festival", "Madison Square Garden", "MoMA"],
  equipment: [
    "GrandMA3 Full Size",
    "Hog 4 Console",
    "Avolites Diamond 9",
    "Resolume Arena 7",
    "Claypaky Sharpy Fixtures",
    "Martin MAC Quantum Profile",
    "Astera Titan Tubes",
  ],
  certifications: [
    "GrandMA3 Certified Programmer",
    "ETCP Certified Entertainment Electrician",
    "Vectorworks Certified Designer",
    "OSHA 30-Hour Safety Certification",
  ],
  education: [
    {
      institution: "Carnegie Mellon University",
      degree: "BFA in Lighting Design",
      year: "2011",
    },
    {
      institution: "Yale School of Drama",
      degree: "Certificate in Technical Production",
      year: "2013",
    },
  ],
  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com",
    },
  ],
}

export default function LightingDesignerProfilePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [designer, setDesigner] = useState<any>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDesigner(mockLightingDesigner)
      setIsLoading(false)
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ethr-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-16">
        <ProfessionalProfileLayout professional={designer} type="lighting">
          <ProfessionalBookingForm
            professionalId={designer.id}
            professionalName={designer.name}
            professionalType="lighting"
            hourlyRate={designer.hourlyRate}
            dayRate={designer.dayRate}
          />
        </ProfessionalProfileLayout>
      </div>
    </main>
  )
}
