"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { AnimatedElementOptimized } from "./animated-element-optimized"

interface ProductionFiltersProps {
  type: "sound" | "lighting" | "stage" | "technical"
  onFilterChange: (filters: any) => void
}

export function ProductionFilters({ type, onFilterChange }: ProductionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    experience: [0, 20],
    availability: "any",
    remote: false,
    certifications: false,
    rating: 0,
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      experience: [0, 20],
      availability: "any",
      remote: false,
      certifications: false,
      rating: 0,
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  // Type-specific filter options
  const specializations = {
    sound: ["Live Sound", "Studio Recording", "Sound Design", "Acoustics", "Audio Systems"],
    lighting: ["Concert Lighting", "Theatrical Design", "LED Systems", "Projection Mapping", "Lighting Programming"],
    stage: ["Event Management", "Production Coordination", "Crew Management", "Safety Compliance", "Logistics"],
    technical: [
      "Technical Planning",
      "Systems Integration",
      "Production Design",
      "Technical Coordination",
      "Venue Operations",
    ],
  }

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder={`Search ${type === "sound" ? "sound engineers" : type === "lighting" ? "lighting designers" : type === "stage" ? "stage managers" : "technical directors"}...`}
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/50"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {Object.values(filters).some((v) =>
            Array.isArray(v) ? v[0] > 0 || v[1] < 20 : v !== "" && v !== "any" && v !== 0 && v !== false,
          ) && (
            <span className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {isOpen && (
        <AnimatedElementOptimized
          animation="fade-in-down"
          duration={0.3}
          className="mt-4 p-5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Filter Options</h3>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-white/70">Specialization</Label>
              <Select value={filters.availability} onValueChange={(value) => handleFilterChange("availability", value)}>
                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="any">Any Specialization</SelectItem>
                  {specializations[type].map((spec, i) => (
                    <SelectItem key={i} value={spec.toLowerCase().replace(/\s+/g, "-")}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white/70">Years of Experience</Label>
              <div className="pt-2 px-1">
                <Slider
                  defaultValue={[0, 20]}
                  max={20}
                  step={1}
                  value={filters.experience}
                  onValueChange={(value) => handleFilterChange("experience", value)}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>{filters.experience[0]} years</span>
                  <span>{filters.experience[1]} years</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white/70">Minimum Rating</Label>
              <Select
                value={filters.rating.toString()}
                onValueChange={(value) => handleFilterChange("rating", Number.parseInt(value))}
              >
                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white/70">Availability</Label>
              <Select value={filters.availability} onValueChange={(value) => handleFilterChange("availability", value)}>
                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="any">Any Availability</SelectItem>
                  <SelectItem value="available-now">Available Now</SelectItem>
                  <SelectItem value="next-week">Available Next Week</SelectItem>
                  <SelectItem value="next-month">Available Next Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="remote"
                checked={filters.remote}
                onCheckedChange={(checked) => handleFilterChange("remote", !!checked)}
                className="border-white/30 data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor="remote" className="text-white/70">
                Remote work available
              </Label>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="certifications"
                checked={filters.certifications}
                onCheckedChange={(checked) => handleFilterChange("certifications", !!checked)}
                className="border-white/30 data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor="certifications" className="text-white/70">
                Has certifications
              </Label>
            </div>
          </div>
        </AnimatedElementOptimized>
      )}
    </div>
  )
}
