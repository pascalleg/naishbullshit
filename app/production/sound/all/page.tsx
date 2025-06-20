"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FilterSidebar } from "@/components/filter-sidebar"
import { Pagination } from "@/components/pagination"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"

// Mock data for sound engineers
const mockSoundEngineers = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `SAM TAYLOR ${i + 1}`,
  specialty: i % 3 === 0 ? "LIVE SOUND" : i % 3 === 1 ? "STUDIO RECORDING" : "SOUND DESIGN",
  location: i % 4 === 0 ? "LOS ANGELES" : i % 4 === 1 ? "NEW YORK" : i % 4 === 2 ? "MIAMI" : "CHICAGO",
  experience: i % 3 === 0 ? "5+ YEARS EXP" : i % 3 === 1 ? "10+ YEARS EXP" : "15+ YEARS EXP",
  rating: (4 + (i % 10) / 10).toFixed(1),
}))

export default function ViewAllSoundEngineersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(mockSoundEngineers.length / itemsPerPage)

  const currentEngineers = mockSoundEngineers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[10%] left-[15%] w-[40%] h-[30%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-[20%] right-[10%] w-[35%] h-[40%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "18s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/production"
                className="inline-flex items-center text-white/70 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="font-light">BACK TO PRODUCTION</span>
              </Link>
              <AnimatedText
                text="ALL SOUND ENGINEERS"
                tag="h1"
                animation="fade"
                className="text-3xl md:text-4xl font-light text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light">
                NEWEST FIRST
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-light">
                HIGHEST RATED
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <FilterSidebar type="sound" className="w-full lg:w-72 shrink-0" />

            {/* Main content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEngineers.map((engineer) => (
                  <ScrollReveal key={engineer.id} animation="fade" delay={(engineer.id * 50) % 300}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=gwtcj&height=400&width=400&text=Sound`}
                          alt={engineer.name}
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">{engineer.name}</h3>
                            <p className="text-sm text-white/70 font-light">SOUND ENGINEER</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= Math.floor(Number.parseFloat(engineer.rating))
                                        ? "text-ethr-neonblue fill-ethr-neonblue"
                                        : star - 0.5 <= Number.parseFloat(engineer.rating)
                                          ? "text-ethr-neonblue fill-ethr-neonblue/50"
                                          : "text-white/30"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70 font-light">{engineer.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light">
                              {engineer.location}
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light">
                              {engineer.experience}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light"
                            asChild
                          >
                            <Link href={`/production/sound/${engineer.id}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
