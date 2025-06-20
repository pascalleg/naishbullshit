import { NextRequest } from 'next/server'
import { contractNotificationService } from '@/lib/services/contract-notification-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiCache } from '@/lib/api-cache'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Delete notification
    await contractNotificationService.deleteNotification(params.id, user.id)

    // Invalidate cache
    const cacheRequest = new Request(`/api/notifications?${user.id}:*`)
    await apiCache.delete(cacheRequest)

    return new Response(null, { status: 204 })
  } catch (error) {
    apiLogger.error('Failed to delete notification', { error, notificationId: params.id })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 