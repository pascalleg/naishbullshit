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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Mark notification as read
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .match({
        id: params.id,
        user_id: user.id
      })

    if (error) {
      console.error('Error marking notification as read:', error)
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in mark as read route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 