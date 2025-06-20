export interface Gig {
  id: string
  title: string
  description: string
  image?: string
  date: string
  duration: string
  location: string
  budget: string | number
  posterType: "venue" | "artist" | "production"
  posterName: string
  posterAvatar?: string
  requirements?: string[]
  tags?: string[]
}
