import { supabase } from '@/lib/supabase'
import { APIError } from '@/lib/api-error'
import { apiLogger } from '@/lib/api-logger'
import { z } from 'zod'
import crypto from 'crypto'

// Validation schemas
const securityLogSchema = z.object({
  type: z.enum(['login', 'withdrawal', 'payment_method_change', 'suspicious_activity']),
  ip_address: z.string(),
  user_agent: z.string(),
  details: z.record(z.unknown()),
})

const fraudCheckSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  payment_method_id: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

export class PaymentSecurityService {
  private static instance: PaymentSecurityService
  private readonly MAX_WITHDRAWAL_AMOUNT = 10000 // $10,000
  private readonly MAX_DAILY_WITHDRAWAL = 50000 // $50,000
  private readonly SUSPICIOUS_IP_THRESHOLD = 3 // Number of failed attempts before flagging

  private constructor() {}

  static getInstance(): PaymentSecurityService {
    if (!PaymentSecurityService.instance) {
      PaymentSecurityService.instance = new PaymentSecurityService()
    }
    return PaymentSecurityService.instance
  }

  async logSecurityEvent(userId: string, event: z.infer<typeof securityLogSchema>) {
    try {
      const validatedData = securityLogSchema.parse(event)

      const { data, error } = await supabase
        .from('security_logs')
        .insert({
          user_id: userId,
          ...validatedData,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to log security event', { error, userId })
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid security event data', 400)
      }
      throw new APIError('Failed to log security event', 500)
    }
  }

  async checkWithdrawalLimit(userId: string, amount: number): Promise<boolean> {
    try {
      // Check single withdrawal limit
      if (amount > this.MAX_WITHDRAWAL_AMOUNT) {
        throw new APIError('Withdrawal amount exceeds maximum limit', 400)
      }

      // Check daily withdrawal limit
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'withdrawal')
        .gte('created_at', today.toISOString())

      if (error) throw error

      const dailyTotal = data.reduce((sum, tx) => sum + tx.amount, 0)
      if (dailyTotal + amount > this.MAX_DAILY_WITHDRAWAL) {
        throw new APIError('Daily withdrawal limit exceeded', 400)
      }

      return true
    } catch (error) {
      apiLogger.error('Failed to check withdrawal limit', { error, userId })
      throw error
    }
  }

  async checkSuspiciousActivity(userId: string, ipAddress: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'suspicious_activity')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (error) throw error

      // Check for multiple failed attempts from the same IP
      const failedAttempts = data.filter(
        (log) => log.ip_address === ipAddress && log.details.status === 'failed'
      )

      if (failedAttempts.length >= this.SUSPICIOUS_IP_THRESHOLD) {
        await this.logSecurityEvent(userId, {
          type: 'suspicious_activity',
          ip_address: ipAddress,
          user_agent: 'Unknown',
          details: {
            reason: 'Multiple failed attempts',
            attempts: failedAttempts.length,
          },
        })
        return true
      }

      return false
    } catch (error) {
      apiLogger.error('Failed to check suspicious activity', { error, userId })
      throw new APIError('Failed to check suspicious activity', 500)
    }
  }

  async validatePaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      if (!data) {
        throw new APIError('Payment method not found', 404)
      }

      // Check if payment method is verified
      if (!data.verified) {
        throw new APIError('Payment method not verified', 400)
      }

      return true
    } catch (error) {
      apiLogger.error('Failed to validate payment method', { error, userId })
      throw error
    }
  }

  async performFraudCheck(check: z.infer<typeof fraudCheckSchema>): Promise<boolean> {
    try {
      const validatedData = fraudCheckSchema.parse(check)

      // Implement fraud detection logic here
      // This is a simplified example - in production, you would use a more sophisticated system
      const riskScore = await this.calculateRiskScore(validatedData)

      if (riskScore > 0.8) {
        throw new APIError('Transaction flagged for review', 400)
      }

      return true
    } catch (error) {
      apiLogger.error('Failed to perform fraud check', { error })
      throw error
    }
  }

  private async calculateRiskScore(check: z.infer<typeof fraudCheckSchema>): Promise<number> {
    // This is a simplified risk scoring system
    // In production, you would use machine learning models and more sophisticated rules
    let score = 0

    // Amount-based risk
    if (check.amount > 1000) score += 0.2
    if (check.amount > 5000) score += 0.3

    // Currency-based risk
    if (check.currency !== 'USD') score += 0.1

    // Add more risk factors here

    return Math.min(score, 1)
  }

  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('two_factor_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('token', token)
        .eq('used', false)
        .single()

      if (error) throw error
      if (!data) {
        throw new APIError('Invalid or expired token', 400)
      }

      // Mark token as used
      await supabase
        .from('two_factor_codes')
        .update({ used: true })
        .eq('id', data.id)

      return true
    } catch (error) {
      apiLogger.error('Failed to verify two-factor code', { error, userId })
      throw error
    }
  }
}

export const paymentSecurityService = PaymentSecurityService.getInstance() 