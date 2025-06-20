import { NextRequest } from 'next/server'
import { PaymentService } from '@/lib/services/payment-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

// GET /api/payments/methods
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

    // Get payment methods
    const paymentMethods = await PaymentService.getInstance().getPaymentMethods(user.id)

    return Response.json(paymentMethods)
  } catch (error) {
    apiLogger.error('Failed to get payment methods', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/payments/methods
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

    // Add payment method
    const paymentMethod = await PaymentService.getInstance().addPaymentMethod(user.id, body)

    return Response.json(paymentMethod)
  } catch (error) {
    apiLogger.error('Failed to add payment method', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/payments/methods/[id]
export async function PUT(
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

    // Parse request body
    const body = await request.json()

    // Update payment method
    const paymentMethod = await PaymentService.getInstance().updatePaymentMethod(
      user.id,
      params.id,
      body
    )

    return Response.json(paymentMethod)
  } catch (error) {
    apiLogger.error('Failed to update payment method', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/methods/[id]
export async function DELETE(
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

    // Delete payment method
    await PaymentService.getInstance().deletePaymentMethod(user.id, params.id)

    return new Response(null, { status: 204 })
  } catch (error) {
    apiLogger.error('Failed to delete payment method', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 