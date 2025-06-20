import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface CalendarEvent {
  id: string
  summary: string
  description: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
  }>
}

export class CalendarSyncService {
  private static instance: CalendarSyncService
  private supabase = supabase

  private constructor() {}

  static getInstance(): CalendarSyncService {
    if (!CalendarSyncService.instance) {
      CalendarSyncService.instance = new CalendarSyncService()
    }
    return CalendarSyncService.instance
  }

  async syncWithGoogleCalendar(booking: any): Promise<boolean> {
    try {
      const event: CalendarEvent = {
        id: booking.id,
        summary: `Booking at ${booking.venue_name}`,
        description: this.generateEventDescription(booking),
        start: {
          dateTime: booking.start_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: booking.end_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: booking.venue_address,
        attendees: [
          {
            email: booking.professional_email,
            displayName: booking.professional_name
          },
          {
            email: booking.venue_email,
            displayName: booking.venue_name
          }
        ]
      }

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          provider: 'google'
        }),
      })

      const { success } = await response.json()
      return success
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error)
      throw error
    }
  }

  async syncWithOutlookCalendar(booking: any): Promise<boolean> {
    try {
      const event: CalendarEvent = {
        id: booking.id,
        summary: `Booking at ${booking.venue_name}`,
        description: this.generateEventDescription(booking),
        start: {
          dateTime: booking.start_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: booking.end_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: booking.venue_address,
        attendees: [
          {
            email: booking.professional_email,
            displayName: booking.professional_name
          },
          {
            email: booking.venue_email,
            displayName: booking.venue_name
          }
        ]
      }

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          provider: 'outlook'
        }),
      })

      const { success } = await response.json()
      return success
    } catch (error) {
      console.error('Error syncing with Outlook Calendar:', error)
      throw error
    }
  }

  async syncWithAppleCalendar(booking: any): Promise<boolean> {
    try {
      const event: CalendarEvent = {
        id: booking.id,
        summary: `Booking at ${booking.venue_name}`,
        description: this.generateEventDescription(booking),
        start: {
          dateTime: booking.start_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: booking.end_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: booking.venue_address,
        attendees: [
          {
            email: booking.professional_email,
            displayName: booking.professional_name
          },
          {
            email: booking.venue_email,
            displayName: booking.venue_name
          }
        ]
      }

      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          provider: 'apple'
        }),
      })

      const { success } = await response.json()
      return success
    } catch (error) {
      console.error('Error syncing with Apple Calendar:', error)
      throw error
    }
  }

  private generateEventDescription(booking: any): string {
    return `
Booking Details:
- Venue: ${booking.venue_name}
- Attendees: ${booking.attendees}
- Status: ${booking.status}
- Payment Status: ${booking.payment_status}

${booking.notes ? `Notes: ${booking.notes}` : ''}

${booking.requirements?.length ? `Requirements:\n${booking.requirements.join('\n')}` : ''}
    `.trim()
  }

  async getConnectedCalendars(userId: string): Promise<Array<{ id: string; name: string; provider: string }>> {
    try {
      const { data, error } = await this.supabase
        .from('connected_calendars')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting connected calendars:', error)
      throw error
    }
  }

  async connectCalendar(userId: string, provider: string): Promise<boolean> {
    try {
      const response = await fetch('/api/calendar/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          provider
        }),
      })

      const { success } = await response.json()
      return success
    } catch (error) {
      console.error('Error connecting calendar:', error)
      throw error
    }
  }

  async disconnectCalendar(userId: string, calendarId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('connected_calendars')
        .delete()
        .eq('id', calendarId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error disconnecting calendar:', error)
      throw error
    }
  }
} 