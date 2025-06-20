import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Music, Users, Zap } from "lucide-react"
import Image from "next/image"
import type { Gig } from "@/app/find-gig/types/gig"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface GigDetailHeaderProps {
  gig: Gig
}

export function GigDetailHeader({ gig }: GigDetailHeaderProps) {
  // Function to determine badge color based on poster type
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "venue":
        return "bg-ethr-neonpurple/20 text-ethr-neonpurple border-ethr-neonpurple/30"
      case "artist":
        return "bg-ethr-neonblue/20 text-ethr-neonblue border-ethr-neonblue/30"
      case "production":
        return "bg-white/20 text-white border-white/30"
      default:
        return "bg-ethr-neonblue/20 text-ethr-neonblue border-ethr-neonblue/30"
    }
  }

  // Function to determine icon based on poster type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "venue":
        return <MapPin className="h-4 w-4 mr-1" />
      case "artist":
        return <Music className="h-4 w-4 mr-1" />
      case "production":
        return <Zap className="h-4 w-4 mr-1" />
      default:
        return <Users className="h-4 w-4 mr-1" />
    }
  }

  // Function to get the category name for breadcrumbs
  const getCategoryName = (type: string) => {
    switch (type) {
      case "venue":
        return "Venue Gigs"
      case "artist":
        return "Artist Gigs"
      case "production":
        return "Production Gigs"
      default:
        return "All Gigs"
    }
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6 text-white/60">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">HOME</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/find-gig">FIND GIG</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/find-gig?type=${gig.posterType}`}>{getCategoryName(gig.posterType)}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-white/80">{gig.title}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title and Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-light text-white">{gig.title}</h1>
        <Badge
          className={`${getBadgeClass(gig.posterType)} backdrop-blur-sm text-sm px-3 py-1.5 h-auto`}
          variant="outline"
        >
          <div className="flex items-center">
            {getTypeIcon(gig.posterType)}
            {gig.posterType.toUpperCase()} GIG
          </div>
        </Badge>
      </div>

      {/* Key Details */}
      <div className="flex flex-wrap gap-6 text-white/80 mb-8">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-ethr-neonblue" />
          <span>{gig.date}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-ethr-neonblue" />
          <span>{gig.duration}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-ethr-neonblue" />
          <span>{gig.location}</span>
        </div>
        <div className="flex items-center font-medium text-ethr-neonblue">
          <span>${gig.budget}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative w-full aspect-[21/9] overflow-hidden rounded-lg border border-white/10">
        <Image
          src={gig.image || `/placeholder.svg?height=600&width=1200&query=${gig.title}`}
          alt={gig.title}
          width={1200}
          height={600}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}
