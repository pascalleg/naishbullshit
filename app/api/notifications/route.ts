import { NextRequest } from 'next/server'
import { contractNotificationService } from '@/lib/services/contract-notification-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiCache } from '@/lib/api-cache'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { AuthService } from '@/lib/auth'

// GET /api/notifications
export async function GET() {
  try {
    // Get current user
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Initialize Supabase client
    const supabase = createServerClient()

    // Fetch notifications for the user
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error in notifications route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/notifications/mark-all-read
export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Mark all notifications as read
    await contractNotificationService.markAllAsRead(user.id)

    // Invalidate cache
    const cacheRequest = new Request(`/api/notifications?${user.id}:*`)
    await apiCache.delete(cacheRequest)

    return new Response(null, { status: 204 })
  } catch (error) {
    apiLogger.error('Failed to mark notifications as read', { error })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 