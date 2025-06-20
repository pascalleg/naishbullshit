import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Music, Users, FileText } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  date: string
  location: string
  type: 'contract' | 'gig' | 'meeting'
}

export function DashboardCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Fetch upcoming contracts
        const { data: contracts } = await supabase
          .from('contracts')
          .select('id, title, start_date, venue_name')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(5)

        // Fetch upcoming gigs
        const { data: gigs } = await supabase
          .from('gigs')
          .select('id, title, date, venue_name')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(5)

        // Combine and format events
        const formattedEvents = [
          ...(contracts?.map(contract => ({
            id: contract.id,
            title: contract.title,
            date: contract.start_date,
            location: contract.venue_name,
            type: 'contract' as const
          })) || []),
          ...(gigs?.map(gig => ({
            id: gig.id,
            title: gig.title,
            date: gig.date,
            location: gig.venue_name,
            type: 'gig' as const
          })) || [])
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setEvents(formattedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-5 w-5 text-ethr-neonblue" />
      case 'gig':
        return <Music className="h-5 w-5 text-ethr-neonpurple" />
      case 'meeting':
        return <Users className="h-5 w-5 text-ethr-neonblue" />
    }
  }

  return (
    <Card className="bg-ethr-darkgray/50 border-muted">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <p className="text-sm text-muted-foreground">Your scheduled events and contracts</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethr-neonblue" />
            </div>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <ScrollReveal key={event.id} animation="slide-up" delay={index * 100}>
                <div className="flex items-center p-3 rounded-lg bg-ethr-black/50 hover:bg-ethr-black transition-colors">
                  <div className="w-10 h-10 rounded-full bg-ethr-neonblue/10 flex items-center justify-center mr-3">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-ethr-neonblue/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming events found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 