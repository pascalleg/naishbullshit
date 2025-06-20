"use client"

import { useState } from "react"
import { useGigForm } from "./gig-form-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

export function GigBasicInfo() {
  const { formData, updateFormData } = useGigForm()
  const [isVenueRequired, setIsVenueRequired] = useState(!formData.isVirtual)

  const eventTypes = [
    "Concert",
    "Festival",
    "Club Night",
    "Private Party",
    "Corporate Event",
    "Wedding",
    "Conference",
    "Other",
  ]

  const handleVirtualToggle = (checked: boolean) => {
    setIsVenueRequired(!checked)
    updateFormData({ isVirtual: checked })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">
              Gig Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., 'DJ Needed for Summer Beach Party'"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className="bg-ethr-black/50 border-white/10 text-white mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your event and what you're looking for..."
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              className="bg-ethr-black/50 border-white/10 text-white h-32 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="eventType" className="text-white">
              Event Type
            </Label>
            <Select value={formData.eventType} onValueChange={(value) => updateFormData({ eventType: value })}>
              <SelectTrigger id="eventType" className="bg-ethr-black/50 border-white/10 text-white mt-2">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-ethr-darkgray border-white/10 text-white">
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Date & Time</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white">Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full mt-2 justify-start text-left font-normal border-white/10 bg-ethr-black/50 ${!formData.date && "text-white/50"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-ethr-darkgray border-white/10">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => updateFormData({ date })}
                  initialFocus
                  className="bg-ethr-darkgray text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-white">
                Start Time
              </Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => updateFormData({ startTime: e.target.value })}
                  className="pl-10 bg-ethr-black/50 border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endTime" className="text-white">
                End Time
              </Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => updateFormData({ endTime: e.target.value })}
                  className="pl-10 bg-ethr-black/50 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light text-white">Venue Information</h2>
          <div className="flex items-center space-x-2">
            <Switch checked={formData.isVirtual} onCheckedChange={handleVirtualToggle} id="virtual-event" />
            <Label htmlFor="virtual-event" className="text-white cursor-pointer">
              Virtual Event
            </Label>
          </div>
        </div>

        {!formData.isVirtual && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="venueName" className="text-white">
                Venue Name
              </Label>
              <Input
                id="venueName"
                placeholder="e.g., 'Skyline Club'"
                value={formData.venue.name}
                onChange={(e) =>
                  updateFormData({
                    venue: { ...formData.venue, name: e.target.value },
                  })
                }
                className="bg-ethr-black/50 border-white/10 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="venueAddress" className="text-white">
                Address
              </Label>
              <Input
                id="venueAddress"
                placeholder="Street address"
                value={formData.venue.address}
                onChange={(e) =>
                  updateFormData({
                    venue: { ...formData.venue, address: e.target.value },
                  })
                }
                className="bg-ethr-black/50 border-white/10 text-white mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venueCity" className="text-white">
                  City
                </Label>
                <Input
                  id="venueCity"
                  placeholder="City"
                  value={formData.venue.city}
                  onChange={(e) =>
                    updateFormData({
                      venue: { ...formData.venue, city: e.target.value },
                    })
                  }
                  className="bg-ethr-black/50 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="venueState" className="text-white">
                  State
                </Label>
                <Input
                  id="venueState"
                  placeholder="State"
                  value={formData.venue.state}
                  onChange={(e) =>
                    updateFormData({
                      venue: { ...formData.venue, state: e.target.value },
                    })
                  }
                  className="bg-ethr-black/50 border-white/10 text-white mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="venueZip" className="text-white">
                ZIP Code
              </Label>
              <Input
                id="venueZip"
                placeholder="ZIP Code"
                value={formData.venue.zipCode}
                onChange={(e) =>
                  updateFormData({
                    venue: { ...formData.venue, zipCode: e.target.value },
                  })
                }
                className="bg-ethr-black/50 border-white/10 text-white mt-2"
              />
            </div>
          </div>
        )}

        {formData.isVirtual && (
          <div className="bg-ethr-neonblue/10 border border-ethr-neonblue/20 rounded-lg p-4">
            <p className="text-white/80">
              For virtual events, you'll be able to share streaming details with booked talent closer to the event date.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
