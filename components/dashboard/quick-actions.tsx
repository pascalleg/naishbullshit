import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, FileText, MessageSquare, Settings } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import Link from 'next/link'

export function QuickActions() {
  const actions = [
    {
      title: 'Create Contract',
      description: 'Draft a new contract',
      icon: <FileText className="h-5 w-5" />,
      href: '/dashboard/contracts/new',
      color: 'text-ethr-neonblue',
    },
    {
      title: 'Schedule Event',
      description: 'Add to your calendar',
      icon: <Calendar className="h-5 w-5" />,
      href: '/dashboard/calendar',
      color: 'text-ethr-neonpurple',
    },
    {
      title: 'New Message',
      description: 'Start a conversation',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/dashboard/messages',
      color: 'text-ethr-neonblue',
    },
    {
      title: 'Settings',
      description: 'Update your preferences',
      icon: <Settings className="h-5 w-5" />,
      href: '/dashboard/settings',
      color: 'text-ethr-neonpurple',
    },
  ]

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {actions.map((action, index) => (
            <ScrollReveal key={index} animation="slide-up" delay={index * 100}>
              <Link href={action.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto hover:bg-ethr-black/50"
                >
                  <div className={`p-2 rounded-full bg-ethr-black/50 mr-4 ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 