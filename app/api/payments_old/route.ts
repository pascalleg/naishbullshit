import { NextRequest } from 'next/server'
import { PaymentService } from '@/lib/services/payment-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

// GET /api/payments
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    // Get transactions
    const transactions = await PaymentService.getInstance().getTransactions(user.id, {
      type: type || undefined,
      status: status || undefined,
    })

    return Response.json(transactions)
  } catch (error) {
    apiLogger.error('Failed to get transactions', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/payments/withdraw
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

    // Create withdrawal
    const withdrawal = await PaymentService.getInstance().createWithdrawal(user.id, body)

    return Response.json(withdrawal)
  } catch (error) {
    apiLogger.error('Failed to create withdrawal', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 