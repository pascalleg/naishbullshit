"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface FilterSidebarProps {
  type: "artists" | "venues" | "sound" | "lighting" | "stage" | "technical"
  onFilterChange?: (filters: any) => void
  className?: string
}

export function FilterSidebar({ type, onFilterChange, className = "" }: FilterSidebarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])

  // Filter options based on type
  const getFilterOptions = () => {
    switch (type) {
      case "artists":
        return {
          genres: ["Electronic", "Hip Hop", "Rock", "Pop", "Jazz", "Classical", "R&B", "Country", "Latin", "Indie"],
          locations: [
            "Los Angeles",
            "New York",
            "Miami",
            "Chicago",
            "Austin",
            "Nashville",
            "Seattle",
            "Atlanta",
            "Las Vegas",
            "San Francisco",
          ],
          experience: ["1+ years", "3+ years", "5+ years", "10+ years"],
        }
      case "venues":
        return {
          types: [
            "Nightclub",
            "Concert Hall",
            "Festival Ground",
            "Bar",
            "Lounge",
            "Hotel",
            "Private Venue",
            "Restaurant",
            "Theater",
            "Outdoor",
          ],
          locations: [
            "Los Angeles",
            "New York",
            "Miami",
            "Chicago",
            "Austin",
            "Nashville",
            "Seattle",
            "Atlanta",
            "Las Vegas",
            "San Francisco",
          ],
          capacity: ["Under 100", "100-250", "250-500", "500-1000", "1000+"],
        }
      case "sound":
        return {
          specialties: [
            "Live Sound",
            "Studio Recording",
            "Sound Design",
            "Audio Engineering",
            "Broadcast Audio",
            "Post-Production",
          ],
          equipment: ["Own Equipment", "Venue Equipment", "Both"],
          experience: ["1+ years", "3+ years", "5+ years", "10+ years"],
        }
      case "lighting":
        return {
          specialties: [
            "Concert Lighting",
            "Club Lighting",
            "Theatrical Lighting",
            "Festival Lighting",
            "Corporate Events",
          ],
          equipment: ["Own Equipment", "Venue Equipment", "Both"],
          experience: ["1+ years", "3+ years", "5+ years", "10+ years"],
        }
      case "stage":
        return {
          specialties: ["Live Events", "Festivals", "Theater", "Corporate Events", "TV Production"],
          certifications: ["ETCP Certified", "OSHA Certified", "First Aid Certified"],
          experience: ["1+ years", "3+ years", "5+ years", "10+ years"],
        }
      case "technical":
        return {
          specialties: ["Audio/Visual", "Production Management", "Technical Coordination", "Systems Integration"],
          certifications: ["CTS", "ETCP", "PMP", "OSHA"],
          experience: ["1+ years", "3+ years", "5+ years", "10+ years"],
        }
      default:
        return {
          genres: [],
          locations: [],
          experience: [],
        }
    }
  }

  const filters = getFilterOptions()
  const filterKeys = Object.keys(filters)

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setMobileFiltersOpen(true)}
          className="rounded-full h-14 w-14 bg-ethr-neonblue hover:bg-ethr-neonblue/90 shadow-lg"
        >
          <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile filter overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-ethr-black border-l border-white/10 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-light text-white">FILTERS</h3>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <FilterContent
                type={type}
                filters={filters}
                filterKeys={filterKeys}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
            <div className="p-4 border-t border-white/10">
              <Button
                className="w-full bg-ethr-neonblue hover:bg-ethr-neonblue/90 font-light"
                onClick={() => setMobileFiltersOpen(false)}
              >
                APPLY FILTERS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-light text-white mb-6">FILTERS</h3>
          <FilterContent
            type={type}
            filters={filters}
            filterKeys={filterKeys}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>
      </div>
    </>
  )
}

interface FilterContentProps {
  type: string
  filters: any
  filterKeys: string[]
  priceRange: number[]
  setPriceRange: (range: number[]) => void
}

function FilterContent({ type, filters, filterKeys, priceRange, setPriceRange }: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-white font-light mb-2 block">
          SEARCH
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            id="search"
            placeholder={`Search ${type}...`}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Price Range (only for artists) */}
      {type === "artists" && (
        <div>
          <Label className="text-white font-light mb-2 block">PRICE RANGE</Label>
          <div className="pt-4 px-2">
            <Slider defaultValue={priceRange} max={2000} step={50} onValueChange={setPriceRange} className="mb-6" />
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-light">${priceRange[0]}</span>
              <span className="text-white/70 font-light">${priceRange[1]}+</span>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Range (only for venues) */}
      {type === "venues" && (
        <div>
          <Label className="text-white font-light mb-2 block">CAPACITY</Label>
          <div className="pt-4 px-2">
            <Slider defaultValue={[0, 1000]} max={2000} step={100} onValueChange={setPriceRange} className="mb-6" />
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-light">{priceRange[0]}</span>
              <span className="text-white/70 font-light">{priceRange[1]}+</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic filters based on type */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {filterKeys.map((key) => (
            <div key={key}>
              <Label className="text-white font-light mb-3 block uppercase">{key}</Label>
              <div className="space-y-2">
                {filters[key].map((option: string) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.replace(/\s+/g, "-").toLowerCase()}
                      className="border-white/30 data-[state=checked]:bg-ethr-neonblue data-[state=checked]:border-ethr-neonblue"
                    />
                    <label
                      htmlFor={option.replace(/\s+/g, "-").toLowerCase()}
                      className="text-white/70 font-light text-sm cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
