"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter, MapPin, DollarSign, Users, Star } from "lucide-react"
import type { VenueType } from "@/lib/database/types/venue"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const VENUE_TYPES: VenueType[] = [
  "concert_hall",
  "club",
  "bar",
  "restaurant",
  "outdoor",
  "studio",
  "theater",
  "other"
]

const AMENITIES = [
  "parking",
  "wifi",
  "sound_system",
  "lighting",
  "backstage",
  "dressing_room",
  "bar",
  "catering",
  "security",
  "wheelchair_accessible"
]

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'distance_asc', label: 'Distance: Near to Far' },
]

interface FiltersState {
  query: string;
  type?: VenueType;
  priceRange: [number, number];
  capacityRange: [number, number];
  rating: number;
  sortBy: string;
  sortOrder: string;
  amenities: string[];
}

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const getInitialFilters = (): FiltersState => {
    const priceMin = searchParams.get("price_min") ? parseFloat(searchParams.get("price_min")!) : 0;
    const priceMax = searchParams.get("price_max") ? parseFloat(searchParams.get("price_max")!) : 1000;
    const capacityMin = searchParams.get("capacity_min") ? parseInt(searchParams.get("capacity_min")!) : 0;
    const capacityMax = searchParams.get("capacity_max") ? parseInt(searchParams.get("capacity_max")!) : 1000;
    const rating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : 0;
    const selectedAmenities = searchParams.get("amenities")?.split(",") || [];

    return {
      query: searchParams.get("q") || "",
      type: (searchParams.get("type") as VenueType) || undefined,
      priceRange: [priceMin, priceMax],
      capacityRange: [capacityMin, capacityMax],
      rating: rating,
      sortBy: searchParams.get("sort_by") || "relevance",
      sortOrder: searchParams.get("sort_order") || "desc",
      amenities: selectedAmenities,
    }
  }

  const [filters, setFilters] = useState<FiltersState>(getInitialFilters())

  useEffect(() => {
    setFilters(getInitialFilters())
  }, [searchParams])

  const handleFilterChange = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (filters.query) params.set("q", filters.query)
    else params.delete("q")

    if (filters.type) params.set("type", filters.type)
    else params.delete("type")

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      params.set("price_min", filters.priceRange[0].toString())
      params.set("price_max", filters.priceRange[1].toString())
    } else {
      params.delete("price_min")
      params.delete("price_max")
    }

    if (filters.capacityRange[0] > 0 || filters.capacityRange[1] < 1000) {
      params.set("capacity_min", filters.capacityRange[0].toString())
      params.set("capacity_max", filters.capacityRange[1].toString())
    } else {
      params.delete("capacity_min")
      params.delete("capacity_max")
    }

    if (filters.rating > 0) params.set("rating", filters.rating.toString())
    else params.delete("rating")

    if (filters.sortBy !== "relevance") {
      params.set("sort_by", filters.sortBy)
      params.set("sort_order", filters.sortOrder)
    } else {
      params.delete("sort_by")
      params.delete("sort_order")
    }

    if (filters.amenities.length > 0) {
      params.set("amenities", filters.amenities.join(","))
    } else {
      params.delete("amenities")
    }

    params.set("page", "1")

    router.push(`/search?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      type: undefined,
      priceRange: [0, 1000],
      capacityRange: [0, 1000],
      rating: 0,
      sortBy: "relevance",
      sortOrder: "desc",
      amenities: []
    })
    router.push("/search")
    setIsOpen(false)
  }

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    // Explicitly cast 'key' to a known key of FiltersState for type narrowing
    switch (key as keyof FiltersState) {
      case "query":
      case "sortBy":
      case "sortOrder":
        return count + (value ? 1 : 0);
      case "type":
        // Cast value to VenueType or undefined
        return count + ((value as VenueType | undefined) ? 1 : 0);
      case "priceRange":
      case "capacityRange":
        // Cast value to a tuple of numbers
        const [min, max] = value as [number, number];
        return count + ((min > 0 || max < 1000) ? 1 : 0);
      case "rating":
        // Cast value to a number
        return count + ((value as number) > 0 ? 1 : 0);
      case "amenities":
        // Cast value to an array of strings
        return count + ((value as string[]).length > 0 ? 1 : 0);
      default:
        return count;
    }
  }, 0)

  return (
    <div className="space-y-4">
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`p-4 space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search venues..."
            value={filters.query}
            onChange={(e) => handleFilterChange("query", e.target.value)}
          />
        </div>

        {/* Venue Type */}
        <div className="space-y-2">
          <Label>Venue Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value as VenueType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {VENUE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Range
          </Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={1000}
              step={10}
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Capacity Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Capacity
          </Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={1000}
              step={10}
              value={filters.capacityRange}
              onValueChange={(value) => handleFilterChange("capacityRange", value as [number, number])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.capacityRange[0]} people</span>
              <span>{filters.capacityRange[1]} people</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Minimum Rating
          </Label>
          <div className="space-y-4">
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.rating]}
              onValueChange={(value) => handleFilterChange("rating", value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.rating} stars</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    const newAmenities = checked
                      ? [...filters.amenities, amenity]
                      : filters.amenities.filter(a => a !== amenity)
                    handleFilterChange("amenities", newAmenities)
                  }}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.sortBy !== "relevance" && (
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => handleFilterChange("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={clearFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button
            className="flex-1"
            onClick={applyFilters}
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>
    </div>
  )
} 