"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { ProfessionalProfileLayout } from "@/components/professional-profile-layout"
import { ProfessionalBookingForm } from "@/components/professional-booking-form"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for sound engineer
const mockSoundEngineer = {
  id: "se-001",
  name: "Alex Rivera",
  title: "Senior Sound Engineer & Producer",
  profileImage: "/placeholder.svg?key=qy5uf",
  coverImage: "/placeholder.svg?key=7oqcr",
  rating: 4.9,
  reviewCount: 87,
  location: "Los Angeles, CA",
  bio: "With over 15 years of experience in live sound and studio recording, I've worked with Grammy-winning artists and major festivals across North America. My expertise spans from intimate club settings to arena-sized productions, with a focus on creating immersive audio experiences that elevate performances. I bring technical precision and creative problem-solving to every project.",
  skills: [
    "Live Sound Mixing",
    "Studio Recording",
    "Sound Design",
    "Acoustics",
    "Pro Tools",
    "Ableton Live",
    "Logic Pro",
  ],
  experience: "15+ years",
  hourlyRate: 85,
  dayRate: 650,
  availability: "Weekdays & Weekends",
  portfolio: [
    {
      title: "Coachella Music Festival",
      description: "Lead sound engineer for the Sahara Tent, managing audio for electronic music acts",
      image: "/placeholder.svg?key=ddk7i",
    },
    {
      title: "Red Velvet Studio Sessions",
      description: "Engineered and mixed a platinum-selling album for indie rock band",
      image: "/placeholder.svg?key=v0osl",
    },
    {
      title: "World Tour 2023",
      description: "Front of house engineer for 35-city international tour",
      image: "/concert-sound-engineering.png",
    },
    {
      title: "Immersive Audio Installation",
      description: "Designed 3D audio system for interactive art exhibition",
      image: "/placeholder.svg?height=192&width=384&query=immersive audio installation",
    },
  ],
  clients: ["Sony Music", "Live Nation", "Coachella", "SXSW", "Red Bull Music", "Universal Studios"],
  equipment: [
    "Avid S6L Digital Console",
    "DiGiCo SD7 Quantum",
    "Shure Axient Digital Wireless",
    "L-Acoustics K1/K2 Systems",
    "Waves Audio Plugins Suite",
    "Neumann Microphone Collection",
    "Universal Audio Apollo Interface",
  ],
  certifications: [
    "Avid Pro Tools Certified Operator",
    "Dante Level 3 Certification",
    "L-Acoustics System Engineer",
    "OSHA Safety Certification",
  ],
  education: [
    {
      institution: "Berklee College of Music",
      degree: "Bachelor of Music in Music Production & Engineering",
      year: "2008",
    },
    {
      institution: "Full Sail University",
      degree: "Certificate in Advanced Audio Engineering",
      year: "2010",
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

export default function SoundEngineerProfilePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [engineer, setEngineer] = useState<any>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEngineer(mockSoundEngineer)
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
        <ProfessionalProfileLayout professional={engineer} type="sound">
          <ProfessionalBookingForm
            professionalId={engineer.id}
            professionalName={engineer.name}
            professionalType="sound"
            hourlyRate={engineer.hourlyRate}
            dayRate={engineer.dayRate}
          />
        </ProfessionalProfileLayout>
      </div>
    </main>
  )
}
