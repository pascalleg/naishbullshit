import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueBookingService } from '@/lib/services/venue-booking-service'
import { VenueRealtimeService } from '@/lib/services/venue-realtime-service'
import { Calendar } from '@/components/ui/calendar'
import { format, addHours, isSameDay } from 'date-fns'
import { Clock, Users, DollarSign } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

interface VenueBookingProps {
  venueId: string
  onBookingComplete?: () => void
}

export function VenueBooking({ venueId, onBookingComplete }: VenueBookingProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined) // Changed initial state to undefined
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [attendees, setAttendees] = useState('')
  const [notes, setNotes] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<{ equipment_id: string; quantity: number }[]>([]) // Corrected type

  useEffect(() => {
    const venueRealtimeService = VenueRealtimeService.getInstance()
    const unsubscribe = venueRealtimeService.subscribeToVenueAvailability(
      venueId,
      () => {
        if (selectedDate) {
          loadAvailableSlots(selectedDate)
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [venueId, selectedDate])

  const loadAvailableSlots = async (date: Date) => {
    try {
      const bookingService = VenueBookingService.getInstance()
      const startOfDay = format(date, 'yyyy-MM-dd') + 'T00:00:00Z'
      const endOfDay = format(date, 'yyyy-MM-dd') + 'T23:59:59Z'

      const isAvailable = await bookingService.checkAvailability(
        venueId,
        startOfDay,
        endOfDay
      )

      if (isAvailable) {
        // Generate time slots from 9 AM to 9 PM
        const slots = []
        for (let hour = 9; hour < 21; hour++) {
          slots.push(`${hour.toString().padStart(2, '0')}:00`)
        }
        setAvailableSlots(slots)
      } else {
        setAvailableSlots([])
      }
    } catch (error) {
      console.error('Error loading available slots:', error)
      toast.error('Failed to load available time slots')
    }
  }

  const handleDateSelect = (date: Date | undefined) => { // Allow undefined
    setSelectedDate(date)
    setStartTime('')
    setEndTime('')
    if (date) {
      loadAvailableSlots(date)
    } else {
      setAvailableSlots([]); // Clear slots if no date is selected
    }
  }

  const handleTimeSelect = (time: string) => {
    setStartTime(time)
    setEndTime('')
    calculatePrice(time, '')
  }

  const handleEndTimeSelect = (time: string) => {
    setEndTime(time)
    calculatePrice(startTime, time)
  }

  const calculatePrice = async (start: string, end: string) => {
    if (!start || !end || !selectedDate) return

    try {
      const bookingService = VenueBookingService.getInstance()
      const startDateTime = format(selectedDate, 'yyyy-MM-dd') + `T${start}:00Z`
      const endDateTime = format(selectedDate, 'yyyy-MM-dd') + `T${end}:00Z`

      const price = await bookingService.calculatePrice(
        venueId,
        startDateTime,
        endDateTime,
        parseInt(attendees) || 0,
        selectedEquipment
      )

      setTotalPrice(price)
    } catch (error) {
      console.error('Error calculating price:', error)
      toast.error('Failed to calculate price')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !startTime || !endTime || !attendees) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const bookingService = VenueBookingService.getInstance()
      const startDateTime = format(selectedDate, 'yyyy-MM-dd') + `T${startTime}:00Z`
      const endDateTime = format(selectedDate, 'yyyy-MM-dd') + `T${endTime}:00Z`

      await bookingService.createBooking({
        venue_id: venueId,
        user_id: 'user-id', // Replace with actual user ID
        start_time: startDateTime,
        end_time: endDateTime,
        start_date: format(selectedDate, 'yyyy-MM-dd'), // Add start_date
        end_date: format(selectedDate, 'yyyy-MM-dd'), // Add end_date
        status: 'pending',
        total_price: totalPrice,
        attendees: parseInt(attendees),
        notes,
        equipment_rental: selectedEquipment,
      })

      toast.success('Booking request submitted successfully')
      onBookingComplete?.()
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Book Venue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollReveal animation="fade">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  required={false} // Add required prop
                />
              </div>

              {selectedDate && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map(slot => (
                        <Button
                          key={slot}
                          type="button"
                          variant={startTime === slot ? 'default' : 'outline'}
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {startTime && (
                    <div>
                      <label className="block text-sm font-medium mb-2">End Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots
                          .filter(slot => slot > startTime)
                          .map(slot => (
                            <Button
                              key={slot}
                              type="button"
                              variant={endTime === slot ? 'default' : 'outline'}
                              onClick={() => handleEndTimeSelect(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={100}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Attendees</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    value={attendees}
                    onChange={e => setAttendees(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    value={`$${totalPrice.toFixed(2)}`}
                    readOnly
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={200}>
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requirements or notes..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </ScrollReveal>
        </form>
      </CardContent>
    </Card>
  )
}