import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { BookingService } from '@/lib/services/booking-service'
import { Calendar } from '@/components/ui/calendar'
import { TimeSlotSelector } from '@/components/time-slot-selector'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Users, CreditCard } from 'lucide-react'

interface BookingFormProps {
  venueId: string
  professionalId: string
  onSuccess?: (bookingId: string) => void
}

export function BookingForm({ venueId, professionalId, onSuccess }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [attendees, setAttendees] = useState<number>(1)
  const [notes, setNotes] = useState('')
  const [requirements, setRequirements] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)

  const bookingService = BookingService.getInstance()

  useEffect(() => {
    if (selectedDate && selectedSlots.length > 0) {
      checkAvailability()
    }
  }, [selectedDate, selectedSlots])

  const checkAvailability = async () => {
    if (!selectedDate || selectedSlots.length === 0) return

    try {
      const [startTimeLocal, endTimeLocal] = selectedSlots[0].split('-')
      const startDateTime = `${format(selectedDate!, 'yyyy-MM-dd')}T${startTimeLocal}:00Z`
      const endDateTime = `${format(selectedDate!, 'yyyy-MM-dd')}T${endTimeLocal}:00Z`

      const available = await bookingService.checkAvailability(
        venueId,
        startDateTime,
        endDateTime
      )
      setIsAvailable(available)
      setTotalAmount(100) 
    } catch (error) {
      console.error('Error checking availability:', error)
      toast.error('Failed to check availability')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAvailable || !selectedDate || selectedSlots.length === 0) return

    setLoading(true)
    try {
      const [startTimeLocal, endTimeLocal] = selectedSlots[0].split('-')
      const booking = await bookingService.createBooking({
        professional_id: professionalId,
        venue_id: venueId,
        start_time: `${format(selectedDate!, 'yyyy-MM-dd')}T${startTimeLocal}:00Z`,
        end_time: `${format(selectedDate!, 'yyyy-MM-dd')}T${endTimeLocal}:00Z`,
        status: 'pending',
        total_amount: totalAmount,
        payment_status: 'pending',
        attendees,
        notes,
        requirements
      })

      await bookingService.syncWithCalendar(booking)

      toast.success('Booking created successfully')
      onSuccess?.(booking.id)
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
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">
                  Available Time Slots for {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'selected date'}
                </h3>
                <TimeSlotSelector
                  date={selectedDate}
                  onTimeSlotSelect={(startTime, endTime, price) => {
                    setSelectedSlots([`${startTime}-${endTime}`])
                    setTotalAmount(price)
                  }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Number of Attendees</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      value={attendees}
                      onChange={(e) => setAttendees(Number(e.target.value))}
                      className="bg-ethr-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    className="mt-1 bg-ethr-black"
                  />
                </div>

                {!isAvailable && (
                  <div className="text-red-500 text-sm">
                    Selected time slot is not available
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="ml-2 text-lg">${totalAmount}</span>
                  </div>
                  <Button
                    type="submit"
                    disabled={!isAvailable || loading || !selectedDate || selectedSlots.length === 0}
                    className="bg-ethr-neonblue hover:bg-ethr-neonblue/90"
                  >
                    {loading ? (
                      'Processing...'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}