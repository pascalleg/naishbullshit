"use client"

import type React from "react"

import { useState } from "react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadMedia } from "../actions"
import { X, Upload, ImageIcon, Headphones, Video, Loader2 } from "lucide-react"
import Image from "next/image"

interface MediaUploaderProps {
  mediaType: "image" | "audio" | "video"
  onSuccess: (media: any) => void
  onCancel: () => void
}

export function MediaUploader({ mediaType, onSuccess, onCancel }: MediaUploaderProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [featured, setFeatured] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const acceptedTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
    video: ["video/mp4", "video/webm", "video/quicktime"],
  }

  const {
    files,
    previews,
    status,
    progress,
    error,
    fileInputRef,
    handleFileSelect,
    triggerFileSelect,
    uploadFiles,
    reset,
    removeFile,
  } = useFileUpload({
    acceptedTypes: acceptedTypes[mediaType],
    maxSizeMB: mediaType === "image" ? 10 : mediaType === "audio" ? 50 : 100,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      // First upload the files
      await uploadFiles()

      // Then submit the form data
      const formData = new FormData()
      formData.append("mediaType", mediaType)
      formData.append("title", title)
      formData.append("description", description)
      if (featured) {
        formData.append("featured", "on")
      }

      // In a real app, you would append the file or file URL here
      // formData.append("file", files[0])

      const result = await uploadMedia(formData)

      if (result.success) {
        onSuccess(result.media)
      }
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMediaTypeIcon = () => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
      case "audio":
        return <Headphones className="h-10 w-10 text-muted-foreground mb-2" />
      case "video":
        return <Video className="h-10 w-10 text-muted-foreground mb-2" />
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedTypes[mediaType].join(",")}
        className="hidden"
      />

      {files.length === 0 ? (
        <div
          className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-ethr-neonblue/50 transition-colors"
          onClick={triggerFileSelect}
        >
          {getMediaTypeIcon()}
          <p className="font-medium">Drag & drop your {mediaType} here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">
            {mediaType === "image"
              ? "Supports JPG, PNG, WEBP (max 10MB)"
              : mediaType === "audio"
                ? "Supports MP3, WAV (max 50MB)"
                : "Supports MP4, MOV (max 100MB)"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mediaType === "image" && previews.length > 0 && (
            <div className="relative rounded-lg overflow-hidden border border-muted">
              <Image
                src={previews[0] || "/placeholder.svg"}
                alt="Preview"
                width={600}
                height={400}
                className="w-full aspect-video object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => reset()}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {mediaType === "audio" && (
            <div className="bg-ethr-black p-4 rounded-lg border border-muted relative">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-md bg-ethr-neonblue/20 flex items-center justify-center mr-4">
                  <Headphones className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{files[0].name}</p>
                  <p className="text-xs text-muted-foreground">{(files[0].size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => reset()}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {mediaType === "video" && (
            <div className="bg-ethr-black p-4 rounded-lg border border-muted relative">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-md bg-ethr-neonblue/20 flex items-center justify-center mr-4">
                  <Video className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{files[0].name}</p>
                  <p className="text-xs text-muted-foreground">{(files[0].size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => reset()}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {status === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="media-title">Title</Label>
        <Input
          id="media-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Enter ${mediaType} title`}
          className="bg-ethr-black border-muted"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="media-description">Description (Optional)</Label>
        <Textarea
          id="media-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Describe this ${mediaType}`}
          className="bg-ethr-black border-muted"
        />
      </div>

      {mediaType === "image" && (
        <div className="space-y-2">
          <Label htmlFor="image-alt">Alt Text (For accessibility)</Label>
          <Input
            id="image-alt"
            placeholder="Describe the image for screen readers"
            className="bg-ethr-black border-muted"
          />
        </div>
      )}

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="featured-media"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-muted bg-ethr-black text-ethr-neonblue focus:ring-ethr-neonblue"
        />
        <Label htmlFor="featured-media" className="text-sm font-normal">
          Set as featured {mediaType}
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
          disabled={files.length === 0 || !title || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
