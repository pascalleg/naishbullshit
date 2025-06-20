import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type VenueAvailability = Database['public']['Tables']['venue_availability']['Row']
type VenueBooking = Database['public']['Tables']['venue_bookings']['Row']

export class VenueRealtimeService {
  private static instance: VenueRealtimeService
  private subscriptions: Map<string, () => void> = new Map()

  private constructor() {}

  public static getInstance(): VenueRealtimeService {
    if (!VenueRealtimeService.instance) {
      VenueRealtimeService.instance = new VenueRealtimeService()
    }
    return VenueRealtimeService.instance
  }

  subscribeToVenueAvailability(
    venueId: string,
    onUpdate: (availability: VenueAvailability) => void
  ): () => void {
    const subscription = supabase
      .channel(`venue-availability-${venueId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'venue_availability',
          filter: `venue_id=eq.${venueId}`,
        },
        (payload) => {
          onUpdate(payload.new as VenueAvailability)
        }
      )
      .subscribe()

    this.subscriptions.set(venueId, () => {
      subscription.unsubscribe()
      this.subscriptions.delete(venueId)
    })

    return () => {
      const unsubscribe = this.subscriptions.get(venueId)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }

  subscribeToVenueBookings(
    venueId: string,
    onUpdate: (booking: VenueBooking) => void
  ): () => void {
    const subscription = supabase
      .channel(`venue-bookings-${venueId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'venue_bookings',
          filter: `venue_id=eq.${venueId}`,
        },
        (payload) => {
          onUpdate(payload.new as VenueBooking)
        }
      )
      .subscribe()

    this.subscriptions.set(`bookings-${venueId}`, () => {
      subscription.unsubscribe()
      this.subscriptions.delete(`bookings-${venueId}`)
    })

    return () => {
      const unsubscribe = this.subscriptions.get(`bookings-${venueId}`)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }

  cleanup() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.subscriptions.clear()
  }
} 