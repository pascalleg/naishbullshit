import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const professionalSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  stage_name: z.string(),
  bio: z.string(),
  genres: z.array(z.string()),
  experience_years: z.number(),
  hourly_rate: z.number(),
  is_available: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

const portfolioItemSchema = z.object({
  id: z.string(),
  professional_id: z.string(),
  title: z.string(),
  description: z.string(),
  media_url: z.string(),
  media_type: z.enum(['image', 'video', 'audio']),
  created_at: z.string(),
})

const availabilitySchema = z.object({
  id: z.string().optional(),
  professional_id: z.string(),
  day_of_week: z.number(),
  start_time: z.string(),
  end_time: z.string(),
  is_recurring: z.boolean(),
})

const equipmentSchema = z.object({
  id: z.string(),
  professional_id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  rental_price: z.number().optional(),
})

const performanceSchema = z.object({
  id: z.string(),
  professional_id: z.string(),
  venue_name: z.string(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  status: z.enum(['upcoming', 'completed', 'cancelled']),
  notes: z.string().optional(),
})

type Professional = z.infer<typeof professionalSchema>
type PortfolioItem = z.infer<typeof portfolioItemSchema>
type Availability = z.infer<typeof availabilitySchema>
type Equipment = z.infer<typeof equipmentSchema>
type Performance = z.infer<typeof performanceSchema>

export class ProfessionalService {
  private static instance: ProfessionalService

  private constructor() {}

  static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService()
    }
    return ProfessionalService.instance
  }

  // Professional Profile Management
  async getProfessionalProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching professional profile:', error)
      throw error
    }
  }

  async updateProfessionalProfile(profile: Partial<Professional>) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating professional profile:', error)
      throw error
    }
  }

  // Portfolio Management
  async getPortfolioItems(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching portfolio items:', error)
      throw error
    }
  }

  async addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      throw error
    }
  }

  async deletePortfolioItem(itemId: string) {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      throw error
    }
  }

  // Availability Management
  async getAvailability(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('professional_id', professionalId)
        .order('day_of_week')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching availability:', error)
      throw error
    }
  }

  async updateAvailability(availability: Availability[]) {
    try {
      const { data, error } = await supabase
        .from('availability')
        .upsert(availability)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating availability:', error)
      throw error
    }
  }

  // Equipment Management
  async getEquipment(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('professional_id', professionalId)
        .order('category')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching equipment:', error)
      throw error
    }
  }

  async addEquipment(item: Omit<Equipment, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding equipment:', error)
      throw error
    }
  }

  async updateEquipment(item: Equipment) {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .update(item)
        .eq('id', item.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating equipment:', error)
      throw error
    }
  }

  async deleteEquipment(itemId: string) {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting equipment:', error)
      throw error
    }
  }

  // Performance History
  async getPerformances(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('performances')
        .select('*')
        .eq('professional_id', professionalId)
        .order('date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching performances:', error)
      throw error
    }
  }

  async addPerformance(performance: Omit<Performance, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('performances')
        .insert([performance])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding performance:', error)
      throw error
    }
  }

  async updatePerformance(performance: Performance) {
    try {
      const { data, error } = await supabase
        .from('performances')
        .update(performance)
        .eq('id', performance.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating performance:', error)
      throw error
    }
  }
} 