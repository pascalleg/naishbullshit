"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Star } from "lucide-react"
import { AnimatedElementOptimized } from "./animated-element-optimized"

interface ProfessionalCardProps {
  id: string
  name: string
  title: string
  image: string
  rating: number
  location: string
  tags: string[]
  featured?: boolean
  type: "artist" | "venue" | "sound" | "lighting" | "stage" | "technical"
}

export function ProfessionalCard({
  id,
  name,
  title,
  image,
  rating,
  location,
  tags,
  featured = false,
  type,
}: ProfessionalCardProps) {
  const [liked, setLiked] = useState(false)

  const baseUrl = type === "artist" ? "/artists" : type === "venue" ? "/venues" : `/production/${type}`

  return (
    <AnimatedElementOptimized animation="fade-in-up" duration={0.5} delay={0.1} className="h-full">
      <div
        className={`
        relative h-full rounded-xl overflow-hidden 
        bg-black/20 backdrop-blur-sm border border-white/10
        transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10
        hover:border-purple-500/30 group
        ${featured ? "ring-2 ring-purple-500/50" : ""}
      `}
      >
        {featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none px-3 py-1">
              Featured
            </Badge>
          </div>
        )}

        <div className="relative h-48 overflow-hidden">
          <Image
            src={image || `/placeholder.svg?height=192&width=384`}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-medium text-white tracking-wide">{name}</h3>
              <p className="text-sm text-white/70">{title}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-white/90">{rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-white/60 mb-3">
            <span className="inline-block">📍 {location}</span>
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="bg-white/5 text-white/80 text-xs border-white/10">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="bg-white/5 text-white/80 text-xs border-white/10">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              Save
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none"
                asChild
              >
                <Link href={`${baseUrl}/${id}`}>View</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedElementOptimized>
  )
}
