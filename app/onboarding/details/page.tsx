"use client"

import { useState } from "react"
import { StepNavigation } from "../components/step-navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"

// This is a simplified version - in a real app, this would be determined by the user's selection
// in the first step and stored in a context or database
const accountType = "artist"

export default function OnboardingDetails() {
  const [newTag, setNewTag] = useState("")
  const [genres, setGenres] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [performanceLength, setPerformanceLength] = useState([120]) // in minutes
  const [travelOptions, setTravelOptions] = useState({
    local: true,
    regional: false,
    national: false,
    international: false,
  })

  const handleAddGenre = () => {
    if (newTag.trim() && !genres.includes(newTag.trim())) {
      setGenres([...genres, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre))
  }

  const handleAddEquipment = () => {
    if (newTag.trim() && !equipment.includes(newTag.trim())) {
      setEquipment([...equipment, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveEquipment = (item: string) => {
    setEquipment(equipment.filter((e) => e !== item))
  }

  const handleCheckboxChange = (key: keyof typeof travelOptions) => {
    setTravelOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const formatPerformanceLength = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Artist details</h1>
        <p className="text-muted-foreground">Help venues and event organizers find you for the right opportunities</p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6 space-y-8">
        {/* Genres Section */}
        <div className="space-y-4">
          <Label>Music genres</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((genre) => (
              <Badge key={genre} className="bg-ethr-neonblue/20 text-ethr-neonblue border-none pl-3 pr-2 py-1.5">
                {genre}
                <button onClick={() => handleRemoveGenre(genre)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {genres.length === 0 && <span className="text-sm text-muted-foreground">No genres added yet</span>}
          </div>

          <div className="flex">
            <Input
              placeholder="Add a genre (e.g., House, Techno)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-ethr-black border-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddGenre()
                }
              }}
            />
            <Button onClick={handleAddGenre} className="ml-2 bg-ethr-neonblue hover:bg-ethr-neonblue/90">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="space-y-4">
          <Label>Equipment</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {equipment.map((item) => (
              <Badge key={item} className="bg-ethr-darkgray text-white border-muted pl-3 pr-2 py-1.5">
                {item}
                <button onClick={() => handleRemoveEquipment(item)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {equipment.length === 0 && <span className="text-sm text-muted-foreground">No equipment added yet</span>}
          </div>

          <div className="flex">
            <Input
              placeholder="Add equipment (e.g., Pioneer CDJ-3000)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-ethr-black border-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddEquipment()
                }
              }}
            />
            <Button onClick={handleAddEquipment} className="ml-2 bg-ethr-neonblue hover:bg-ethr-neonblue/90">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Performance Length */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Typical performance length</Label>
            <span className="text-sm font-medium">{formatPerformanceLength(performanceLength[0])}</span>
          </div>

          <Slider
            defaultValue={[120]}
            max={360}
            step={30}
            value={performanceLength}
            onValueChange={setPerformanceLength}
            className="py-4"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30m</span>
            <span>6h</span>
          </div>
        </div>

        {/* Travel Willingness */}
        <div className="space-y-4">
          <Label>Willing to travel</Label>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="local"
                checked={travelOptions.local}
                onCheckedChange={() => handleCheckboxChange("local")}
              />
              <Label htmlFor="local" className="font-normal">
                Local (within 25 miles)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="regional"
                checked={travelOptions.regional}
                onCheckedChange={() => handleCheckboxChange("regional")}
              />
              <Label htmlFor="regional" className="font-normal">
                Regional (within 100 miles)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="national"
                checked={travelOptions.national}
                onCheckedChange={() => handleCheckboxChange("national")}
              />
              <Label htmlFor="national" className="font-normal">
                National
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="international"
                checked={travelOptions.international}
                onCheckedChange={() => handleCheckboxChange("international")}
              />
              <Label htmlFor="international" className="font-normal">
                International
              </Label>
            </div>
          </div>
        </div>
      </div>

      <StepNavigation prevStep="photo" nextStep="portfolio" />
    </div>
  )
}
