"use client"

import type React from "react"

import { useState } from "react"
import { StepNavigation } from "../components/step-navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, ImageIcon, Video, Upload, X } from "lucide-react"
import Image from "next/image"

export default function OnboardingPortfolio() {
  const [activeTab, setActiveTab] = useState("photos")
  const [photos, setPhotos] = useState<string[]>([])
  const [audio, setAudio] = useState<{ name: string; duration: string }[]>([])
  const [videos, setVideos] = useState<{ thumbnail: string; title: string }[]>([])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos: string[] = []

      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newPhotos.push(e.target?.result as string)
            if (newPhotos.length === files.length) {
              setPhotos((prev) => [...prev, ...newPhotos])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleAudioUpload = () => {
    // In a real app, this would handle actual file uploads
    // For now, we'll simulate adding audio files
    setAudio((prev) => [...prev, { name: `Summer Mix ${prev.length + 1}`, duration: "3:45" }])
  }

  const handleVideoUpload = () => {
    // In a real app, this would handle actual file uploads
    // For now, we'll simulate adding video files
    setVideos((prev) => [
      ...prev,
      {
        thumbnail: `/placeholder.svg?height=120&width=200`,
        title: `Live Performance ${prev.length + 1}`,
      },
    ])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const removeAudio = (index: number) => {
    setAudio(audio.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create your portfolio</h1>
        <p className="text-muted-foreground">Showcase your work to attract more bookings and opportunities</p>
      </div>

      <div className="bg-ethr-darkgray rounded-lg p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-ethr-black">
            <TabsTrigger value="photos" className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center">
              <Music className="h-4 w-4 mr-2" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square rounded-md overflow-hidden">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Portfolio photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removePhoto(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {photos.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No photos added yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <label htmlFor="photo-upload">
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="outline"
                  className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload photos
                </Button>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <div className="space-y-4 mb-6">
              {audio.map((track, index) => (
                <div key={index} className="bg-ethr-black rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-ethr-neonblue/20 flex items-center justify-center">
                      <Music className="h-5 w-5 text-ethr-neonblue" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{track.name}</p>
                      <p className="text-xs text-muted-foreground">{track.duration}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeAudio(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {audio.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No audio tracks added yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                onClick={handleAudioUpload}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload audio
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {videos.map((video, index) => (
                <div key={index} className="bg-ethr-black rounded-md overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-ethr-neonblue/80 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-ethr-black"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <p className="font-medium">{video.title}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeVideo(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {videos.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No videos added yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                onClick={handleVideoUpload}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload video
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <StepNavigation prevStep="details" nextStep="connections" />
    </div>
  )
}
