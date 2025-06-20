import { supabase } from '@/lib/supabase'
import { APIError } from '@/lib/api-error'
import { apiLogger } from '@/lib/api-logger'
import { z } from 'zod'

// Validation schemas
const contractSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  status: z.enum(['draft', 'pending', 'active', 'completed', 'cancelled']),
  terms: z.record(z.unknown()),
  payment_terms: z.object({
    amount: z.number().positive(),
    currency: z.string(),
    schedule: z.enum(['one_time', 'weekly', 'monthly']),
    due_date: z.string().datetime().optional(),
  }),
  parties: z.array(z.object({
    user_id: z.string().uuid(),
    role: z.enum(['client', 'artist', 'venue']),
    signature: z.string().optional(),
    signed_at: z.string().datetime().optional(),
  })),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    size: z.number(),
  })).optional(),
})

const contractUpdateSchema = contractSchema.partial()

export class ContractService {
  private static instance: ContractService

  private constructor() {}

  static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService()
    }
    return ContractService.instance
  }

  async createContract(userId: string, contract: z.infer<typeof contractSchema>) {
    try {
      const validatedData = contractSchema.parse(contract)

      const { data, error } = await supabase
        .from('contracts')
        .insert({
          ...validatedData,
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to create contract', { error, userId })
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid contract data', 400)
      }
      throw new APIError('Failed to create contract', 500)
    }
  }

  async getContract(userId: string, contractId: string) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, parties(*)')
        .eq('id', contractId)
        .or(`created_by.eq.${userId},parties.user_id.eq.${userId}`)
        .single()

      if (error) throw error
      if (!data) {
        throw new APIError('Contract not found', 404)
      }

      return data
    } catch (error) {
      apiLogger.error('Failed to get contract', { error, userId, contractId })
      throw error
    }
  }

  async getContracts(userId: string, options?: {
    status?: string[]
    role?: 'client' | 'artist' | 'venue'
    startDate?: string
    endDate?: string
  }) {
    try {
      let query = supabase
        .from('contracts')
        .select('*, parties(*)')
        .or(`created_by.eq.${userId},parties.user_id.eq.${userId}`)

      if (options?.status) {
        query = query.in('status', options.status)
      }

      if (options?.role) {
        query = query.eq('parties.role', options.role)
      }

      if (options?.startDate) {
        query = query.gte('start_date', options.startDate)
      }

      if (options?.endDate) {
        query = query.lte('end_date', options.endDate)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get contracts', { error, userId })
      throw error
    }
  }

  async updateContract(userId: string, contractId: string, updates: z.infer<typeof contractUpdateSchema>) {
    try {
      const validatedData = contractUpdateSchema.parse(updates)

      // Check if user has permission to update
      const contract = await this.getContract(userId, contractId)
      if (contract.created_by !== userId) {
        throw new APIError('Not authorized to update this contract', 403)
      }

      const { data, error } = await supabase
        .from('contracts')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to update contract', { error, userId, contractId })
      throw error
    }
  }

  async signContract(userId: string, contractId: string, signature: string) {
    try {
      // Check if user is a party in the contract
      const contract = await this.getContract(userId, contractId)
      const party = contract.parties.find((p: any) => p.user_id === userId)
      if (!party) {
        throw new APIError('Not authorized to sign this contract', 403)
      }

      const { data, error } = await supabase
        .from('contract_parties')
        .update({
          signature,
          signed_at: new Date().toISOString(),
        })
        .eq('contract_id', contractId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Check if all parties have signed
      const allSigned = await this.checkAllPartiesSigned(contractId)
      if (allSigned) {
        await this.updateContractStatus(contractId, 'active')
      }

      return data
    } catch (error) {
      apiLogger.error('Failed to sign contract', { error, userId, contractId })
      throw error
    }
  }

  async cancelContract(userId: string, contractId: string, reason: string) {
    try {
      // Check if user has permission to cancel
      const contract = await this.getContract(userId, contractId)
      if (contract.created_by !== userId) {
        throw new APIError('Not authorized to cancel this contract', 403)
      }

      const { data, error } = await supabase
        .from('contracts')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to cancel contract', { error, userId, contractId })
      throw error
    }
  }

  private async checkAllPartiesSigned(contractId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('contract_parties')
      .select('signed_at')
      .eq('contract_id', contractId)

    if (error) throw error
    return data.every((party) => party.signed_at !== null)
  }

  private async updateContractStatus(contractId: string, status: string) {
    const { error } = await supabase
      .from('contracts')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractId)

    if (error) throw error
  }
}

export const contractService = ContractService.getInstance() 