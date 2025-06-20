"use client"

import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollReveal } from "./scroll-reveal"
import { useAuth } from "@/lib/auth"
import { BookingService } from "@/lib/database/booking-service"
import { useToast } from "@/components/ui/use-toast"
import type { BookingType } from "@/lib/database/types/booking"

interface ProfessionalBookingFormProps {
  professionalId: string
  professionalName: string
  professionalType: "sound" | "lighting" | "stage" | "technical"
  hourlyRate: number
  dayRate: number
}

export function ProfessionalBookingForm({
  professionalId,
  professionalName,
  professionalType,
  hourlyRate,
  dayRate,
}: ProfessionalBookingFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [bookingType, setBookingType] = useState<BookingType>("hourly")
  const [hours, setHours] = useState(4)
  const [days, setDays] = useState(1)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("13:00")
  const [projectType, setProjectType] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    if (date && startTime && endTime) {
      checkAvailability()
    }
  }, [date, startTime, endTime])

  const checkAvailability = async () => {
    if (!date) return

    setIsCheckingAvailability(true)
    try {
      const available = await BookingService.checkAvailability(
        professionalId,
        format(date, "yyyy-MM-dd"),
        startTime,
        endTime
      )
      setIsAvailable(available)
    } catch (error) {
      console.error("Error checking availability:", error)
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "destructive",
      })
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !user) {
      toast({
        title: "Error",
        description: "Please select a date and ensure you're logged in",
        variant: "destructive",
      })
      return
    }

    if (!isAvailable) {
      toast({
        title: "Not Available",
        description: "The selected time slot is not available",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const booking = await BookingService.createBooking({
        professional_id: professionalId,
        client_id: user.id,
        booking_type: bookingType,
        start_date: format(date, "yyyy-MM-dd"),
        end_date: format(date, "yyyy-MM-dd"),
        start_time: startTime,
        end_time: endTime,
        duration: bookingType === "hourly" ? hours : days,
        total_price: calculateTotal(),
        project_type: projectType,
        notes,
      })

      setIsSuccess(true)
      toast({
        title: "Success",
        description: "Booking request sent successfully",
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setDate(undefined)
        setBookingType("hourly")
        setHours(4)
        setDays(1)
        setStartTime("09:00")
        setEndTime("13:00")
        setProjectType("")
        setNotes("")
      }, 3000)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    if (bookingType === "hourly") {
      return hourlyRate * hours
    } else {
      return dayRate * days
    }
  }

  const calculateEndTime = (start: string, duration: number) => {
    const [hours, minutes] = start.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(hours + duration, minutes)
    return format(endDate, "HH:mm")
  }

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime)
    setEndTime(calculateEndTime(newStartTime, bookingType === "hourly" ? hours : days * 8))
  }

  const typeLabel =
    professionalType === "sound"
      ? "Sound Engineer"
      : professionalType === "lighting"
        ? "Lighting Designer"
        : professionalType === "stage"
          ? "Stage Manager"
          : "Technical Director"

  return (
    <div id="booking-form" className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Book {professionalName}</h2>
          <p className="text-white/70 mb-6">
            Select your preferred date and booking details to hire this {typeLabel.toLowerCase()}.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="booking-type">Booking Type</Label>
              <Select value={bookingType} onValueChange={(value) => setBookingType(value as BookingType)}>
                <SelectTrigger id="booking-type" className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Select booking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly Rate (${hourlyRate}/hour)</SelectItem>
                  <SelectItem value="daily">Day Rate (${dayRate}/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bookingType === "hourly" ? (
              <div className="space-y-2">
                <Label htmlFor="hours">Number of Hours</Label>
                <Select value={hours.toString()} onValueChange={(value) => {
                  const newHours = Number.parseInt(value)
                  setHours(newHours)
                  setEndTime(calculateEndTime(startTime, newHours))
                }}>
                  <SelectTrigger id="hours" className="bg-white/5 border-white/20">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h} hour{h > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="days">Number of Days</Label>
                <Select value={days.toString()} onValueChange={(value) => {
                  const newDays = Number.parseInt(value)
                  setDays(newDays)
                  setEndTime(calculateEndTime(startTime, newDays * 8))
                }}>
                  <SelectTrigger id="days" className="bg-white/5 border-white/20">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d} day{d > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="bg-white/5 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  readOnly
                  className="bg-white/5 border-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="project-type" className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert / Live Performance</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="studio">Studio Recording</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="private">Private Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your project requirements..."
                className="bg-white/5 border-white/20 min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
              disabled={!date || isSubmitting || isSuccess || !isAvailable || isCheckingAvailability}
            >
              {isCheckingAvailability
                ? "Checking Availability..."
                : isSubmitting
                ? "Processing..."
                : isSuccess
                ? "Booking Confirmed!"
                : !isAvailable
                ? "Time Slot Unavailable"
                : "Confirm Booking"}
            </Button>
          </form>
        </div>

        <div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Select Date</h3>
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 90)}
                  initialFocus
                  fixedWeeks
                />
              </div>

              {date && (
                <ScrollReveal>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Date:</span>
                          <span>{format(date, "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Time:</span>
                          <span>{startTime} - {endTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Duration:</span>
                          <span>
                            {bookingType === "hourly"
                              ? `${hours} hour${hours > 1 ? "s" : ""}`
                              : `${days} day${days > 1 ? "s" : ""}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Rate:</span>
                          <span>
                            ${bookingType === "hourly" ? hourlyRate : dayRate}/
                            {bookingType === "hourly" ? "hour" : "day"}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t border-white/10">
                          <span>Total:</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-white/60">
                      <p className="mb-1">* Booking is subject to professional's confirmation</p>
                      <p>* Cancellation policy: Free cancellation up to 48 hours before the booking</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
