import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueService } from '@/lib/services/venue-service'
import { format, addDays, isSameDay } from 'date-fns'

interface VenueAvailabilityProps {
  venueId: string
  onAvailabilityChange?: () => void
}

export function VenueAvailability({ venueId, onAvailabilityChange }: VenueAvailabilityProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [availability, setAvailability] = useState<any[]>([])
  const [priceOverride, setPriceOverride] = useState<string>('')

  useEffect(() => {
    loadAvailability()
  }, [venueId])

  const loadAvailability = async () => {
    try {
      const venueService = VenueService.getInstance()
      const startDate = format(new Date(), 'yyyy-MM-dd')
      const endDate = format(addDays(new Date(), 30), 'yyyy-MM-dd')
      const data = await venueService.getVenueAvailability(venueId, startDate, endDate)
      setAvailability(data)
    } catch (error) {
      console.error('Error loading availability:', error)
      toast.error('Failed to load availability')
    }
  }

  const handleDateSelect = (dates: Date[]) => {
    setSelectedDates(dates)
  }

  const handleAvailabilityUpdate = async (isAvailable: boolean) => {
    if (selectedDates.length === 0) {
      toast.error('Please select dates')
      return
    }

    setLoading(true)
    try {
      const venueService = VenueService.getInstance()
      const updates = selectedDates.map(date => ({
        venue_id: venueId,
        start_time: format(date, 'yyyy-MM-dd') + 'T00:00:00Z',
        end_time: format(date, 'yyyy-MM-dd') + 'T23:59:59Z',
        is_available: isAvailable,
        price_override: priceOverride ? parseFloat(priceOverride) : undefined,
      }))

      await Promise.all(updates.map(update => venueService.updateAvailability(update)))
      toast.success('Availability updated successfully')
      setSelectedDates([])
      setPriceOverride('')
      onAvailabilityChange?.()
      loadAvailability()
    } catch (error) {
      console.error('Error updating availability:', error)
      toast.error('Failed to update availability')
    } finally {
      setLoading(false)
    }
  }

  const isDateAvailable = (date: Date) => {
    return availability.some(a => 
      isSameDay(new Date(a.start_time), date) && a.is_available
    )
  }

  const isDateUnavailable = (date: Date) => {
    return availability.some(a => 
      isSameDay(new Date(a.start_time), date) && !a.is_available
    )
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollReveal animation="fade">
          <div className="flex justify-center">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={handleDateSelect}
              className="rounded-md border"
              required={false} // Add required prop
              modifiers={{
                available: isDateAvailable,
                unavailable: isDateUnavailable,
              }}
              modifiersStyles={{
                available: { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
                unavailable: { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
              }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={100}>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Price Override (optional)</label>
                <input
                  type="number"
                  value={priceOverride}
                  onChange={e => setPriceOverride(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ethr-neonblue focus:ring-ethr-neonblue"
                  placeholder="Enter custom price"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => handleAvailabilityUpdate(false)}
                disabled={loading || selectedDates.length === 0}
              >
                Mark as Unavailable
              </Button>
              <Button
                onClick={() => handleAvailabilityUpdate(true)}
                disabled={loading || selectedDates.length === 0}
              >
                Mark as Available
              </Button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={200}>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Legend</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-green-500/10" />
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-red-500/10" />
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </CardContent>
    </Card>
  )
}