"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { VenueBookingService } from '@/lib/services/venue-booking-service'
import { format } from 'date-fns'
import { Calendar, Clock, MapPin, MoreHorizontal, Music, User, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MultiDayCalendar } from '@/components/multi-day-calendar'
import { BookingStats } from '@/components/bookings/booking-stats'
import { BookingCalendar } from '@/components/bookings/booking-calendar'
import { BookingList } from '@/components/bookings/booking-list'

export function BookingDashboard() {
  const [view, setView] = useState<'overview' | 'calendar' | 'list'>('overview')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    revenue: 0,
    pendingBookings: 0,
  })

  useEffect(() => {
    loadStats()
  }, [timeRange])

  const loadStats = async () => {
    try {
      const bookingService = VenueBookingService.getInstance()
      // Load booking statistics based on time range
      // This is a placeholder - implement actual stats loading
      setStats({
        totalBookings: 150,
        upcomingBookings: 25,
        completedBookings: 120,
        revenue: 25000,
        pendingBookings: 5,
      })
    } catch (error) {
      console.error('Error loading booking stats:', error)
      toast.error('Failed to load booking statistics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant={view === 'overview' ? 'default' : 'outline'}
            onClick={() => setView('overview')}
          >
            Overview
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            List
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {view === 'overview' && (
        <ScrollReveal animation="fade">
          <BookingStats stats={stats} timeRange={timeRange} />
        </ScrollReveal>
      )}

      {view === 'calendar' && (
        <ScrollReveal animation="fade">
          <BookingCalendar timeRange={timeRange} />
        </ScrollReveal>
      )}

      {view === 'list' && (
        <ScrollReveal animation="fade">
          <BookingList timeRange={timeRange} />
        </ScrollReveal>
      )}
    </div>
  )
} 