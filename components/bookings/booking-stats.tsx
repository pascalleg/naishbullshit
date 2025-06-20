import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Calendar, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface BookingStatsProps {
  stats: {
    totalBookings: number
    upcomingBookings: number
    completedBookings: number
    revenue: number
    pendingBookings: number
  }
  timeRange: 'week' | 'month' | 'year'
}

export function BookingStats({ stats, timeRange }: BookingStatsProps) {
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week':
        return 'This Week'
      case 'month':
        return 'This Month'
      case 'year':
        return 'This Year'
      default:
        return ''
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ScrollReveal animation="fade">
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">{getTimeRangeLabel()}</p>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal animation="fade" delay={100}>
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Scheduled Events</p>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal animation="fade" delay={200}>
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getTimeRangeLabel()}</p>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal animation="fade" delay={300}>
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting Confirmation</p>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal animation="fade" delay={400}>
        <Card className="bg-ethr-darkgray/50 border-muted col-span-full">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Booking trends chart will be displayed here
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  )
} 