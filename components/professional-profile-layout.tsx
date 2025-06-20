"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Download, Globe, Heart, MapPin, MessageCircle, Share2, Star, Users } from "lucide-react"
import { AnimatedElementOptimized } from "./animated-element-optimized"
import { ScrollReveal } from "./scroll-reveal"

interface ProfessionalProfileLayoutProps {
  professional: {
    id: string
    name: string
    title: string
    profileImage: string
    coverImage: string
    rating: number
    reviewCount: number
    location: string
    bio: string
    skills: string[]
    experience: string
    hourlyRate: number
    dayRate: number
    availability: string
    portfolio: {
      title: string
      description: string
      image: string
    }[]
    clients: string[]
    equipment?: string[]
    certifications?: string[]
    education?: {
      institution: string
      degree: string
      year: string
    }[]
    socialLinks?: {
      platform: string
      url: string
    }[]
  }
  type: "sound" | "lighting" | "stage" | "technical"
  children?: React.ReactNode
}

export function ProfessionalProfileLayout({ professional, type, children }: ProfessionalProfileLayoutProps) {
  const [isLiked, setIsLiked] = useState(false)

  const typeLabel =
    type === "sound"
      ? "Sound Engineer"
      : type === "lighting"
        ? "Lighting Designer"
        : type === "stage"
          ? "Stage Manager"
          : "Technical Director"

  return (
    <div className="min-h-screen bg-ethr-black text-white">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={professional.coverImage || `/placeholder.svg?height=320&width=1920&query=music studio equipment`}
          alt={`${professional.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ethr-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <AnimatedElementOptimized animation="fade-in-up" duration={0.5} delay={0.1}>
              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                <div className="relative h-40 w-40 rounded-xl overflow-hidden border-4 border-ethr-black shadow-lg">
                  <Image
                    src={
                      professional.profileImage || `/placeholder.svg?height=160&width=160&query=professional headshot`
                    }
                    alt={professional.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold">{professional.name}</h1>
                  <p className="text-xl text-white/70 mb-2">{professional.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-ethr-neonpurple mr-1" />
                      <span>{professional.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>
                        {professional.rating.toFixed(1)} ({professional.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-ethr-neonblue mr-1" />
                      <span>{professional.experience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElementOptimized>

            <div className="flex flex-wrap gap-2 mb-6">
              {professional.skills.map((skill, index) => (
                <Badge key={index} className="bg-white/10 hover:bg-white/20 text-white border-none">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {isLiked ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </div>

            <Tabs defaultValue="about" className="mb-12">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="pt-6">
                <ScrollReveal>
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Bio</h2>
                      <p className="text-white/80 leading-relaxed">{professional.bio}</p>
                    </div>

                    {professional.equipment && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Equipment</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/80">
                          {professional.equipment.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-ethr-neonblue mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {professional.certifications && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Certifications</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/80">
                          {professional.certifications.map((cert, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-ethr-neonpurple mr-2"></span>
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {professional.education && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Education</h2>
                        <div className="space-y-3 text-white/80">
                          {professional.education.map((edu, index) => (
                            <div key={index}>
                              <p className="font-medium">{edu.institution}</p>
                              <p>
                                {edu.degree} • {edu.year}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-semibold mb-3">Past Clients</h2>
                      <div className="flex flex-wrap gap-2">
                        {professional.clients.map((client, index) => (
                          <Badge key={index} variant="outline" className="bg-white/5 text-white/80 border-white/10">
                            {client}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="portfolio" className="pt-6">
                <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {professional.portfolio.map((item, index) => (
                      <Card key={index} className="bg-white/5 border-white/10 overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src={item.image || `/placeholder.svg?height=192&width=384&query=music production`}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                          <p className="text-white/70 text-sm">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
                <ScrollReveal>
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                                <Image
                                  src={`/diverse-group.png?height=40&width=40&query=person ${index + 1}`}
                                  alt="Reviewer"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">Client Name</p>
                                <p className="text-xs text-white/60">3 months ago</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= 5 - index ? "text-yellow-500 fill-yellow-500" : "text-white/30"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-white/80 text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
                            hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend
                            nibh porttitor.
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      Load More Reviews
                    </Button>
                  </div>
                </ScrollReveal>
              </TabsContent>

              <TabsContent value="booking" className="pt-6">
                <ScrollReveal>{children}</ScrollReveal>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:row-start-1">
            <div className="sticky top-24">
              <AnimatedElementOptimized animation="fade-in" duration={0.5} delay={0.3}>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Book this {typeLabel}</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-white/70">Hourly Rate</span>
                        <span className="font-semibold">${professional.hourlyRate}/hr</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-white/70">Day Rate</span>
                        <span className="font-semibold">${professional.dayRate}/day</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-white/70">Availability</span>
                        <span className="text-white/90">{professional.availability}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
                        onClick={() => {
                          const bookingTab = document.querySelector('[data-value="booking"]') as HTMLElement
                          if (bookingTab) {
                            bookingTab.click()
                            setTimeout(() => {
                              const bookingSection = document.getElementById("booking-form")
                              if (bookingSection) {
                                bookingSection.scrollIntoView({ behavior: "smooth" })
                              }
                            }, 100)
                          }
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>

                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <h3 className="text-sm font-medium mb-2">Quick Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-ethr-neonblue mr-2" />
                          <span className="text-white/80">Worked with {professional.clients.length} clients</span>
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-ethr-neonblue mr-2" />
                          <span className="text-white/80">Available for remote work</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-ethr-neonblue mr-2" />
                          <span className="text-white/80">Typically responds within 24 hours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElementOptimized>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
