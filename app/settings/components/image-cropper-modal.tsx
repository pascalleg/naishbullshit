"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (croppedImageUrl: string) => void
  imageUrl: string | null
}

export function ImageCropperModal({ isOpen, onClose, onSave, imageUrl }: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // This function is called when the image is loaded
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget

    // Create a centered crop with a 1:1 aspect ratio
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height,
      ),
      width,
      height,
    )

    setCrop(crop)
  }, [])

  // Generate the cropped image
  const handleSave = async () => {
    if (!imgRef.current || !completedCrop) return

    setIsLoading(true)

    try {
      const image = imgRef.current
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("No 2d context")
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = completedCrop.width
      canvas.height = completedCrop.height

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      )

      // Convert the canvas to a data URL
      const base64Image = canvas.toDataURL("image/jpeg", 0.9)
      onSave(base64Image)
    } catch (error) {
      console.error("Error generating cropped image:", error)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-ethr-darkgray border-muted sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          {imageUrl && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
              className="max-h-[400px] rounded-md overflow-hidden"
            >
              <img
                ref={imgRef}
                src={imageUrl || "/placeholder.svg"}
                alt="Upload"
                className="max-h-[400px] max-w-full"
                onLoad={onImageLoad}
                crossOrigin="anonymous"
              />
            </ReactCrop>
          )}
          <p className="text-xs text-muted-foreground mt-4">Drag to reposition. Resize using the corners.</p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-muted text-muted-foreground hover:bg-ethr-black hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
            disabled={isLoading || !completedCrop}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Save & Apply"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
