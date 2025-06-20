"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

interface VenueGalleryProps {
  images: {
    src: string
    alt: string
  }[]
}

export function VenueGallery({ images }: VenueGalleryProps) {
  const [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main image */}
        <div
          className="md:col-span-2 aspect-video relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <ScrollReveal animation="fade-in">
            <Image
              src={images[0].src || "/placeholder.svg"}
              alt={images[0].alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </ScrollReveal>
        </div>

        {/* Thumbnail grid */}
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <ScrollReveal key={index} animation="fade-in" delay={index * 0.1}>
              <div
                className="aspect-square relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  setCurrentImage(index + 1)
                  setOpen(true)
                }}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-ethr-black border-white/10 p-0">
          <div className="relative h-[80vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={images[currentImage].src || "/placeholder.svg"}
                alt={images[currentImage].alt}
                fill
                className="object-contain"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          <ScrollArea className="h-20 bg-ethr-black border-t border-white/10">
            <div className="flex gap-2 p-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-16 w-24 rounded overflow-hidden cursor-pointer transition-all ${
                    currentImage === index ? "ring-2 ring-ethr-neonblue" : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
