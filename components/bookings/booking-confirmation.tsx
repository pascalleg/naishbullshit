import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { format } from 'date-fns'
import { Calendar, Clock, MapPin, Users, CreditCard, Download, Share2 } from 'lucide-react'
import { Booking } from '@/lib/services/booking-service'

interface BookingConfirmationProps {
  booking: Booking
  onDownload?: () => void
  onShare?: () => void
  onAddToCalendar?: () => void
}

export function BookingConfirmation({
  booking,
  onDownload,
  onShare,
  onAddToCalendar
}: BookingConfirmationProps) {
  const [loading, setLoading] = useState(false)

  const handleAddToCalendar = async () => {
    setLoading(true)
    try {
      await onAddToCalendar?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Booking Confirmed!</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollReveal>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ethr-neonblue" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ethr-neonblue" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {format(new Date(booking.start_time), 'h:mm a')} -{' '}
                      {format(new Date(booking.end_time), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-ethr-neonblue" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attendees</p>
                    <p className="font-medium">{booking.attendees} people</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-ethr-neonblue" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p className="font-medium capitalize">{booking.payment_status}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-ethr-neonblue" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">Venue Name</p>
                    <p className="text-sm text-muted-foreground">Venue Address</p>
                  </div>
                </div>

                {booking.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}

                {booking.requirements && booking.requirements.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Requirements</p>
                    <ul className="list-disc list-inside text-sm">
                      {booking.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <Button
                onClick={onDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Confirmation
              </Button>
              <Button
                onClick={onShare}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Details
              </Button>
              <Button
                onClick={handleAddToCalendar}
                disabled={loading}
                className="flex-1 bg-ethr-neonblue hover:bg-ethr-neonblue/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </CardContent>
    </Card>
  )
} 