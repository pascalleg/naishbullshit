import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { z } from 'zod'

type VenueBooking = Database['public']['Tables']['venue_bookings']['Row']
type VenueRow = Database['public']['Tables']['venues']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type VenueAvailabilityRow = Database['public']['Tables']['venue_availability']['Row']
type VenueEquipmentRow = Database['public']['Tables']['venue_equipment']['Row']

const bookingSchema = z.object({
  venue_id: z.string().uuid(),
  user_id: z.string().uuid(),
  start_time: z.string(), // Keeping these as strings for now as per schema
  end_time: z.string(),   // Keeping these as strings for now as per schema
  start_date: z.string(), // Add start_date and end_date if they are used for overlapping checks
  end_date: z.string(),   // Add start_date and end_date if they are used for overlapping checks
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  total_price: z.number().min(0),
  attendees: z.number().min(1),
  notes: z.string().optional(),
  equipment_rental: z.array(z.object({
    equipment_id: z.string().uuid(),
    quantity: z.number().min(1),
  })).optional(),
})

export class VenueBookingService {
  private static instance: VenueBookingService

  private constructor() {}

  public static getInstance(): VenueBookingService {
    if (!VenueBookingService.instance) {
      VenueBookingService.instance = new VenueBookingService()
    }
    return VenueBookingService.instance
  }

  async createBooking(data: z.infer<typeof bookingSchema>): Promise<VenueBooking> {
    const validatedData = bookingSchema.parse(data)
    
    // Check venue availability
    const isAvailable = await this.checkAvailability(
      data.venue_id,
      data.start_date, // Use start_date
      data.end_date    // Use end_date
    )

    if (!isAvailable) {
      throw new Error('Venue is not available for the selected time slot')
    }

    const { data: booking, error } = await supabase
      .from('venue_bookings')
      .insert([validatedData])
      .select()
      .single()

    if (error) throw error
    return booking
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<VenueBooking> {
    const { data: booking, error } = await supabase
      .from('venue_bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return booking
  }

  async getBooking(bookingId: string): Promise<VenueBooking & { venues: VenueRow, profiles: ProfileRow }> {
    const { data: booking, error } = await supabase
      .from('venue_bookings')
      .select('*, venues(*), profiles(*)')
      .eq('id', bookingId)
      .single()

    if (error) throw error
    if (!booking || !booking.venues || !booking.profiles) {
      throw new Error('Booking or associated venue/profile data not found');
    }
    return booking as VenueBooking & { venues: VenueRow, profiles: ProfileRow }
  }

  async getUserBookings(userId: string): Promise<Array<VenueBooking & { venues: VenueRow }>> {
    const { data: bookings, error } = await supabase
      .from('venue_bookings')
      .select('*, venues(*)')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })

    if (error) throw error
    return (bookings || []) as Array<VenueBooking & { venues: VenueRow }>
  }

  async getVenueBookings(venueId: string): Promise<Array<VenueBooking & { profiles: ProfileRow }>> {
    const { data: bookings, error } = await supabase
      .from('venue_bookings')
      .select('*, profiles(*)')
      .eq('venue_id', venueId)
      .order('start_time', { ascending: false })

    if (error) throw error
    return (bookings || []) as Array<VenueBooking & { profiles: ProfileRow }>
  }

  public async checkAvailability(
    venueId: string,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    // Check if there are any overlapping bookings
    const { data: overlappingBookings, error } = await supabase
      .from('venue_bookings')
      .select('id')
      .eq('venue_id', venueId)
      .not('status', 'eq', 'cancelled')
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`) // Use start_date and end_date

    if (error) throw error

    // Check if the venue is marked as available
    const { data: availability, error: availabilityError } = await supabase
      .from('venue_availability')
      .select('is_available')
      .eq('venue_id', venueId)
      .gte('start_time', startDate) // Assuming venue_availability uses start_time/end_time for time-based availability within a date
      .lte('end_time', endDate) // Assuming venue_availability uses start_time/end_time for time-based availability within a date

    if (availabilityError) throw availabilityError

    return (
      (!overlappingBookings || overlappingBookings.length === 0) &&
      availability?.every(a => a.is_available)
    )
  }

  async calculatePrice(
    venueId: string,
    startTime: string,
    endTime: string,
    attendees: number,
    equipmentRental?: { equipment_id: string; quantity: number }[]
  ): Promise<number> {
    // Get venue base price
    const { data: venue, error } = await supabase
      .from('venues')
      .select('price_per_hour')
      .eq('id', venueId)
      .single()

    if (error) throw error

    // Calculate duration in hours
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    // Calculate base price
    let totalPrice = venue.price_per_hour * durationHours

    // Add equipment rental costs if any
    if (equipmentRental?.length) {
      const { data: equipment, error: equipmentError } = await supabase
        .from('venue_equipment')
        .select('id, price_per_hour') // Select id here
        .in(
          'id',
          equipmentRental.map(e => e.equipment_id)
        )

      if (equipmentError) throw equipmentError

      equipmentRental.forEach(rental => {
        const equipmentItem = equipment?.find(e => e.id === rental.equipment_id)
        if (equipmentItem) {
          totalPrice += equipmentItem.price_per_hour * rental.quantity * durationHours
        }
      })
    }

    return totalPrice
  }
}