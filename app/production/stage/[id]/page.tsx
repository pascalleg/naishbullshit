"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { ProfessionalProfileLayout } from "@/components/professional-profile-layout"
import { ProfessionalBookingForm } from "@/components/professional-booking-form"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for stage manager
const mockStageManager = {
  id: "sm-001",
  name: "Marcus Johnson",
  title: "Senior Stage Manager & Production Coordinator",
  profileImage: "/placeholder.svg?height=160&width=160&query=stage manager headshot",
  coverImage: "/placeholder.svg?height=320&width=1920&query=concert stage production",
  rating: 4.9,
  reviewCount: 76,
  location: "Chicago, IL",
  bio: "Experienced stage manager with a proven track record in coordinating complex live productions. I excel in high-pressure environments and ensure seamless execution of events from setup to strike. My background spans music festivals, theatrical productions, corporate events, and television broadcasts. I pride myself on attention to detail, clear communication, and maintaining a safe, efficient production environment.",
  skills: [
    "Production Management",
    "Crew Coordination",
    "Technical Direction",
    "Safety Protocols",
    "Scheduling",
    "Budget Management",
    "Crisis Management",
  ],
  experience: "18+ years",
  hourlyRate: 75,
  dayRate: 600,
  availability: "Available for tours and one-off events",
  portfolio: [
    {
      title: "Lollapalooza Festival",
      description: "Stage manager for main stage, coordinating 30+ acts over 4 days",
      image: "/placeholder.svg?height=192&width=384&query=music festival main stage",
    },
    {
      title: "National Television Awards",
      description: "Production stage manager for live broadcast event",
      image: "/placeholder.svg?height=192&width=384&query=television awards show",
    },
    {
      title: "World Tour 2022",
      description: "Tour stage manager for international pop artist",
      image: "/placeholder.svg?height=192&width=384&query=concert tour production",
    },
    {
      title: "Corporate Conference",
      description: "Stage manager for Fortune 500 company annual meeting",
      image: "/placeholder.svg?height=192&width=384&query=corporate conference stage",
    },
  ],
  clients: ["Live Nation", "C3 Presents", "NBC Universal", "Lollapalooza", "Broadway in Chicago", "Microsoft"],
  equipment: [
    "ClearCom Communication Systems",
    "Show Caller Software",
    "AutoCAD for Stage Plans",
    "Production Management Software",
    "Safety Equipment & Protocols",
    "Stage Automation Systems",
  ],
  certifications: [
    "ETCP Certified Rigger",
    "OSHA 30-Hour Safety Certification",
    "First Aid & CPR Certified",
    "Aerial Work Platform Certification",
    "Fire Safety Certification",
  ],
  education: [
    {
      institution: "Columbia College Chicago",
      degree: "BA in Theater Production Management",
      year: "2005",
    },
    {
      institution: "IATSE Training Trust",
      degree: "Advanced Stage Management Certification",
      year: "2008",
    },
  ],
  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com",
    },
  ],
}

export default function StageManagerProfilePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [manager, setManager] = useState<any>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setManager(mockStageManager)
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
        <ProfessionalProfileLayout professional={manager} type="stage">
          <ProfessionalBookingForm
            professionalId={manager.id}
            professionalName={manager.name}
            professionalType="stage"
            hourlyRate={manager.hourlyRate}
            dayRate={manager.dayRate}
          />
        </ProfessionalProfileLayout>
      </div>
    </main>
  )
}
