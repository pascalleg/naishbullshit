"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Pagination } from "@/components/pagination"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Mock data for artists
const mockArtists = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `DJ SYNAPSE ${i + 1}`,
  genre: i % 3 === 0 ? "ELECTRONIC / HOUSE" : i % 3 === 1 ? "HIP HOP / TRAP" : "TECHNO / MINIMAL",
  location: i % 4 === 0 ? "LOS ANGELES" : i % 4 === 1 ? "NEW YORK" : i % 4 === 2 ? "MIAMI" : "CHICAGO",
  priceRange: i % 3 === 0 ? "$500-1000/NIGHT" : i % 3 === 1 ? "$1000-2000/NIGHT" : "$2000+/NIGHT",
  rating: (4 + (i % 10) / 10).toFixed(1),
}))

// Filter options
const genreOptions = ["ELECTRONIC", "HIP HOP", "ROCK", "POP", "JAZZ", "CLASSICAL", "R&B", "COUNTRY", "LATIN", "INDIE"]
const locationOptions = [
  "LOS ANGELES",
  "NEW YORK",
  "MIAMI",
  "CHICAGO",
  "AUSTIN",
  "NASHVILLE",
  "SEATTLE",
  "ATLANTA",
  "LAS VEGAS",
  "SAN FRANCISCO",
]
const experienceOptions = ["1+ YEARS", "3+ YEARS", "5+ YEARS", "10+ YEARS"]

export default function ViewAllArtistsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const itemsPerPage = 12
  const totalPages = Math.ceil(mockArtists.length / itemsPerPage)

  const currentArtists = mockArtists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
                href="/artists"
                className="inline-flex items-center text-white/70 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="font-light">BACK TO ARTISTS</span>
              </Link>
              <AnimatedText
                text="ALL ARTISTS"
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

          {/* Top Filters - Desktop */}
          <div className="hidden md:block mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search artists..."
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Genre */}
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="GENRE" />
                  </SelectTrigger>
                  <SelectContent className="bg-ethr-black border-white/10 text-white">
                    {genreOptions.map((genre) => (
                      <SelectItem key={genre} value={genre.toLowerCase()}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location */}
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="LOCATION" />
                  </SelectTrigger>
                  <SelectContent className="bg-ethr-black border-white/10 text-white">
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Experience */}
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="EXPERIENCE" />
                  </SelectTrigger>
                  <SelectContent className="bg-ethr-black border-white/10 text-white">
                    {experienceOptions.map((exp) => (
                      <SelectItem key={exp} value={exp.toLowerCase()}>
                        {exp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mt-6">
                <Label className="text-white font-light mb-2 block">
                  PRICE RANGE: ${priceRange[0]} - ${priceRange[1]}+
                </Label>
                <div className="pt-4 px-2">
                  <Slider value={priceRange} max={5000} step={100} onValueChange={setPriceRange} className="mb-2" />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-ethr-neonblue hover:bg-ethr-neonblue/90 text-white font-light">
                  APPLY FILTERS
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light flex items-center justify-center">
                  <Filter className="mr-2 h-4 w-4" />
                  FILTERS
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-ethr-black border-t border-white/10 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Filters</SheetTitle>
                  <SheetDescription className="text-white/70">
                    Apply filters to find the perfect artist
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Label htmlFor="mobile-search" className="text-white font-light mb-2 block">
                      SEARCH
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="mobile-search"
                        placeholder="Search artists..."
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  {/* Genre */}
                  <div>
                    <Label className="text-white font-light mb-2 block">GENRE</Label>
                    <div className="space-y-2">
                      {genreOptions.slice(0, 6).map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-${genre.toLowerCase()}`}
                            className="border-white/30 data-[state=checked]:bg-ethr-neonblue data-[state=checked]:border-ethr-neonblue"
                          />
                          <label
                            htmlFor={`mobile-${genre.toLowerCase()}`}
                            className="text-white/70 font-light text-sm cursor-pointer"
                          >
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-white font-light mb-2 block">
                      PRICE RANGE: ${priceRange[0]} - ${priceRange[1]}+
                    </Label>
                    <div className="pt-4 px-2">
                      <Slider value={priceRange} max={5000} step={100} onValueChange={setPriceRange} className="mb-2" />
                    </div>
                  </div>

                  <SheetClose asChild>
                    <Button className="w-full bg-ethr-neonblue hover:bg-ethr-neonblue/90 text-white font-light">
                      APPLY FILTERS
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArtists.map((artist) => (
              <ScrollReveal key={artist.id} animation="fade" delay={(artist.id * 50) % 300}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={`/placeholder.svg?key=4tnr5&height=400&width=400&text=DJ`}
                      alt={artist.name}
                      width={400}
                      height={400}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                      <div>
                        <h3 className="font-light text-lg text-white">{artist.name}</h3>
                        <p className="text-sm text-white/70">{artist.genre}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(Number.parseFloat(artist.rating))
                                    ? "text-ethr-neonblue fill-ethr-neonblue"
                                    : star - 0.5 <= Number.parseFloat(artist.rating)
                                      ? "text-ethr-neonblue fill-ethr-neonblue/50"
                                      : "text-white/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm ml-1 text-white/70">{artist.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none">{artist.location}</Badge>
                        <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none">
                          {artist.priceRange}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:text-white hover:bg-white/10 font-light"
                        asChild
                      >
                        <Link href={`/artists/${artist.id}`}>VIEW PROFILE</Link>
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
      </section>
    </main>
  )
}
