import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, MessageSquare, FileText, Users } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Notification = {
  id: string
  type: 'message' | 'contract' | 'connection' | 'system'
  title: string
  message: string
  created_at: string
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data: notifications } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (notifications) {
          setNotifications(notifications)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-ethr-neonblue" />
      case 'contract':
        return <FileText className="h-5 w-5 text-ethr-neonpurple" />
      case 'connection':
        return <Users className="h-5 w-5 text-ethr-neonblue" />
      case 'system':
        return <Bell className="h-5 w-5 text-ethr-neonpurple" />
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <p className="text-sm text-muted-foreground">Your recent activity and updates</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethr-neonblue" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <ScrollReveal key={notification.id} animation="slide-up" delay={index * 100}>
                <div
                  className={`flex items-start p-3 rounded-lg ${
                    notification.read ? 'bg-ethr-black/50' : 'bg-ethr-black'
                  } hover:bg-ethr-black transition-colors`}
                >
                  <div className="w-8 h-8 rounded-full bg-ethr-neonblue/10 flex items-center justify-center mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium truncate">{notification.title}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-ethr-neonblue/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 