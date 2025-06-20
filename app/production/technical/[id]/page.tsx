"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { ProfessionalProfileLayout } from "@/components/professional-profile-layout"
import { ProfessionalBookingForm } from "@/components/professional-booking-form"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for technical director
const mockTechnicalDirector = {
  id: "td-001",
  name: "Olivia Washington",
  title: "Technical Director & Production Designer",
  profileImage: "/placeholder.svg?height=160&width=160&query=technical director headshot",
  coverImage: "/placeholder.svg?height=320&width=1920&query=concert production design",
  rating: 4.9,
  reviewCount: 92,
  location: "Austin, TX",
  bio: "Versatile technical director with extensive experience in overseeing all technical aspects of live events and productions. I specialize in integrating sound, lighting, video, and staging elements to create cohesive, impactful experiences. My background includes work on major music festivals, arena tours, broadcast events, and immersive installations. I'm known for innovative problem-solving, technical expertise, and the ability to lead diverse production teams.",
  skills: [
    "Production Design",
    "Technical Direction",
    "System Integration",
    "Team Leadership",
    "Budget Management",
    "CAD Design",
    "Risk Assessment",
  ],
  experience: "20+ years",
  hourlyRate: 110,
  dayRate: 850,
  availability: "Limited availability - book early",
  portfolio: [
    {
      title: "Austin City Limits Festival",
      description: "Technical director for multi-stage music festival",
      image: "/placeholder.svg?height=192&width=384&query=music festival production",
    },
    {
      title: "Arena World Tour",
      description: "Production designer and technical director for global tour",
      image: "/placeholder.svg?height=192&width=384&query=arena concert production",
    },
    {
      title: "Immersive Art Installation",
      description: "Technical design for interactive multimedia experience",
      image: "/placeholder.svg?height=192&width=384&query=immersive art installation",
    },
    {
      title: "Broadcast Awards Show",
      description: "Technical director for live televised event",
      image: "/placeholder.svg?height=192&width=384&query=television awards production",
    },
  ],
  clients: ["C3 Presents", "Live Nation", "South by Southwest", "MTV", "HBO", "Red Bull"],
  equipment: [
    "Vectorworks & AutoCAD",
    "Integrated Control Systems",
    "Video Servers & Mapping",
    "Network Infrastructure Design",
    "Production Communication Systems",
    "Power Distribution Systems",
  ],
  certifications: [
    "ETCP Certified Entertainment Electrician",
    "ETCP Certified Rigger",
    "OSHA 30-Hour Safety Certification",
    "Project Management Professional (PMP)",
    "Vectorworks Certified Designer",
  ],
  education: [
    {
      institution: "University of Texas at Austin",
      degree: "BFA in Technical Production",
      year: "2003",
    },
    {
      institution: "Full Sail University",
      degree: "MS in Entertainment Business",
      year: "2007",
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

export default function TechnicalDirectorProfilePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [director, setDirector] = useState<any>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDirector(mockTechnicalDirector)
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
        <ProfessionalProfileLayout professional={director} type="technical">
          <ProfessionalBookingForm
            professionalId={director.id}
            professionalName={director.name}
            professionalType="technical"
            hourlyRate={director.hourlyRate}
            dayRate={director.dayRate}
          />
        </ProfessionalProfileLayout>
      </div>
    </main>
  )
}
