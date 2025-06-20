import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueBookingService } from '@/lib/services/venue-booking-service'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, MoreHorizontal, Music, User } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BookingListProps {
  timeRange: 'week' | 'month' | 'year'
}

export function BookingList({ timeRange }: BookingListProps) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')

  useEffect(() => {
    loadBookings()
  }, [timeRange, statusFilter, sortBy])

  const loadBookings = async () => {
    try {
      const bookingService = VenueBookingService.getInstance()
      // Load bookings based on filters and sorting
      // This is a placeholder - implement actual booking loading
      setBookings([
        {
          id: '1',
          title: 'Neon Nights Festival',
          date: 'Apr 30, 2024',
          time: '8:00 PM - 10:00 PM',
          location: 'Skyline Arena, Los Angeles',
          status: 'confirmed',
          client: 'Festival Productions Inc.',
          fee: '$800',
        },
        {
          id: '2',
          title: 'Club Resonance Residency',
          date: 'May 15, 2024',
          time: '10:00 PM - 2:00 AM',
          location: 'Club Resonance, Miami',
          status: 'pending',
          client: 'Nightlife Ventures LLC',
          fee: '$600',
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Booking List</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="fee">Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <ScrollReveal key={booking.id} animation="fade">
                <div className="bg-ethr-black p-4 rounded-lg border border-muted hover:border-ethr-neonblue/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{booking.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <User className="mr-1 h-4 w-4" />
                        {booking.client}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-ethr-neonblue" />
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-ethr-neonblue" />
                      {booking.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-4 w-4 text-ethr-neonblue" />
                      {booking.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <Music className="mr-1 h-4 w-4 text-ethr-neonblue" />
                      <span className="text-sm">Performance Fee: {booking.fee}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 