import { supabase } from '@/lib/supabase'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'
import { APIError } from '@/lib/api-error'
import { apiLogger } from '@/lib/api-logger'
import { z } from 'zod'
import { format } from 'date-fns'

// Validation schemas
const paymentMethodSchema = z.object({
  type: z.enum(['card', 'bank_account']),
  last4: z.string().length(4),
  brand: z.string().optional(),
  expMonth: z.number().min(1).max(12).optional(),
  expYear: z.number().min(new Date().getFullYear()).optional(),
  bankName: z.string().optional(),
  isDefault: z.boolean().default(false),
})

const withdrawalSchema = z.object({
  amount: z.number().positive(),
  paymentMethodId: z.string().uuid(),
  description: z.string().optional(),
})

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  description: z.string(),
  metadata: z.record(z.any()).optional(),
})

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

interface Invoice {
  id: string
  booking_id: string
  amount: number
  currency: string
  status: string
  due_date: string
  items: Array<{
    description: string
    amount: number
    quantity: number
  }>
  customer: {
    name: string
    email: string
  }
  venue: {
    name: string
    address: string
  }
}

export class PaymentService {
  private static instance: PaymentService
  private supabase = supabase // Corrected: use the exported supabase instance
  private stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async getPaymentMethods(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get payment methods', { error, userId })
      throw new APIError('Failed to get payment methods', 500)
    }
  }

  async addPaymentMethod(userId: string, paymentMethod: z.infer<typeof paymentMethodSchema>) {
    try {
      const validatedData = paymentMethodSchema.parse(paymentMethod)

      // If this is the first payment method or marked as default, update other methods
      if (validatedData.isDefault) {
        await this.supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId)
      }

      const { data, error } = await this.supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          ...validatedData,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to add payment method', { error, userId })
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid payment method data', 400)
      }
      throw new APIError('Failed to add payment method', 500)
    }
  }

  async updatePaymentMethod(
    userId: string,
    paymentMethodId: string,
    updates: Partial<z.infer<typeof paymentMethodSchema>>
  ) {
    try {
      const validatedData = paymentMethodSchema.partial().parse(updates)

      // If setting as default, update other methods
      if (validatedData.isDefault) {
        await this.supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId)
      }

      const { data, error } = await this.supabase
        .from('payment_methods')
        .update(validatedData)
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to update payment method', { error, userId, paymentMethodId })
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid payment method data', 400)
      }
      throw new APIError('Failed to update payment method', 500)
    }
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string) {
    try {
      const { error } = await this.supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      apiLogger.error('Failed to delete payment method', { error, userId, paymentMethodId })
      throw new APIError('Failed to delete payment method', 500)
    }
  }

  async getTransactions(userId: string, filters?: { type?: string; status?: string }) {
    try {
      let query = this.supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get transactions', { error, userId })
      throw new APIError('Failed to get transactions', 500)
    }
  }

  async createWithdrawal(userId: string, withdrawal: z.infer<typeof withdrawalSchema>) {
    try {
      const validatedData = withdrawalSchema.parse(withdrawal)

      // Check if user has sufficient balance
      const { data: balance } = await this.supabase
        .from('balances')
        .select('available_balance')
        .eq('user_id', userId)
        .single()

      if (!balance || balance.available_balance < validatedData.amount) {
        throw new APIError('Insufficient balance', 400)
      }

      const { data, error } = await this.supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'withdrawal',
          amount: validatedData.amount,
          status: 'pending',
          payment_method_id: validatedData.paymentMethodId,
          description: validatedData.description,
        })
        .select()
        .single()

      if (error) throw error

      // Update available balance
      await this.supabase
        .from('balances')
        .update({
          available_balance: balance.available_balance - validatedData.amount,
          pending_balance: balance.pending_balance + validatedData.amount,
        })
        .eq('user_id', userId)

      return data
    } catch (error) {
      apiLogger.error('Failed to create withdrawal', { error, userId })
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid withdrawal data', 400)
      }
      throw error
    }
  }

  async getBalance(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('balances')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get balance', { error, userId })
      throw new APIError('Failed to get balance', 500)
    }
  }

  async getUpcomingPayments(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get upcoming payments', { error, userId })
      throw new APIError('Failed to get upcoming payments', 500)
    }
  }

  async createPaymentIntent(booking: any): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: booking.id,
          amount: booking.total_price,
          currency: 'usd',
          metadata: {
            booking_id: booking.id,
            venue_id: booking.venue_id,
            professional_id: booking.professional_id
          }
        }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw error
    }
  }

  async processPayment(paymentIntentId: string, bookingId: string): Promise<boolean> {
    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new APIError('Stripe not loaded', 500)
      }

      const { error: submitError } = await stripe.confirmPayment({
        elements: {} as any, // This might need a proper Elements type if used with Stripe Elements
        clientSecret: paymentIntentId,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/bookings/${bookingId}`,
        },
      })

      if (submitError) {
        throw new APIError(submitError.message || 'Payment submission failed', 400)
      }

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, bookingId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new APIError(errorData.message || 'Payment processing failed on server', response.status)
      }

      toast.success('Payment successful!')
      return true
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Payment failed: ' + (error instanceof APIError ? error.message : 'Unknown error'))
      return false
    }
  }

  async generateInvoice(booking: any): Promise<Invoice> {
    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new APIError(errorData.message || 'Failed to generate invoice', response.status)
      }

      const data = await response.json()
      return data as Invoice
    } catch (error) {
      console.error('Error generating invoice:', error)
      throw error
    }
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (error) throw error
      return data as Invoice
    } catch (error) {
      apiLogger.error('Failed to get invoice', { error, invoiceId })
      throw new APIError('Failed to get invoice', 500)
    }
  }

  async getBookingInvoices(bookingId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .eq('booking_id', bookingId)

      if (error) throw error
      return data as Invoice[]
    } catch (error) {
      apiLogger.error('Failed to get booking invoices', { error, bookingId })
      throw new APIError('Failed to get booking invoices', 500)
    }
  }

  async updateBookingPaymentStatus(bookingId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bookings')
        .update({ payment_status: status })
        .eq('id', bookingId)

      if (error) throw error
    } catch (error) {
      apiLogger.error('Failed to update booking payment status', { error, bookingId, status })
      throw new APIError('Failed to update booking payment status', 500)
    }
  }

  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('transactions')
        .select('*, payment_methods(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get payment history', { error, userId })
      throw new APIError('Failed to get payment history', 500)
    }
  }

  private async sendPaymentConfirmation(booking: any): Promise<void> {
    // In a real application, this would send an email or in-app notification
    console.log(`Sending payment confirmation for booking ${booking.id}`)
    // Example: send email via a transactional email service
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     to: booking.user_email,
    //     subject: 'Payment Confirmation',
    //     template: 'payment_confirmation',
    //     data: booking,
    //   }),
    // });
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, amount }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new APIError(errorData.message || 'Refund failed on server', response.status)
      }

      toast.success('Refund processed successfully')
      return true
    } catch (error) {
      console.error('Error refunding payment:', error)
      toast.error('Refund failed: ' + (error instanceof APIError ? error.message : 'Unknown error'))
      return false
    }
  }

  async updatePaymentStatus(
    bookingId: string,
    status: 'completed' | 'failed' | 'refunded',
    paymentIntentId: string
  ) {
    try {
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('user_id, amount')
        .eq('id', bookingId)
        .single()

      if (bookingError) throw bookingError

      // Update booking payment status
      const { error: updateError } = await this.supabase
        .from('bookings')
        .update({
          payment_status: status,
          payment_intent_id: paymentIntentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (updateError) throw updateError

      // Create transaction record
      const { error: transactionError } = await this.supabase
        .from('transactions')
        .insert({
          user_id: booking.user_id,
          booking_id: bookingId,
          type: 'payment',
          amount: booking.amount,
          status: status,
          payment_intent_id: paymentIntentId,
          metadata: {
            status,
            payment_intent_id: paymentIntentId,
          },
        })

      if (transactionError) throw transactionError

      // Update user balance if payment is completed
      if (status === 'completed') {
        const { error: balanceError } = await this.supabase
          .from('balances')
          .update({
            available_balance: this.supabase.raw('available_balance + ?', [booking.amount]),
            total_earnings: this.supabase.raw('total_earnings + ?', [booking.amount]),
          })
          .eq('user_id', booking.user_id)

        if (balanceError) throw balanceError
      }
    } catch (error) {
      apiLogger.error('Failed to update payment status', { error, bookingId, status })
      throw new APIError('Failed to update payment status', 500)
    }
  }

  async processRefund(
    bookingId: string,
    amount: number,
    chargeId: string
  ) {
    try {
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('user_id, amount')
        .eq('id', bookingId)
        .single()

      if (bookingError) throw bookingError

      // Update booking payment status
      const { error: updateError } = await this.supabase
        .from('bookings')
        .update({
          payment_status: 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (updateError) throw updateError

      // Create refund transaction record
      const { error: transactionError } = await this.supabase
        .from('transactions')
        .insert({
          user_id: booking.user_id,
          booking_id: bookingId,
          type: 'refund',
          amount: amount,
          status: 'completed',
          charge_id: chargeId,
          metadata: {
            charge_id: chargeId,
            original_amount: booking.amount,
          },
        })

      if (transactionError) throw transactionError

      // Update user balance
      const { error: balanceError } = await this.supabase
        .from('balances')
        .update({
          available_balance: this.supabase.raw('available_balance - ?', [amount]),
          total_earnings: this.supabase.raw('total_earnings - ?', [amount]),
        })
        .eq('user_id', booking.user_id)

      if (balanceError) throw balanceError
    } catch (error) {
      apiLogger.error('Failed to process refund', { error, bookingId, amount })
      throw new APIError('Failed to process refund', 500)
    }
  }

  async handleDispute(
    bookingId: string,
    disputeId: string,
    status: string
  ) {
    try {
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('user_id, amount')
        .eq('id', bookingId)
        .single()

      if (bookingError) throw bookingError

      // Update booking with dispute information
      const { error: updateError } = await this.supabase
        .from('bookings')
        .update({
          payment_status: 'disputed',
          dispute_id: disputeId,
          dispute_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (updateError) throw updateError

      // Create dispute record
      const { error: disputeError } = await this.supabase
        .from('disputes')
        .insert({
          booking_id: bookingId,
          user_id: booking.user_id,
          dispute_id: disputeId,
          status: status,
          amount: booking.amount,
          created_at: new Date().toISOString(),
        })

      if (disputeError) throw disputeError

      // Update user balance to hold disputed amount
      const { error: balanceError } = await this.supabase
        .from('balances')
        .update({
          available_balance: this.supabase.raw('available_balance - ?', [booking.amount]),
          disputed_balance: this.supabase.raw('disputed_balance + ?', [booking.amount]),
        })
        .eq('user_id', booking.user_id)

      if (balanceError) throw balanceError
    } catch (error) {
      apiLogger.error('Failed to handle dispute', { error, bookingId, disputeId })
      throw new APIError('Failed to handle dispute', 500)
    }
  }
}