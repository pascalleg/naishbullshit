"use client"

import type React from "react"

import { useState, useRef } from "react"

interface UseImageUploadOptions {
  maxSizeMB?: number
  acceptedTypes?: string[]
  onError?: (error: string) => void
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { maxSizeMB = 5, acceptedTypes = ["image/jpeg", "image/png", "image/gif"], onError = console.error } = options

  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      onError(`File type not supported. Please upload ${acceptedTypes.join(", ")}`)
      return
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError(`File size should be less than ${maxSizeMB}MB`)
      return
    }

    setIsLoading(true)

    // Read the file as data URL
    const reader = new FileReader()
    reader.onload = () => {
      setTempImageUrl(reader.result as string)
      setIsLoading(false)
    }
    reader.onerror = () => {
      onError("Failed to read file")
      setIsLoading(false)
    }
    reader.readAsDataURL(file)

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const setFinalImage = (url: string) => {
    setImageUrl(url)
    setTempImageUrl(null)
  }

  const resetImage = () => {
    setImageUrl(null)
    setTempImageUrl(null)
  }

  return {
    isLoading,
    imageUrl,
    tempImageUrl,
    fileInputRef,
    handleFileSelect,
    triggerFileSelect,
    setFinalImage,
    resetImage,
  }
}
