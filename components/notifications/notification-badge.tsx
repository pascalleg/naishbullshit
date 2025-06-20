import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { NotificationService } from '@/lib/services/notification-service'

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadUnreadCount()
    const notificationService = NotificationService.getInstance()
    const userId = 'user-id' // Replace with actual user ID

    let unsubscribeFunc: (() => void) | undefined;

    const setupSubscription = async () => {
      unsubscribeFunc = await notificationService.subscribeToNotifications(userId, () => {
        setUnreadCount(prev => prev + 1)
      })
    }

    setupSubscription()

    return () => {
      // Ensure unsubscribeFunc is not undefined before calling
      if (unsubscribeFunc) {
        unsubscribeFunc()
      }
    }
  }, [])

  const loadUnreadCount = async () => {
    try {
      const notificationService = NotificationService.getInstance()
      const userId = 'user-id' // Replace with actual user ID
      const count = await notificationService.getUnreadCount(userId)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
          variant="destructive"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  )
}