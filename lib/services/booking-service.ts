import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { toast } from 'sonner'

const bookingSchema = z.object({
  id: z.string().optional(),
  professional_id: z.string(),
  venue_id: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  total_amount: z.number(),
  payment_status: z.enum(['pending', 'paid', 'refunded']),
  attendees: z.number(),
  notes: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export type Booking = z.infer<typeof bookingSchema>

export class BookingService {
  private static instance: BookingService
  private supabase = supabase

  private constructor() {}

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService()
    }
    return BookingService.instance
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    try {
      const validatedData = bookingSchema.parse(bookingData)
      
      // Check real-time availability
      const isAvailable = await this.checkAvailability(
        bookingData.venue_id,
        bookingData.start_time,
        bookingData.end_time
      )

      if (!isAvailable) {
        throw new Error('Selected time slot is not available')
      }

      const { data, error } = await this.supabase
        .from('bookings')
        .insert([validatedData])
        .select()
        .single()

      if (error) throw error

      // Send confirmation email
      await this.sendBookingConfirmation(data)

      // Initialize payment processing
      await this.initializePayment(data)

      return data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  async checkAvailability(
    venueId: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('venue_id', venueId)
        .or(`start_time.lte.${endTime},end_time.gte.${startTime}`)
        .eq('status', 'confirmed')

      if (error) throw error

      return data.length === 0
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  }

  async updateBookingStatus(
    bookingId: string,
    status: Booking['status']
  ): Promise<Booking> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error

      // Send status update notification
      await this.sendStatusUpdate(data)

      return data
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  async getBooking(bookingId: string): Promise<Booking> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting booking:', error)
      throw error
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('professional_id', userId)
        .order('start_time', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user bookings:', error)
      throw error
    }
  }

  async getVenueBookings(venueId: string): Promise<Booking[]> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('venue_id', venueId)
        .order('start_time', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting venue bookings:', error)
      throw error
    }
  }

  private async sendBookingConfirmation(booking: Booking): Promise<void> {
    try {
      // TODO: Implement email service integration
      console.log('Sending booking confirmation:', booking)
    } catch (error) {
      console.error('Error sending booking confirmation:', error)
    }
  }

  private async sendStatusUpdate(booking: Booking): Promise<void> {
    try {
      // TODO: Implement notification service integration
      console.log('Sending status update:', booking)
    } catch (error) {
      console.error('Error sending status update:', error)
    }
  }

  private async initializePayment(booking: Booking): Promise<void> {
    try {
      // TODO: Implement payment service integration
      console.log('Initializing payment:', booking)
    } catch (error) {
      console.error('Error initializing payment:', error)
    }
  }

  async syncWithCalendar(booking: Booking): Promise<void> {
    try {
      // TODO: Implement calendar sync service integration
      console.log('Syncing with calendar:', booking)
    } catch (error) {
      console.error('Error syncing with calendar:', error)
    }
  }
} 