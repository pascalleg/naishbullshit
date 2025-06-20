import { NextRequest } from 'next/server'
import { PaymentService } from '@/lib/services/payment-service'
import { paymentSecurityService } from '@/lib/services/payment-security-service'
import { paymentNotificationService } from '@/lib/services/payment-notification-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'
import { z } from 'zod'

const withdrawSchema = z.object({
  amount: z.number().positive(),
  payment_method_id: z.string().uuid(),
  two_factor_code: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    await apiRateLimit.handle(request)

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Parse and validate request body
    const body = await request.json()
    const validatedData = withdrawSchema.parse(body)

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check for suspicious activity
    const isSuspicious = await paymentSecurityService.checkSuspiciousActivity(
      user.id,
      ipAddress
    )
    if (isSuspicious) {
      throw new APIError('Suspicious activity detected', 403)
    }

    // Check withdrawal limits
    await paymentSecurityService.checkWithdrawalLimit(user.id, validatedData.amount)

    // Validate payment method
    await paymentSecurityService.validatePaymentMethod(
      user.id,
      validatedData.payment_method_id
    )

    // Perform fraud check
    await paymentSecurityService.performFraudCheck({
      amount: validatedData.amount,
      currency: 'USD',
      payment_method_id: validatedData.payment_method_id,
      metadata: {
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    })

    // If two-factor is required (for large amounts)
    if (validatedData.amount > 1000) {
      if (!validatedData.two_factor_code) {
        throw new APIError('Two-factor authentication required', 403)
      }

      const isValidTwoFactor = await paymentSecurityService.verifyTwoFactor(
        user.id,
        validatedData.two_factor_code
      )
      if (!isValidTwoFactor) {
        throw new APIError('Invalid two-factor code', 403)
      }
    }

    // Process withdrawal
    const withdrawal = await PaymentService.getInstance().createWithdrawal(
      user.id,
      {
        amount: validatedData.amount,
        paymentMethodId: validatedData.payment_method_id,
      }
    )

    // Log security event
    await paymentSecurityService.logSecurityEvent(user.id, {
      type: 'withdrawal',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {
        amount: validatedData.amount,
        payment_method_id: validatedData.payment_method_id,
        withdrawal_id: withdrawal.id,
      },
    })

    // Create notification
    await paymentNotificationService.createNotification(user.id, {
      type: 'withdrawal_completed',
      title: 'Withdrawal Processed',
      message: `Your withdrawal of $${validatedData.amount} has been processed successfully.`,
      metadata: {
        withdrawal_id: withdrawal.id,
        amount: validatedData.amount,
      },
    })

    // Invalidate cache
    const requestUrl = new URL(request.url)
    await apiCache.delete(new Request(`${requestUrl.origin}/balance:${user.id}`))
    await apiCache.delete(new Request(`${requestUrl.origin}/transactions:${user.id}`))

    return Response.json(withdrawal)
  } catch (error) {
    apiLogger.error('Failed to process withdrawal', { error })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 