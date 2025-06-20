import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueBookingService } from '@/lib/services/venue-booking-service'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar' // Changed import from MultiDayCalendar to Calendar
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Clock, MapPin, MoreHorizontal } from 'lucide-react' // Renamed Calendar import to CalendarIcon
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface BookingCalendarProps {
  timeRange: 'week' | 'month' | 'year'
}

export function BookingCalendar({ timeRange }: BookingCalendarProps) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    loadBookings()
  }, [timeRange, selectedDate])

  const loadBookings = async () => {
    try {
      const bookingService = VenueBookingService.getInstance()
      // Load bookings based on time range and selected date
      // This is a placeholder - implement actual booking loading
      setBookings([
        {
          id: '1',
          title: 'Neon Nights Festival',
          start: new Date(2024, 3, 30, 20, 0),
          end: new Date(2024, 3, 30, 22, 0),
          status: 'confirmed',
          location: 'Skyline Arena, Los Angeles',
        },
        {
          id: '2',
          title: 'Club Resonance Residency',
          start: new Date(2024, 4, 15, 22, 0),
          end: new Date(2024, 4, 16, 2, 0),
          status: 'pending',
          location: 'Club Resonance, Miami',
        },
      ])
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/20 text-green-500 border-none">Confirmed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-none">Pending</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-500 border-none">Cancelled</Badge>
      default:
        return null
    }
  }

  const renderBookingCard = (booking: any) => (
    <div
      key={booking.id}
      className="bg-ethr-black p-4 rounded-lg border border-muted hover:border-ethr-neonblue/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{booking.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Clock className="mr-1 h-4 w-4" />
            {format(booking.start, 'h:mm a')} - {format(booking.end, 'h:mm a')}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="mr-1 h-4 w-4" />
            {booking.location}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(booking.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>View Contract</DropdownMenuItem>
              <DropdownMenuItem>Message Client</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Cancel Booking</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Booking Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div>
            <Calendar
              mode="single" // Set mode to "single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)} // Ensure date is Date | undefined
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">
              Bookings for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            {loading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No bookings found for this date
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => renderBookingCard(booking))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}