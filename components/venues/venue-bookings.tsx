import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueBookingService } from '@/lib/services/venue-booking-service'
import { format } from 'date-fns'
import { Calendar, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface VenueBookingsProps {
  venueId: string
  className?: string
}

type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export function VenueBookings({ venueId, className }: VenueBookingsProps) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  useEffect(() => {
    loadBookings()
  }, [venueId, statusFilter])

  const loadBookings = async () => {
    try {
      const bookingService = VenueBookingService.getInstance()
      const venueBookings = await bookingService.getVenueBookings(venueId)
      
      const filteredBookings = statusFilter === 'all'
        ? venueBookings
        : venueBookings.filter(booking => booking.status === statusFilter)

      setBookings(filteredBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const bookingService = VenueBookingService.getInstance()
      await bookingService.updateBookingStatus(bookingId, newStatus)
      toast.success('Booking status updated successfully')
      loadBookings()
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast.error('Failed to update booking status')
    }
  }

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Venue Bookings</CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <ScrollReveal key={booking.id} animation="fade">
                <Card className="bg-ethr-darkgray/50 border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <span className="font-medium">
                            {booking.user_profile?.full_name || 'Unknown User'}
                          </span>
                        </div>
                        <div className="grid gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.start_time), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(new Date(booking.start_time), 'h:mm a')} -{' '}
                            {format(new Date(booking.end_time), 'h:mm a')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {booking.attendees} attendees
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            ${booking.total_price.toFixed(2)}
                          </div>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground">
                            Notes: {booking.notes}
                          </p>
                        )}
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 