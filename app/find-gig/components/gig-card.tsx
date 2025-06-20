"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Music, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Gig } from "../types/gig"
import { AnimatedButton } from "@/components/animated-button"

interface GigCardProps {
  gig: Gig
}

export function GigCard({ gig }: GigCardProps) {
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

  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm hover:border-ethr-neonblue/30 transition-all duration-300 hover-lift">
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={gig.image || `/placeholder.svg?height=300&width=500&query=${gig.title}`}
            alt={gig.title}
            width={500}
            height={300}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          />
        </div>
        <Badge className={`absolute top-4 left-4 ${getBadgeClass(gig.posterType)} backdrop-blur-sm`} variant="outline">
          <div className="flex items-center">
            {getTypeIcon(gig.posterType)}
            {gig.posterType.toUpperCase()}
          </div>
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-light text-white">{gig.title}</h3>
          <Badge variant="outline" className="bg-ethr-neonblue/10 text-ethr-neonblue border-ethr-neonblue/30">
            ${gig.budget}
          </Badge>
        </div>

        <p className="text-white/70 mb-4 line-clamp-2">{gig.description}</p>

        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-ethr-neonblue" />
            {gig.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-ethr-neonblue" />
            {gig.duration}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-ethr-neonblue" />
            {gig.location}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              src={gig.posterAvatar || `/placeholder.svg?height=32&width=32&query=avatar`}
              alt={gig.posterName}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="text-white/80">{gig.posterName}</span>
        </div>

        <Link href={`/gig/${gig.id}`}>
          <AnimatedButton
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/5 hover:border-ethr-neonblue/50"
            hover="lift"
            ripple={false}
          >
            VIEW
          </AnimatedButton>
        </Link>
      </CardFooter>
    </Card>
  )
}
