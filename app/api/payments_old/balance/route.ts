import { NextRequest } from 'next/server'
import { PaymentService } from '@/lib/services/payment-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

// GET /api/payments/balance
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

    // Get balance
    const balance = await PaymentService.getInstance().getBalance(user.id)

    return Response.json(balance)
  } catch (error) {
    apiLogger.error('Failed to get balance', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 