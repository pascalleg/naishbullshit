import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'
import { apiAuth } from '@/lib/api-auth'
import { format } from 'date-fns'
import PDFDocument from 'pdfkit'

export async function POST(req: Request) {
  try {
    // Authenticate request
    const user = await apiAuth.authenticateRequest(req)
    if (!user) {
      throw new APIError('Unauthorized', 401)
    }

    // Parse request body
    const body = await req.json()
    const { booking_id } = body

    // Validate required fields
    if (!booking_id) {
      throw new APIError('Missing booking ID', 400)
    }

    // Get booking details
    const supabase = createServerClient()
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        venues (
          name,
          address,
          email
        ),
        profiles:professionals (
          name,
          email:email
        )
      `)
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      throw new APIError('Booking not found', 404)
    }

    // Generate invoice
    const invoice = {
      id: `INV-${booking.id}`,
      booking_id: booking.id,
      amount: booking.total_price,
      currency: 'usd',
      status: 'paid',
      due_date: format(new Date(booking.start_time), 'yyyy-MM-dd'),
      items: [
        {
          description: `Venue booking at ${booking.venues.name}`,
          amount: booking.total_price,
          quantity: 1
        }
      ],
      customer: {
        name: booking.profiles?.name || 'N/A',
        email: booking.profiles?.email || 'N/A'
      },
      venue: {
        name: booking.venues.name,
        address: booking.venues.address
      }
    }

    // Store invoice in database
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert(invoice)

    if (invoiceError) {
      throw new APIError('Failed to store invoice', 500)
    }

    // Generate PDF
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => {})

    // Add invoice header
    doc.fontSize(20).text('INVOICE', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Invoice Number: ${invoice.id}`)
    doc.text(`Date: ${format(new Date(), 'MMMM d, yyyy')}`)
    doc.text(`Due Date: ${format(new Date(invoice.due_date), 'MMMM d, yyyy')}`)
    doc.moveDown()

    // Add customer and venue details
    doc.text('Bill To:')
    doc.text(invoice.customer.name)
    doc.text(invoice.customer.email)
    doc.moveDown()

    doc.text('Venue:')
    doc.text(invoice.venue.name)
    doc.text(invoice.venue.address)
    doc.moveDown()

    // Add items table
    doc.text('Items:', { underline: true })
    doc.moveDown()

    // Table header
    doc.text('Description', 50, doc.y)
    doc.text('Quantity', 300, doc.y)
    doc.text('Amount', 400, doc.y)
    doc.moveDown()

    // Table rows
    invoice.items.forEach((item) => {
      doc.text(item.description, 50, doc.y)
      doc.text(item.quantity.toString(), 300, doc.y)
      doc.text(
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: invoice.currency
        }).format(item.amount),
        400,
        doc.y
      )
      doc.moveDown()
    })

    // Add total
    doc.moveDown()
    doc.text(
      'Total: ' +
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: invoice.currency
        }).format(invoice.amount),
      { align: 'right' }
    )

    // Finalize PDF
    doc.end()

    // Convert chunks to buffer
    const pdfBuffer = Buffer.concat(chunks)

    // Store PDF in database
    const { error: pdfError } = await supabase
      .from('invoice_pdfs')
      .insert({
        invoice_id: invoice.id,
        pdf_data: pdfBuffer.toString('base64')
      })

    if (pdfError) {
      throw new APIError('Failed to store invoice PDF', 500)
    }

    // Log successful invoice generation
    apiLogger.info('Invoice generated successfully', {
      invoice_id: invoice.id,
      booking_id
    })

    return NextResponse.json({
      success: true,
      invoice_id: invoice.id
    })
  } catch (error) {
    apiLogger.error('Error generating invoice:', error)
    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
} 