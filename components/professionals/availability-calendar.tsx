import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { ProfessionalService } from '@/lib/services/professional-service'
import { Calendar } from '@/components/ui/calendar' // Changed import from MultiDayCalendar to Calendar
import { TimeSlotSelector } from '@/components/time-slot-selector'
import { format, addDays, isSameDay } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Save } from 'lucide-react'

interface AvailabilityCalendarProps {
  professionalId: string
}

export function AvailabilityCalendar({ professionalId }: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()) // Changed initial state to undefined
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [isRecurring, setIsRecurring] = useState(false)

  useEffect(() => {
    loadAvailability()
  }, [professionalId])

  const loadAvailability = async () => {
    try {
      const professionalService = ProfessionalService.getInstance()
      const data = await professionalService.getAvailability(professionalId)
      setAvailability(data)
    } catch (error) {
      console.error('Error loading availability:', error)
      toast.error('Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAvailability = async () => {
    try {
      const professionalService = ProfessionalService.getInstance()
      if (!selectedDate) {
        toast.error('Please select a date to save availability.')
        return;
      }
      const dayOfWeek = selectedDate.getDay()
      const slots = selectedSlots.map(slot => {
        const [start, end] = slot.split('-')
        return {
          professional_id: professionalId,
          day_of_week: dayOfWeek,
          start_time: start,
          end_time: end,
          is_recurring: isRecurring,
        }
      })

      await professionalService.updateAvailability(slots)
      toast.success('Availability updated successfully')
      loadAvailability()
    } catch (error) {
      console.error('Error updating availability:', error)
      toast.error('Failed to update availability')
    }
  }

  const getDayAvailability = (date: Date) => {
    const dayOfWeek = date.getDay()
    return availability.filter(a => a.day_of_week === dayOfWeek)
  }

  const handleDateSelect = (date: Date | undefined) => { // Allow undefined for onSelect
    if (date) {
      setSelectedDate(date)
      const dayAvailability = getDayAvailability(date)
      setSelectedSlots(
        dayAvailability.map(a => `${a.start_time}-${a.end_time}`)
      )
      setIsRecurring(dayAvailability[0]?.is_recurring || false)
    } else {
      setSelectedDate(undefined); // Clear selected date if undefined is passed
      setSelectedSlots([]);
      setIsRecurring(false);
    }
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div>
            <Calendar // Changed from MultiDayCalendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Availability for {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'selected date'}
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={e => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="recurring" className="text-sm">
                  Recurring weekly
                </label>
              </div>
            </div>

            <TimeSlotSelector
              date={selectedDate} // Pass the selectedDate
              onTimeSlotSelect={(startTime, endTime) => { // Removed price as it's not in TimeSlotSelector
                setSelectedSlots([`${startTime}-${endTime}`])
              }}
            />

            <div className="flex justify-end">
              <Button onClick={handleSaveAvailability}>
                <Save className="w-4 h-4 mr-2" />
                Save Availability
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading availability...</div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-medium">Current Schedule</h4>
                <div className="grid gap-2">
                  {getDayAvailability(selectedDate || new Date()).map((slot, index) => ( // Use new Date() as fallback for selectedDate
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-ethr-black rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-ethr-neonblue" />
                        <span>
                          {format(new Date(`2000-01-01T${slot.start_time}`), 'h:mm a')} -{' '}
                          {format(new Date(`2000-01-01T${slot.end_time}`), 'h:mm a')}
                        </span>
                      </div>
                      {slot.is_recurring && (
                        <span className="text-sm text-muted-foreground">
                          Recurring weekly
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}