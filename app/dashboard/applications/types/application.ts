export type ApplicationStatus = "pending" | "viewed" | "shortlisted" | "accepted" | "rejected"

export interface ApplicationEvent {
  date: string
  status: ApplicationStatus
  message?: string
}

export interface Application {
  id: string
  gigId: string
  gigTitle: string
  gigPoster: string
  gigImage?: string
  gigDate: string
  gigLocation: string
  gigDuration: string
  gigBudget: string
  appliedDate: string
  coverNote: string
  proposedRate: string
  status: ApplicationStatus
  timeline: ApplicationEvent[]
  messages?: {
    date: string
    sender: string
    content: string
  }[]
}
