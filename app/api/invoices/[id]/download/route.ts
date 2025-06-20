import { NextRequest } from 'next/server'
import { InvoiceService } from '@/lib/services/invoice-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'
import { createServerClient } from '@/lib/supabase'

// GET /api/invoices/[id]/download
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const rateLimitResponse = await apiRateLimit.handle(request as unknown as Request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authentication
    const user = await apiAuth.authenticateRequest(request as unknown as Request)
    if (!user) {
      throw APIError.unauthorized()
    }

    // Get invoice
    const invoice = await InvoiceService.getInstance().getInvoice(params.id)

    // Check if user has access to this invoice
    if (invoice.user_id !== user.id) {
      throw APIError.forbidden()
    }

    // Get PDF from storage
    const supabase = createServerClient()
    const { data, error } = await supabase
      .storage
      .from('invoices')
      .download(`${params.id}.pdf`)

    if (error) throw error

    // Log successful download
    apiLogger.info('Invoice PDF downloaded', {
      invoice_id: params.id,
      user_id: user.id
    })

    // Return PDF
    return new Response(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${params.id}.pdf"`,
      },
    })
  } catch (error) {
    apiLogger.error('Failed to download invoice', { error, invoiceId: params.id })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}