import { supabase } from '@/lib/supabase'
import { APIError } from '@/lib/api-error'
import { apiLogger } from '@/lib/api-logger'
import { format } from 'date-fns'
import PDFDocument from 'pdfkit'
import { z } from 'zod'

const invoiceSchema = z.object({
  booking_id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  items: z.array(z.object({
    description: z.string(),
    amount: z.number().positive(),
    quantity: z.number().positive(),
  })),
  due_date: z.string().datetime(),
  status: z.enum(['draft', 'pending', 'paid', 'overdue', 'cancelled']),
})

export class InvoiceService {
  private static instance: InvoiceService
  private supabase = supabase

  private constructor() {}

  static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService()
    }
    return InvoiceService.instance
  }

  async generateInvoice(bookingId: string): Promise<string> {
    try {
      // Get booking details
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select(`
          *,
          users (
            email,
            full_name
          ),
          venues (
            name,
            address
          )
        `)
        .eq('id', bookingId)
        .single()

      if (bookingError) throw bookingError

      // Create invoice record
      const invoiceData = {
        booking_id: bookingId,
        user_id: booking.user_id,
        amount: booking.total_amount,
        currency: booking.currency || 'USD',
        items: [
          {
            description: `Booking at ${booking.venues.name}`,
            amount: booking.total_amount,
            quantity: 1,
          },
        ],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: 'pending',
      }

      const validatedData = invoiceSchema.parse(invoiceData)

      const { data: invoice, error: invoiceError } = await this.supabase
        .from('invoices')
        .insert(validatedData)
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Generate PDF
      const pdfBuffer = await this.generatePDF(invoice, booking)

      // Upload PDF to storage
      const { error: uploadError } = await this.supabase
        .storage
        .from('invoices')
        .upload(`${invoice.id}.pdf`, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Send email notification
      await this.sendInvoiceEmail(invoice, booking)

      return invoice.id
    } catch (error) {
      apiLogger.error('Failed to generate invoice', { error, bookingId })
      throw new APIError('Failed to generate invoice', 500)
    }
  }

  private async generatePDF(invoice: any, booking: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument()
        const chunks: Buffer[] = []

        doc.on('data', (chunk) => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))

        // Add company logo
        // doc.image('path/to/logo.png', 50, 50, { width: 100 })

        // Add invoice header
        doc.fontSize(20).text('INVOICE', { align: 'center' })
        doc.moveDown()

        // Add invoice details
        doc.fontSize(12)
        doc.text(`Invoice #: ${invoice.id}`)
        doc.text(`Date: ${format(new Date(invoice.created_at), 'PPP')}`)
        doc.text(`Due Date: ${format(new Date(invoice.due_date), 'PPP')}`)
        doc.moveDown()

        // Add customer details
        doc.text('Bill To:')
        doc.text(booking.users.full_name)
        doc.text(booking.users.email)
        doc.moveDown()

        // Add venue details
        doc.text('Venue:')
        doc.text(booking.venues.name)
        doc.text(booking.venues.address)
        doc.moveDown()

        // Add items table
        doc.text('Items:', { underline: true })
        doc.moveDown()

        // Table header
        doc.text('Description', 50, doc.y)
        doc.text('Amount', 400, doc.y)
        doc.moveDown()

        // Table rows
        invoice.items.forEach((item: any) => {
          doc.text(item.description, 50, doc.y)
          doc.text(
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: invoice.currency,
            }).format(item.amount),
            400,
            doc.y
          )
          doc.moveDown()
        })

        // Add total
        doc.text(
          'Total: ' +
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: invoice.currency,
            }).format(invoice.amount),
          { align: 'right' }
        )

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  private async sendInvoiceEmail(invoice: any, booking: any): Promise<void> {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: booking.users.email,
          subject: `Invoice for your booking at ${booking.venues.name}`,
          template: 'invoice',
          data: {
            invoice,
            booking,
            downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/invoices/${invoice.id}/download`,
          },
        }),
      })
    } catch (error) {
      apiLogger.error('Failed to send invoice email', { error, invoiceId: invoice.id })
      // Don't throw error as email sending is not critical
    }
  }

  async getInvoice(invoiceId: string) {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get invoice', { error, invoiceId })
      throw new APIError('Failed to get invoice', 500)
    }
  }

  async getInvoicesByUser(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get user invoices', { error, userId })
      throw new APIError('Failed to get user invoices', 500)
    }
  }

  async updateInvoiceStatus(invoiceId: string, status: 'paid' | 'overdue' | 'cancelled') {
    try {
      const { error } = await this.supabase
        .from('invoices')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoiceId)

      if (error) throw error
    } catch (error) {
      apiLogger.error('Failed to update invoice status', { error, invoiceId })
      throw new APIError('Failed to update invoice status', 500)
    }
  }
} 