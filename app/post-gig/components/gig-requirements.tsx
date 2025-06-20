"use client"

import type React from "react"

import { useGigForm } from "./gig-form-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function GigRequirements() {
  const { formData, updateFormData } = useGigForm()

  const artistTypes = ["DJ", "Band", "Solo Musician", "Singer", "MC/Host", "Producer", "Instrumentalist", "Other"]

  const experienceLevels = ["Any", "Beginner", "Intermediate", "Professional", "Expert/Headliner"]

  const commonEquipment = [
    "PA System",
    "Microphones",
    "DJ Equipment",
    "Lighting",
    "Stage",
    "Monitors",
    "Instruments",
    "Backline",
    "Mixer",
    "Cables",
  ]

  const handleArtistTypeToggle = (type: string) => {
    const currentTypes = [...formData.artistType]
    if (currentTypes.includes(type)) {
      updateFormData({
        artistType: currentTypes.filter((t) => t !== type),
      })
    } else {
      updateFormData({
        artistType: [...currentTypes, type],
      })
    }
  }

  const handleEquipmentProvidedToggle = (item: string) => {
    const current = [...formData.equipmentProvided]
    if (current.includes(item)) {
      updateFormData({
        equipmentProvided: current.filter((i) => i !== item),
      })
    } else {
      updateFormData({
        equipmentProvided: [...current, item],
      })
    }
  }

  const handleAddEquipmentRequired = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newItem = e.currentTarget.value.trim()
      if (!formData.equipmentRequired.includes(newItem)) {
        updateFormData({
          equipmentRequired: [...formData.equipmentRequired, newItem],
        })
        e.currentTarget.value = ""
      }
    }
  }

  const handleRemoveEquipmentRequired = (item: string) => {
    updateFormData({
      equipmentRequired: formData.equipmentRequired.filter((i) => i !== item),
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Artist Requirements</h2>

        <div className="space-y-6">
          <div>
            <Label className="text-white mb-3 block">Artist Type (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {artistTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`artist-${type}`}
                    checked={formData.artistType.includes(type)}
                    onCheckedChange={() => handleArtistTypeToggle(type)}
                  />
                  <Label htmlFor={`artist-${type}`} className="text-white cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="experienceLevel" className="text-white">
              Experience Level
            </Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) => updateFormData({ experienceLevel: value })}
            >
              <SelectTrigger id="experienceLevel" className="bg-ethr-black/50 border-white/10 text-white mt-2">
                <SelectValue placeholder="Select required experience level" />
              </SelectTrigger>
              <SelectContent className="bg-ethr-darkgray border-white/10 text-white">
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="performanceDuration" className="text-white">
                Performance Duration
              </Label>
              <Input
                id="performanceDuration"
                placeholder="e.g., '2 hours'"
                value={formData.performanceDuration}
                onChange={(e) => updateFormData({ performanceDuration: e.target.value })}
                className="bg-ethr-black/50 border-white/10 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="setupTime" className="text-white">
                Setup Time
              </Label>
              <Input
                id="setupTime"
                placeholder="e.g., '1 hour before'"
                value={formData.setupTime}
                onChange={(e) => updateFormData({ setupTime: e.target.value })}
                className="bg-ethr-black/50 border-white/10 text-white mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Equipment</h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="equipment-provided" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-ethr-neonblue">
              Equipment You Will Provide
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                {commonEquipment.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`provided-${item}`}
                      checked={formData.equipmentProvided.includes(item)}
                      onCheckedChange={() => handleEquipmentProvidedToggle(item)}
                    />
                    <Label htmlFor={`provided-${item}`} className="text-white cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <Label className="text-white mb-3 block">Equipment Artist Should Bring</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.equipmentRequired.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="bg-ethr-neonblue/10 text-white border-ethr-neonblue/20 flex items-center gap-1"
              >
                {item}
                <button onClick={() => handleRemoveEquipmentRequired(item)} className="text-white/70 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type equipment and press Enter to add"
            className="bg-ethr-black/50 border-white/10 text-white"
            onKeyDown={handleAddEquipmentRequired}
          />
          <p className="text-white/50 text-sm mt-2">Press Enter to add each item</p>
        </div>
      </div>

      <div>
        <Label htmlFor="additionalRequirements" className="text-white">
          Additional Requirements
        </Label>
        <Textarea
          id="additionalRequirements"
          placeholder="Any other specific requirements or details..."
          value={formData.additionalRequirements}
          onChange={(e) => updateFormData({ additionalRequirements: e.target.value })}
          className="bg-ethr-black/50 border-white/10 text-white h-32 mt-2"
        />
      </div>
    </div>
  )
}
