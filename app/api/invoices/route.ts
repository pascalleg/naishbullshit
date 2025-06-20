import { NextRequest } from 'next/server'
import { InvoiceService } from '@/lib/services/invoice-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

// GET /api/invoices
export async function GET(request: NextRequest) {
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

    // Get user's invoices
    const invoices = await InvoiceService.getInstance().getInvoicesByUser(user.id)

    return Response.json(invoices)
  } catch (error) {
    apiLogger.error('Failed to get invoices', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/invoices
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      throw new APIError('Booking ID is required', 400)
    }

    // Generate invoice
    const invoiceId = await InvoiceService.getInstance().generateInvoice(bookingId)

    return Response.json({ invoiceId })
  } catch (error) {
    apiLogger.error('Failed to generate invoice', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 