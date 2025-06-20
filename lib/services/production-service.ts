import { supabase } from '@/lib/supabase'
import { APIError } from '@/lib/api-error'
import { apiLogger } from '@/lib/api-logger'
import { z } from 'zod'

// Validation schemas
const equipmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  lastMaintenance: z.string().datetime().optional(),
  notes: z.string().optional(),
})

const availabilitySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['available', 'booked', 'maintenance']),
  notes: z.string().optional(),
})

const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string().url()),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
})

export class ProductionService {
  private logger = apiLogger

  // Equipment Management
  async getEquipment(userId: string) {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', userId)
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to fetch equipment', { error, userId })
      throw new APIError('Failed to fetch equipment', 500)
    }
  }

  async addEquipment(userId: string, equipment: z.infer<typeof equipmentSchema>) {
    try {
      const validatedData = equipmentSchema.safeParse(equipment)

      if (!validatedData.success) {
        throw new APIError('Invalid equipment data', 400, 'VALIDATION_ERROR', validatedData.error.format())
      }

      const { data, error } = await supabase
        .from('equipment')
        .insert([{ ...validatedData.data, user_id: userId }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to add equipment', { error, userId })
      throw new APIError('Failed to add equipment', 500)
    }
  }

  async updateEquipment(
    userId: string,
    equipmentId: string,
    equipment: z.infer<typeof equipmentSchema>
  ) {
    try {
      const validatedData = equipmentSchema.safeParse(equipment)

      if (!validatedData.success) {
        throw new APIError('Invalid equipment data', 400, 'VALIDATION_ERROR', validatedData.error.format())
      }

      const { data, error } = await supabase
        .from('equipment')
        .update(validatedData.data)
        .eq('id', equipmentId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to update equipment', { error, userId, equipmentId })
      throw new APIError('Failed to update equipment', 500)
    }
  }

  async deleteEquipment(userId: string, equipmentId: string) {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', equipmentId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      this.logger.error('Failed to delete equipment', { error, userId, equipmentId })
      throw new APIError('Failed to delete equipment', 500)
    }
  }

  // Availability Management
  async getAvailability(userId: string) {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('user_id', userId)
        .order('start_date')

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to fetch availability', { error, userId })
      throw new APIError('Failed to fetch availability', 500)
    }
  }

  async addAvailability(
    userId: string,
    availability: z.infer<typeof availabilitySchema>
  ) {
    try {
      const validatedData = availabilitySchema.safeParse(availability)

      if (!validatedData.success) {
        throw new APIError('Invalid availability data', 400, 'VALIDATION_ERROR', validatedData.error.format())
      }

      const { data, error } = await supabase
        .from('availability')
        .insert([{ ...validatedData.data, user_id: userId }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to add availability', { error, userId })
      throw new APIError('Failed to add availability', 500)
    }
  }

  async updateAvailability(
    userId: string,
    availabilityId: string,
    availability: z.infer<typeof availabilitySchema>
  ) {
    try {
      const validatedData = availabilitySchema.safeParse(availability)

      if (!validatedData.success) {
        throw new APIError('Invalid availability data', 400, 'VALIDATION_ERROR', validatedData.error.format())
      }

      const { data, error } = await supabase
        .from('availability')
        .update(validatedData.data)
        .eq('id', availabilityId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to update availability', {
        error,
        userId,
        availabilityId,
      })
      throw new APIError('Failed to update availability', 500)
    }
  }

  async deleteAvailability(userId: string, availabilityId: string) {
    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', availabilityId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      this.logger.error('Failed to delete availability', {
        error,
        userId,
        availabilityId,
      })
      throw new APIError('Failed to delete availability', 500)
    }
  }

  // Portfolio Management
  async getPortfolio(userId: string) {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to fetch portfolio', { error, userId })
      throw new APIError('Failed to fetch portfolio', 500)
    }
  }

  async addPortfolioItem(
    userId: string,
    portfolioItem: z.infer<typeof portfolioSchema>
  ) {
    try {
      const validatedData = portfolioSchema.safeParse(portfolioItem)

      if (!validatedData.success) {
        throw new APIError('Invalid portfolio data', 400, 'VALIDATION_ERROR', validatedData.error.format())
      }

      const { data, error } = await supabase
        .from('portfolio')
        .insert([{ ...validatedData.data, user_id: userId }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to add portfolio item', { error, userId })
      throw new APIError('Failed to add portfolio item', 500)
    }
  }

  async updatePortfolioItem(
    userId: string,
    portfolioId: string,
    portfolioItem: z.infer<typeof portfolioSchema>
  ) {
    try {
      const validatedData = portfolioSchema.safeParse(portfolioItem)

      if (!validatedData.success) {
        throw new APIError('Invalid portfolio data', 400, 'VALIDATION_ERROR', validatedData.error.format())
      }

      const { data, error } = await supabase
        .from('portfolio')
        .update(validatedData.data)
        .eq('id', portfolioId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.logger.error('Failed to update portfolio item', {
        error,
        userId,
        portfolioId,
      })
      throw new APIError('Failed to update portfolio item', 500)
    }
  }

  async deletePortfolioItem(userId: string, portfolioId: string) {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', portfolioId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      this.logger.error('Failed to delete portfolio item', {
        error,
        userId,
        portfolioId,
      })
      throw new APIError('Failed to delete portfolio item', 500)
    }
  }
}

// Create a singleton instance
export const productionService = new ProductionService() 