"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useGigForm } from "./gig-form-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileImage, FileText, Music, Upload, X, Youtube } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function GigMedia() {
  const { formData, updateFormData } = useGigForm()
  const [videoLink, setVideoLink] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const stagePlotInputRef = useRef<HTMLInputElement>(null)
  const technicalRiderInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      updateFormData({ images: [...formData.images, ...newImages] })
    }
  }

  const handleStagePlotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ stagePlot: e.target.files[0] })
    }
  }

  const handleTechnicalRiderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ technicalRider: e.target.files[0] })
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAudio = Array.from(e.target.files)
      updateFormData({ audioSamples: [...formData.audioSamples, ...newAudio] })
    }
  }

  const handleAddVideoLink = () => {
    if (videoLink.trim() && !formData.videoLinks.includes(videoLink)) {
      updateFormData({ videoLinks: [...formData.videoLinks, videoLink] })
      setVideoLink("")
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    updateFormData({ images: newImages })
  }

  const handleRemoveAudio = (index: number) => {
    const newAudio = [...formData.audioSamples]
    newAudio.splice(index, 1)
    updateFormData({ audioSamples: newAudio })
  }

  const handleRemoveVideoLink = (index: number) => {
    const newLinks = [...formData.videoLinks]
    newLinks.splice(index, 1)
    updateFormData({ videoLinks: newLinks })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Event Images</h2>
        <p className="text-white/70">
          Upload images of your venue, past events, or anything that helps artists understand your event better.
        </p>

        <div>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => imageInputRef.current?.click()}
            className="border-white/20 text-white hover:bg-white/5 w-full h-24 border-dashed"
          >
            <FileImage className="mr-2 h-5 w-5" />
            Click to upload images
          </Button>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-ethr-black/50 rounded-md overflow-hidden border border-white/10">
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Technical Documents</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white mb-2 block">Stage Plot (Optional)</Label>
            <input
              type="file"
              ref={stagePlotInputRef}
              onChange={handleStagePlotUpload}
              accept=".pdf,.jpg,.png"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => stagePlotInputRef.current?.click()}
              className="border-white/20 text-white hover:bg-white/5 w-full h-16 border-dashed"
            >
              <Upload className="mr-2 h-5 w-5" />
              {formData.stagePlot ? formData.stagePlot.name : "Upload Stage Plot"}
            </Button>
          </div>

          <div>
            <Label className="text-white mb-2 block">Technical Rider (Optional)</Label>
            <input
              type="file"
              ref={technicalRiderInputRef}
              onChange={handleTechnicalRiderUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => technicalRiderInputRef.current?.click()}
              className="border-white/20 text-white hover:bg-white/5 w-full h-16 border-dashed"
            >
              <FileText className="mr-2 h-5 w-5" />
              {formData.technicalRider ? formData.technicalRider.name : "Upload Technical Rider"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Audio Samples (Optional)</h2>
        <p className="text-white/70">
          Upload audio samples to give artists an idea of the music style you're looking for.
        </p>

        <div>
          <input
            type="file"
            ref={audioInputRef}
            onChange={handleAudioUpload}
            accept="audio/*"
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => audioInputRef.current?.click()}
            className="border-white/20 text-white hover:bg-white/5 w-full h-16 border-dashed"
          >
            <Music className="mr-2 h-5 w-5" />
            Click to upload audio files
          </Button>
        </div>

        {formData.audioSamples.length > 0 && (
          <ScrollArea className="h-40 border border-white/10 rounded-md p-4">
            <div className="space-y-2">
              {formData.audioSamples.map((audio, index) => (
                <div key={index} className="flex items-center justify-between bg-ethr-black/50 p-3 rounded-md">
                  <div className="flex items-center">
                    <Music className="h-4 w-4 text-ethr-neonblue mr-2" />
                    <span className="text-white truncate max-w-[200px]">{audio.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAudio(index)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-light text-white">Video Links (Optional)</h2>
        <p className="text-white/70">
          Add links to YouTube, Vimeo, or other video platforms to showcase your venue or past events.
        </p>

        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Paste video URL here"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="pl-10 bg-ethr-black/50 border-white/10 text-white"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddVideoLink}
            className="bg-ethr-neonblue hover:bg-ethr-neonblue/90 text-white"
          >
            Add
          </Button>
        </div>

        {formData.videoLinks.length > 0 && (
          <div className="space-y-2 mt-4">
            {formData.videoLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-ethr-black/50 p-3 rounded-md">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ethr-neonblue hover:underline truncate max-w-[90%]"
                >
                  {link}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveVideoLink(index)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
