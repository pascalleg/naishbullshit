import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { APIError } from '@/lib/api-error'

const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.enum([
    'contract_created',
    'contract_signed',
    'contract_updated',
    'contract_cancelled',
    'contract_payment_due'
  ]),
  title: z.string(),
  message: z.string(),
  data: z.record(z.unknown()),
  read: z.boolean(),
  created_at: z.string().datetime()
})

type Notification = z.infer<typeof notificationSchema>

export class ContractNotificationService {
  private static instance: ContractNotificationService

  private constructor() {}

  static getInstance(): ContractNotificationService {
    if (!ContractNotificationService.instance) {
      ContractNotificationService.instance = new ContractNotificationService()
    }
    return ContractNotificationService.instance
  }

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data: Record<string, unknown>
  ): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false
      })
      .select()
      .single()

    if (error) {
      throw new APIError('Failed to create notification', 500)
    }

    return notificationSchema.parse(notification)
  }

  async getNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new APIError('Failed to fetch notifications', 500)
    }

    return notifications.map(notification => notificationSchema.parse(notification))
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      throw new APIError('Failed to mark notification as read', 500)
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      throw new APIError('Failed to mark notifications as read', 500)
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      throw new APIError('Failed to delete notification', 500)
    }
  }

  // Contract-specific notification methods
  async notifyContractCreated(
    contractId: string,
    title: string,
    creatorId: string,
    partyIds: string[]
  ): Promise<void> {
    const message = `New contract "${title}" has been created`
    const data = { contractId, title, creatorId }

    // Notify all parties except creator
    await Promise.all(
      partyIds
        .filter(id => id !== creatorId)
        .map(id =>
          this.createNotification(
            id,
            'contract_created',
            'New Contract',
            message,
            data
          )
        )
    )
  }

  async notifyContractSigned(
    contractId: string,
    title: string,
    signerId: string,
    partyIds: string[]
  ): Promise<void> {
    const message = `Contract "${title}" has been signed`
    const data = { contractId, title, signerId }

    // Notify all parties except signer
    await Promise.all(
      partyIds
        .filter(id => id !== signerId)
        .map(id =>
          this.createNotification(
            id,
            'contract_signed',
            'Contract Signed',
            message,
            data
          )
        )
    )
  }

  async notifyContractUpdated(
    contractId: string,
    title: string,
    updaterId: string,
    partyIds: string[]
  ): Promise<void> {
    const message = `Contract "${title}" has been updated`
    const data = { contractId, title, updaterId }

    // Notify all parties except updater
    await Promise.all(
      partyIds
        .filter(id => id !== updaterId)
        .map(id =>
          this.createNotification(
            id,
            'contract_updated',
            'Contract Updated',
            message,
            data
          )
        )
    )
  }

  async notifyContractCancelled(
    contractId: string,
    title: string,
    cancellerId: string,
    partyIds: string[],
    reason: string
  ): Promise<void> {
    const message = `Contract "${title}" has been cancelled${reason ? `: ${reason}` : ''}`
    const data = { contractId, title, cancellerId, reason }

    // Notify all parties except canceller
    await Promise.all(
      partyIds
        .filter(id => id !== cancellerId)
        .map(id =>
          this.createNotification(
            id,
            'contract_cancelled',
            'Contract Cancelled',
            message,
            data
          )
        )
    )
  }

  async notifyPaymentDue(
    contractId: string,
    title: string,
    amount: number,
    currency: string,
    dueDate: string,
    partyIds: string[]
  ): Promise<void> {
    const message = `Payment of ${amount} ${currency} for contract "${title}" is due on ${new Date(dueDate).toLocaleDateString()}`
    const data = { contractId, title, amount, currency, dueDate }

    // Notify all parties
    await Promise.all(
      partyIds.map(id =>
        this.createNotification(
          id,
          'contract_payment_due',
          'Payment Due',
          message,
          data
        )
      )
    )
  }
}

export const contractNotificationService = ContractNotificationService.getInstance() 