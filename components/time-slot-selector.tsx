"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
  price: number
}

interface TimeSlotSelectorProps {
  date: Date | undefined
  onTimeSlotSelect: (startTime: string, endTime: string, price: number) => void
}

export function TimeSlotSelector({ date, onTimeSlotSelect }: TimeSlotSelectorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!date) return

      setLoading(true)
      try {
        // In a real app, this would be an API call
        // For now, we'll generate mock data
        const mockTimeSlots: TimeSlot[] = [
          { id: "slot-1", startTime: "09:00", endTime: "12:00", available: true, price: 350 },
          { id: "slot-2", startTime: "12:00", endTime: "15:00", available: true, price: 450 },
          { id: "slot-3", startTime: "15:00", endTime: "18:00", available: true, price: 550 },
          { id: "slot-4", startTime: "18:00", endTime: "21:00", available: true, price: 650 },
          { id: "slot-5", startTime: "21:00", endTime: "00:00", available: false, price: 750 },
          { id: "slot-6", startTime: "10:00", endTime: "14:00", available: true, price: 500 },
          { id: "slot-7", startTime: "14:00", endTime: "18:00", available: true, price: 600 },
          { id: "slot-8", startTime: "18:00", endTime: "22:00", available: false, price: 700 },
        ]

        setTimeSlots(mockTimeSlots)
      } catch (error) {
        console.error("Error fetching time slots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeSlots()
  }, [date])

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    onTimeSlotSelect(slot.startTime, slot.endTime, slot.price)
  }

  if (!date) {
    return null
  }

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-light text-white flex items-center">
        <Clock className="h-4 w-4 mr-2 text-ethr-neonblue" />
        Available Time Slots
        <span className="text-sm ml-2 text-white/60">{date ? format(date, "MMM d, yyyy") : ""}</span>
      </h3>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ethr-neonblue"></div>
        </div>
      ) : timeSlots.length === 0 ? (
        <p className="text-white/70 text-center py-4">No time slots available for this date.</p>
      ) : (
        <ScrollArea className="h-[180px] pr-4">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant="outline"
                size="sm"
                disabled={!slot.available}
                className={`
                  border-white/10 text-white hover:bg-white/5 font-light justify-between
                  ${selectedSlot?.id === slot.id ? "bg-ethr-neonblue/20 border-ethr-neonblue" : ""}
                  ${!slot.available ? "opacity-50 line-through" : ""}
                `}
                onClick={() => slot.available && handleSelectTimeSlot(slot)}
              >
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
                <span className="text-ethr-neonblue">${slot.price}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
