import { NextRequest, NextResponse } from 'next/server'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { PaymentService } from '@/lib/services/payment-service'
import { APIError } from '@/lib/api-error'
import { z } from 'zod'
import { apiLogger } from '@/lib/api-logger'

const refundRequestSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive().optional(), // Optional for full refunds
  reason: z.string().min(1, 'Reason for refund is required'),
})

export async function POST(req: NextRequest) {
  try {
    await apiRateLimit.handle(req)
    const { userId } = await apiAuth.authenticateRequest(req)

    const jsonBody = await req.json()
    const { bookingId, amount, reason } = refundRequestSchema.parse(jsonBody)

    const paymentService = PaymentService.getInstance()
    const refund = await paymentService.requestRefund(userId, bookingId, amount, reason)

    return NextResponse.json({ message: 'Refund request submitted successfully', refund }, { status: 200 })
  } catch (error) {
    apiLogger.error('Error processing refund request', { error, request: req })

    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid refund request data', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
