import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Bell, MessageSquare, CreditCard, TrendingUp } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { AnimatedText } from '@/components/animated-text'
import { AnimatedButton } from '@/components/animated-button'

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <ScrollReveal animation="fade">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <AnimatedText text="Welcome back!" tag="h2" animation="fade" className="text-2xl font-bold" />
            <p className="text-muted-foreground">Here's what's happening with your account today.</p>
          </div>
          <AnimatedButton variant="gradient" className="rounded-full" hover="lift" ripple={true}>
            <Bell className="mr-2 h-4 w-4" /> View Notifications
          </AnimatedButton>
        </div>
      </ScrollReveal>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Bookings",
            value: "12",
            description: "+2 from last month",
            icon: <Calendar className="h-5 w-5 text-ethr-neonblue" />,
            delay: 100,
          },
          {
            title: "Pending Requests",
            value: "4",
            description: "3 require action",
            icon: <Bell className="h-5 w-5 text-ethr-neonpurple" />,
            delay: 200,
          },
          {
            title: "Unread Messages",
            value: "8",
            description: "5 new conversations",
            icon: <MessageSquare className="h-5 w-5 text-ethr-neonblue" />,
            delay: 300,
          },
          {
            title: "Total Earnings",
            value: "$4,550",
            description: "+12% from last month",
            icon: <CreditCard className="h-5 w-5 text-ethr-neonpurple" />,
            delay: 400,
          },
        ].map((item, index) => (
          <ScrollReveal key={index} animation="slide-up" delay={item.delay}>
            <Card className="bg-ethr-darkgray/50 border-muted hover:border-ethr-neonblue/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="p-2 rounded-full bg-ethr-black/50">{item.icon}</div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal animation="slide-up" delay={500}>
        <Card className="bg-ethr-darkgray/50 border-muted">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <p className="text-sm text-muted-foreground">Your profile views and engagement over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-ethr-neonblue/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  )
} 