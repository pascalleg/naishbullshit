import { supabase } from '@/lib/supabase'
import { APIError } from '@/lib/api-error'
import { apiLogger } from '@/lib/api-logger'
import { z } from 'zod'

// Validation schemas
const notificationSchema = z.object({
  type: z.enum(['payment_received', 'withdrawal_completed', 'payment_failed', 'withdrawal_failed']),
  title: z.string(),
  message: z.string(),
  metadata: z.record(z.unknown()).optional(),
})

export class PaymentNotificationService {
  private static instance: PaymentNotificationService

  private constructor() {}

  static getInstance(): PaymentNotificationService {
    if (!PaymentNotificationService.instance) {
      PaymentNotificationService.instance = new PaymentNotificationService()
    }
    return PaymentNotificationService.instance
  }

  async createNotification(userId: string, notification: z.infer<typeof notificationSchema>) {
    try {
      const validatedData = notificationSchema.parse(notification)

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          ...validatedData,
          read: false,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to create notification', { error, userId })
      if (error instanceof z.ZodError) {
        throw new APIError('Invalid notification data', 400)
      }
      throw new APIError('Failed to create notification', 500)
    }
  }

  async getNotifications(userId: string, options?: { unreadOnly?: boolean }) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (options?.unreadOnly) {
        query = query.eq('read', false)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to get notifications', { error, userId })
      throw new APIError('Failed to get notifications', 500)
    }
  }

  async markAsRead(userId: string, notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      apiLogger.error('Failed to mark notification as read', { error, userId, notificationId })
      throw new APIError('Failed to mark notification as read', 500)
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
    } catch (error) {
      apiLogger.error('Failed to mark all notifications as read', { error, userId })
      throw new APIError('Failed to mark all notifications as read', 500)
    }
  }

  async deleteNotification(userId: string, notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      apiLogger.error('Failed to delete notification', { error, userId, notificationId })
      throw new APIError('Failed to delete notification', 500)
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return count || 0
    } catch (error) {
      apiLogger.error('Failed to get unread notification count', { error, userId })
      throw new APIError('Failed to get unread notification count', 500)
    }
  }
}

export const paymentNotificationService = PaymentNotificationService.getInstance() 