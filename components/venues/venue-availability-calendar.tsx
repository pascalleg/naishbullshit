"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { VenueService } from "@/lib/database/venue-service"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MultiDayCalendar } from "@/components/multi-day-calendar"
import { TimeSlotSelector } from "@/components/time-slot-selector"
import { Calendar, Clock, Save } from "lucide-react"

interface VenueAvailabilityCalendarProps {
  venueId: string
}

export function VenueAvailabilityCalendar({
  venueId,
}: VenueAvailabilityCalendarProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<{ start: string; end: string }[]>([])

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const availability = await VenueService.getVenueAvailability(venueId)
        if (availability) {
          setSelectedDates(availability.available_dates || [])
          setTimeSlots(availability.time_slots || [])
        }
      } catch (error) {
        console.error("Error loading venue availability:", error)
        toast({
          title: "Error",
          description: "Failed to load venue availability",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadAvailability()
  }, [venueId, toast])

  const handleDateSelect = (dates: string[]) => {
    setSelectedDates(dates)
  }

  const handleTimeSlotChange = (slots: { start: string; end: string }[]) => {
    setTimeSlots(slots)
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await VenueService.updateVenueAvailability(venueId, {
        dates: selectedDates,
        timeSlots,
      })

      toast({
        title: "Success",
        description: "Venue availability updated successfully",
      })
    } catch (error) {
      console.error("Error updating venue availability:", error)
      toast({
        title: "Error",
        description: "Failed to update venue availability",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Loading availability...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Availability</h2>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="w-5 h-5" />
            <span>Available Dates</span>
          </div>
          <MultiDayCalendar
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
            minDate={new Date()}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Clock className="w-5 h-5" />
            <span>Available Time Slots</span>
          </div>
          <TimeSlotSelector
            slots={timeSlots}
            onChange={handleTimeSlotChange}
            minDuration={60} // 1 hour minimum
            maxDuration={24 * 60} // 24 hours maximum
          />
        </div>
      </div>
    </div>
  )
} 