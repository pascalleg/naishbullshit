import { useState, useEffect, useCallback } from 'react'
import { NotificationService } from '@/lib/services/notification-service'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'booking_reminder'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  created_at: string
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    try {
      const notificationService = NotificationService.getInstance()
      const [notifications, count] = await Promise.all([
        notificationService.getUserNotifications(userId),
        notificationService.getUnreadCount(userId),
      ])
      setNotifications(notifications)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const notificationService = NotificationService.getInstance()
      await notificationService.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const notificationService = NotificationService.getInstance()
      await notificationService.markAllAsRead(userId)
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }, [userId])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const notificationService = NotificationService.getInstance()
      await notificationService.deleteNotification(notificationId)
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )
      if (!notifications.find(n => n.id === notificationId)?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }, [notifications])

  useEffect(() => {
    loadNotifications()
    const notificationService = NotificationService.getInstance()

    const unsubscribe = notificationService.subscribeToNotifications(userId, (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      toast(notification.title, {
        description: notification.message,
      })
    })

    return () => {
      unsubscribe()
    }
  }, [userId, loadNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications,
  }
}