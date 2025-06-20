'use client'

import { BookingDashboard } from '@/components/bookings/booking-dashboard'
import { Skeleton } from '@/components/loading-skeleton'

export default function Page() {
  return <BookingDashboard fallback={<Skeleton />} />
}

