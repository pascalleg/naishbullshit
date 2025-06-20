import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { z } from 'zod'

type Venue = Database['public']['Tables']['venues']['Row']
type VenueReview = Database['public']['Tables']['venue_reviews']['Row']
type VenueAvailability = Database['public']['Tables']['venue_availability']['Row']
type VenueEquipment = Database['public']['Tables']['venue_equipment']['Row']

const venueSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  capacity: z.number().min(1),
  price_per_hour: z.number().min(0),
  images: z.array(z.string()),
  amenities: z.array(z.string()),
  contact_email: z.string().email(),
  contact_phone: z.string(),
  website: z.string().url().optional(),
  social_media: z.record(z.string()).optional(),
})

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
  venue_id: z.string().uuid(),
})

const availabilitySchema = z.object({
  venue_id: z.string().uuid(),
  start_time: z.string(),
  end_time: z.string(),
  is_available: z.boolean(),
  price_override: z.number().optional(),
})

const equipmentSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  quantity: z.number().min(1),
  price_per_hour: z.number().min(0),
  venue_id: z.string().uuid(),
})

export class VenueService {
  private static instance: VenueService

  private constructor() {}

  public static getInstance(): VenueService {
    if (!VenueService.instance) {
      VenueService.instance = new VenueService()
    }
    return VenueService.instance
  }

  async createVenue(data: z.infer<typeof venueSchema>, userId: string): Promise<Venue> {
    const validatedData = venueSchema.parse(data)
    
    const { data: venue, error } = await supabase
      .from('venues')
      .insert([{ ...validatedData, owner_id: userId }])
      .select()
      .single()

    if (error) throw error
    return venue
  }

  async updateVenue(id: string, data: Partial<z.infer<typeof venueSchema>>): Promise<Venue> {
    const validatedData = venueSchema.partial().parse(data)
    
    const { data: venue, error } = await supabase
      .from('venues')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return venue
  }

  async getVenue(id: string): Promise<Venue> {
    const { data: venue, error } = await supabase
      .from('venues')
      .select('*, venue_reviews(*), venue_equipment(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return venue
  }

  async searchVenues(params: {
    query?: string
    city?: string
    minCapacity?: number
    maxPrice?: number
    amenities?: string[]
    page?: number
    limit?: number
  }): Promise<{ venues: Venue[]; total: number }> {
    let query = supabase
      .from('venues')
      .select('*', { count: 'exact' })

    if (params.query) {
      query = query.ilike('name', `%${params.query}%`)
    }

    if (params.city) {
      query = query.eq('city', params.city)
    }

    if (params.minCapacity) {
      query = query.gte('capacity', params.minCapacity)
    }

    if (params.maxPrice) {
      query = query.lte('price_per_hour', params.maxPrice)
    }

    if (params.amenities?.length) {
      query = query.contains('amenities', params.amenities)
    }

    const page = params.page || 1
    const limit = params.limit || 10
    const start = (page - 1) * limit

    query = query.range(start, start + limit - 1)

    const { data: venues, error, count } = await query

    if (error) throw error
    return { venues: venues || [], total: count || 0 }
  }

  async addReview(data: z.infer<typeof reviewSchema>, userId: string): Promise<VenueReview> {
    const validatedData = reviewSchema.parse(data)
    
    const { data: review, error } = await supabase
      .from('venue_reviews')
      .insert([{ ...validatedData, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return review
  }

  async updateAvailability(data: z.infer<typeof availabilitySchema>): Promise<VenueAvailability> {
    const validatedData = availabilitySchema.parse(data)
    
    const { data: availability, error } = await supabase
      .from('venue_availability')
      .insert([validatedData])
      .select()
      .single()

    if (error) throw error
    return availability
  }

  async addEquipment(data: z.infer<typeof equipmentSchema>): Promise<VenueEquipment> {
    const validatedData = equipmentSchema.parse(data)
    
    const { data: equipment, error } = await supabase
      .from('venue_equipment')
      .insert([validatedData])
      .select()
      .single()

    if (error) throw error
    return equipment
  }

  async getVenueAvailability(venueId: string, startDate: string, endDate: string): Promise<VenueAvailability[]> {
    const { data: availability, error } = await supabase
      .from('venue_availability')
      .select('*')
      .eq('venue_id', venueId)
      .gte('start_time', startDate)
      .lte('end_time', endDate)

    if (error) throw error
    return availability || []
  }

  async getVenueReviews(venueId: string, page = 1, limit = 10): Promise<{ reviews: VenueReview[]; total: number }> {
    const start = (page - 1) * limit

    const { data: reviews, error, count } = await supabase
      .from('venue_reviews')
      .select('*, profiles(name, avatar_url)', { count: 'exact' })
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
      .range(start, start + limit - 1)

    if (error) throw error
    return { reviews: reviews || [], total: count || 0 }
  }
} 