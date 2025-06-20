"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Star,
  MapPin,
  ArrowLeft,
  Search,
  Calendar,
  Users,
  Filter,
  MapIcon,
  Grid,
  Heart,
  Info,
  X,
  Bookmark,
  Music,
  Wifi,
  Utensils,
  Tv,
  ParkingCircle,
  Wine,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Pagination } from "@/components/pagination"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

// Mock data for venues
const mockVenues = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: `${i % 3 === 0 ? "NEON LOUNGE" : i % 3 === 1 ? "SKYLINE VENUE" : "ECHO HALL"} ${i + 1}`,
  type: i % 4 === 0 ? "NIGHTCLUB" : i % 4 === 1 ? "CONCERT HALL" : i % 4 === 2 ? "LOUNGE" : "BAR",
  location:
    i % 4 === 0 ? "DOWNTOWN, AUSTIN" : i % 4 === 1 ? "EAST AUSTIN" : i % 4 === 2 ? "SOUTH CONGRESS" : "WEST AUSTIN",
  coordinates: {
    lat: 30.2672 + (Math.random() - 0.5) * 0.1,
    lng: -97.7431 + (Math.random() - 0.5) * 0.1,
  },
  capacity: i % 3 === 0 ? 500 : i % 3 === 1 ? 1000 : 250,
  price: i % 3 === 0 ? "$$$" : i % 3 === 1 ? "$$" : "$",
  priceValue: i % 3 === 0 ? 300 : i % 3 === 1 ? 200 : 100,
  rating: (4 + (i % 10) / 10).toFixed(1),
  features: [
    i % 2 === 0 ? "Sound System" : "Stage Lighting",
    i % 3 === 0 ? "Full Bar" : "Catering Available",
    i % 4 === 0 ? "Outdoor Space" : "VIP Area",
  ],
  amenities: {
    wifi: i % 2 === 0,
    soundSystem: i % 3 === 0,
    bar: i % 2 === 0,
    catering: i % 3 === 0,
    parking: i % 2 === 0,
    projector: i % 3 === 0,
  },
  image: `/placeholder.svg?height=300&width=500&text=Venue ${i + 1}`,
}))

// Amenity icons mapping
const amenityIcons = {
  wifi: <Wifi className="h-4 w-4 mr-2" />,
  soundSystem: <Music className="h-4 w-4 mr-2" />,
  bar: <Wine className="h-4 w-4 mr-2" />,
  catering: <Utensils className="h-4 w-4 mr-2" />,
  parking: <ParkingCircle className="h-4 w-4 mr-2" />,
  projector: <Tv className="h-4 w-4 mr-2" />,
}

export default function ViewAllVenuesPage() {
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [capacityRange, setCapacityRange] = useState([0, 1000])
  const [sortOption, setSortOption] = useState("recommended")
  const [savedVenues, setSavedVenues] = useState<number[]>([])
  const [filteredVenues, setFilteredVenues] = useState(mockVenues)
  const [activeFilters, setActiveFilters] = useState({
    venueType: "all",
    amenities: {
      wifi: false,
      soundSystem: false,
      bar: false,
      catering: false,
      parking: false,
      projector: false,
    },
    priceRange: [0, 500],
    capacityRange: [0, 1000],
  })

  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage)
  const currentVenues = filteredVenues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Load saved venues from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedVenues")
    if (saved) {
      setSavedVenues(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage when savedVenues changes
  useEffect(() => {
    localStorage.setItem("savedVenues", JSON.stringify(savedVenues))
  }, [savedVenues])

  // Apply filters
  useEffect(() => {
    let results = mockVenues

    // Filter by venue type
    if (activeFilters.venueType !== "all") {
      results = results.filter((venue) => venue.type.toLowerCase() === activeFilters.venueType.toLowerCase())
    }

    // Filter by amenities
    const activeAmenities = Object.entries(activeFilters.amenities)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key)

    if (activeAmenities.length > 0) {
      results = results.filter((venue) =>
        activeAmenities.every((amenity) => venue.amenities[amenity as keyof typeof venue.amenities]),
      )
    }

    // Filter by price range
    results = results.filter(
      (venue) => venue.priceValue >= activeFilters.priceRange[0] && venue.priceValue <= activeFilters.priceRange[1],
    )

    // Filter by capacity range
    results = results.filter(
      (venue) => venue.capacity >= activeFilters.capacityRange[0] && venue.capacity <= activeFilters.capacityRange[1],
    )

    // Apply sorting
    if (sortOption === "price-low") {
      results = [...results].sort((a, b) => a.priceValue - b.priceValue)
    } else if (sortOption === "price-high") {
      results = [...results].sort((a, b) => b.priceValue - a.priceValue)
    } else if (sortOption === "rating") {
      results = [...results].sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
    } else if (sortOption === "capacity") {
      results = [...results].sort((a, b) => b.capacity - a.capacity)
    }

    setFilteredVenues(results)
    setCurrentPage(1) // Reset to first page when filters change
  }, [activeFilters, sortOption])

  const toggleSaveVenue = (id: number) => {
    if (savedVenues.includes(id)) {
      setSavedVenues(savedVenues.filter((venueId) => venueId !== id))
      toast({
        title: "Venue removed from saved list",
        description: "The venue has been removed from your saved venues.",
      })
    } else {
      setSavedVenues([...savedVenues, id])
      toast({
        title: "Venue saved!",
        description: "The venue has been added to your saved venues.",
      })
    }
  }

  const updateFilter = (filterType: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const updateAmenityFilter = (amenity: string, value: boolean) => {
    setActiveFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: value,
      },
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      venueType: "all",
      amenities: {
        wifi: false,
        soundSystem: false,
        bar: false,
        catering: false,
        parking: false,
        projector: false,
      },
      priceRange: [0, 500],
      capacityRange: [0, 1000],
    })
    setSortOption("recommended")
  }

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Main Content */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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
          {/* Breadcrumb and Title */}
          <div className="mb-6">
            <Link
              href="/venues"
              className="inline-flex items-center text-white/70 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-light">BACK TO VENUES</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <AnimatedText
                text="VENUES IN AUSTIN, TX"
                tag="h1"
                animation="fade"
                className="text-3xl md:text-4xl font-light text-white"
              />
              <p className="text-white/60 font-light">{filteredVenues.length} venues available</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-white/70 text-xs mb-1 block">
                  LOCATION
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="location"
                    defaultValue="Austin, TX"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="text-white/70 text-xs mb-1 block">
                  DATE
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input id="date" type="date" className="pl-10 bg-white/5 border-white/10 text-white" />
                </div>
              </div>

              {/* Guests */}
              <div>
                <Label htmlFor="guests" className="text-white/70 text-xs mb-1 block">
                  GUESTS
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Select defaultValue="any">
                    <SelectTrigger className="pl-10 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Number of guests" />
                    </SelectTrigger>
                    <SelectContent className="bg-ethr-darkgray border-white/10">
                      <SelectItem value="any">Any number</SelectItem>
                      <SelectItem value="1-50">1-50 guests</SelectItem>
                      <SelectItem value="50-100">50-100 guests</SelectItem>
                      <SelectItem value="100-250">100-250 guests</SelectItem>
                      <SelectItem value="250-500">250-500 guests</SelectItem>
                      <SelectItem value="500+">500+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  SEARCH VENUES
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Advanced Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[350px] sm:w-[450px] bg-ethr-darkgray border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-white">Advanced Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                    <div className="space-y-6">
                      {/* Venue Type */}
                      <div>
                        <h3 className="text-white font-light mb-3">Venue Type</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {["All", "Nightclub", "Concert Hall", "Lounge", "Bar"].map((type) => (
                            <Button
                              key={type}
                              variant="outline"
                              size="sm"
                              className={`border-white/10 ${
                                activeFilters.venueType === type.toLowerCase()
                                  ? "bg-ethr-neonblue/20 text-ethr-neonblue"
                                  : "text-white hover:bg-white/5"
                              }`}
                              onClick={() => updateFilter("venueType", type.toLowerCase())}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="text-white font-light mb-3">Price Range</h3>
                        <div className="pt-4 px-2">
                          <Slider
                            value={activeFilters.priceRange}
                            max={1000}
                            step={50}
                            onValueChange={(value) => updateFilter("priceRange", value)}
                            className="mb-6"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 font-light">${activeFilters.priceRange[0]}</span>
                            <span className="text-white/70 font-light">${activeFilters.priceRange[1]}+</span>
                          </div>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div>
                        <h3 className="text-white font-light mb-3">Capacity</h3>
                        <div className="pt-4 px-2">
                          <Slider
                            value={activeFilters.capacityRange}
                            max={2000}
                            step={100}
                            onValueChange={(value) => updateFilter("capacityRange", value)}
                            className="mb-6"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-white/70 font-light">{activeFilters.capacityRange[0]}</span>
                            <span className="text-white/70 font-light">{activeFilters.capacityRange[1]}+</span>
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="text-white font-light mb-3">Amenities</h3>
                        <div className="space-y-3">
                          {Object.entries(amenityIcons).map(([key, icon]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={key}
                                checked={activeFilters.amenities[key as keyof typeof activeFilters.amenities]}
                                onCheckedChange={(checked) => updateAmenityFilter(key, checked === true)}
                                className="border-white/30 data-[state=checked]:bg-ethr-neonblue data-[state=checked]:border-ethr-neonblue"
                              />
                              <Label
                                htmlFor={key}
                                className="text-white/70 font-light text-sm cursor-pointer flex items-center"
                              >
                                {icon}
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="w-full border-white/10 text-white hover:bg-white/5"
                          onClick={clearAllFilters}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Saved Venues */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved Venues ({savedVenues.length})
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[350px] sm:w-[450px] bg-ethr-darkgray border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-white">Saved Venues</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
                    {savedVenues.length === 0 ? (
                      <div className="text-center py-10">
                        <Bookmark className="h-12 w-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-white font-light mb-2">No saved venues yet</h3>
                        <p className="text-white/60 max-w-md mx-auto">
                          Click the heart icon on any venue card to save it to your list.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mockVenues
                          .filter((venue) => savedVenues.includes(venue.id))
                          .map((venue) => (
                            <div
                              key={venue.id}
                              className="flex gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={venue.image || "/placeholder.svg"}
                                  alt={venue.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium">{venue.name}</h4>
                                <p className="text-white/60 text-sm">{venue.location}</p>
                                <div className="flex items-center mt-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-3 w-3 ${
                                          star <= Math.floor(Number.parseFloat(venue.rating))
                                            ? "text-ethr-neonblue fill-ethr-neonblue"
                                            : "text-white/30"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs ml-1 text-white/70">{venue.rating}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
                                    onClick={() => toggleSaveVenue(venue.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Remove
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-8 px-2 bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white"
                                    asChild
                                  >
                                    <Link href={`/venues/${venue.id}`}>View</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Venue Type */}
              <Select value={activeFilters.venueType} onValueChange={(value) => updateFilter("venueType", value)}>
                <SelectTrigger className="w-auto bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Venue Type" />
                </SelectTrigger>
                <SelectContent className="bg-ethr-darkgray border-white/10">
                  <SelectItem value="all">All Venue Types</SelectItem>
                  <SelectItem value="nightclub">Nightclub</SelectItem>
                  <SelectItem value="concert hall">Concert Hall</SelectItem>
                  <SelectItem value="lounge">Lounge</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-auto bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-ethr-darkgray border-white/10">
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="capacity">Capacity</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="ml-auto">
                <div className="bg-white/5 rounded-md flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-md rounded-r-none ${viewMode === "grid" ? "bg-white/10 text-ethr-neonblue" : "text-white/70"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-md rounded-l-none ${viewMode === "map" ? "bg-white/10 text-ethr-neonblue" : "text-white/70"}`}
                    onClick={() => setViewMode("map")}
                  >
                    <MapIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1">
              {viewMode === "grid" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentVenues.map((venue) => (
                      <ScrollReveal key={venue.id} animation="fade" delay={(venue.id * 50) % 300}>
                        <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300 h-full flex flex-col">
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={venue.image || "/placeholder.svg"}
                              alt={venue.name}
                              width={500}
                              height={300}
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/30 hover:bg-black/50 text-white h-8 w-8"
                                onClick={() => toggleSaveVenue(venue.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${savedVenues.includes(venue.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </Button>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                              <div>
                                <h3 className="font-light text-lg text-white">{venue.name}</h3>
                                <div className="flex items-center mt-1">
                                  <MapPin className="h-4 w-4 mr-1 text-white/70" />
                                  <p className="text-sm text-white/70 font-light">{venue.location}</p>
                                </div>
                                <div className="flex items-center mt-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= Math.floor(Number.parseFloat(venue.rating))
                                            ? "text-ethr-neonblue fill-ethr-neonblue"
                                            : star - 0.5 <= Number.parseFloat(venue.rating)
                                              ? "text-ethr-neonblue fill-ethr-neonblue/50"
                                              : "text-white/30"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm ml-1 text-white/70 font-light">{venue.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex space-x-2">
                                <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light">
                                  {venue.type}
                                </Badge>
                                <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light">
                                  {venue.capacity} CAPACITY
                                </Badge>
                              </div>
                              <div className="text-white font-medium">
                                {venue.price}
                                <span className="text-xs text-white/50 ml-1">per hour</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {venue.features.map((feature, idx) => (
                                <span key={idx} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>

                            <div className="mt-auto pt-3 border-t border-white/10 flex justify-between items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10 font-light"
                                asChild
                              >
                                <Link href={`/venues/${venue.id}#details`}>
                                  <Info className="h-4 w-4 mr-1" />
                                  Details
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90 text-white"
                                asChild
                              >
                                <Link href={`/venues/${venue.id}`}>VIEW VENUE</Link>
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
                </>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
                  <div className="relative h-[600px]">
                    {/* Map Component */}
                    <div className="absolute inset-0">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.76983794854!2d-97.80973097729392!3d30.307982720077684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd469d57a!2sAustin%2C%20TX%2C%20USA!5e0!3m2!1sen!2sca!4v1715915847!5m2!1sen!2sca"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>

                    {/* Map Venue Cards */}
                    <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-32px)] overflow-y-auto">
                      <div className="space-y-2 p-1">
                        {currentVenues.slice(0, 5).map((venue) => (
                          <Card
                            key={venue.id}
                            className="bg-ethr-darkgray/90 backdrop-blur-sm border-white/10 overflow-hidden"
                          >
                            <div className="flex p-2 gap-3">
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={venue.image || "/placeholder.svg"}
                                  alt={venue.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white text-sm font-medium">{venue.name}</h4>
                                <p className="text-white/60 text-xs">{venue.location}</p>
                                <div className="flex items-center mt-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-3 w-3 ${
                                          star <= Math.floor(Number.parseFloat(venue.rating))
                                            ? "text-ethr-neonblue fill-ethr-neonblue"
                                            : "text-white/30"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs ml-1 text-white/70">{venue.rating}</span>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                                    onClick={() => toggleSaveVenue(venue.id)}
                                  >
                                    <Heart
                                      className={`h-3 w-3 mr-1 ${
                                        savedVenues.includes(venue.id) ? "fill-red-500 text-red-500" : ""
                                      }`}
                                    />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-6 px-2 bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple text-white text-xs"
                                    asChild
                                  >
                                    <Link href={`/venues/${venue.id}`}>View</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
