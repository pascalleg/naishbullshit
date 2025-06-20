"use client"

import type React from "react"

import { useState, useRef } from "react"

export type FileUploadStatus = "idle" | "uploading" | "success" | "error"

interface UseFileUploadOptions {
  maxSizeMB?: number
  acceptedTypes?: string[]
  multiple?: boolean
  onError?: (error: string) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSizeMB = 10,
    acceptedTypes = ["image/jpeg", "image/png", "image/gif", "audio/mpeg", "video/mp4"],
    multiple = false,
    onError = console.error,
  } = options

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<FileUploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      onError(`File type not supported. Please upload ${acceptedTypes.join(", ")}`)
      setError(`File type not supported. Please upload ${acceptedTypes.join(", ")}`)
      return false
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError(`File size should be less than ${maxSizeMB}MB`)
      setError(`File size should be less than ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setError(null)
    const validFiles: File[] = []
    const newPreviews: string[] = []

    Array.from(selectedFiles).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file)

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = () => {
            newPreviews.push(reader.result as string)
            if (newPreviews.length === validFiles.length) {
              setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews)
            }
          }
          reader.readAsDataURL(file)
        } else if (file.type.startsWith("video/")) {
          // For videos, we'll use a placeholder
          newPreviews.push("video-placeholder")
        } else if (file.type.startsWith("audio/")) {
          // For audio, we'll use a placeholder
          newPreviews.push("audio-placeholder")
        }
      }
    })

    if (validFiles.length > 0) {
      setFiles(multiple ? [...files, ...validFiles] : validFiles)
      if (selectedFiles[0].type.startsWith("image/")) {
        setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews)
      } else {
        setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews)
      }
    }

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return []

    setStatus("uploading")
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 300)

    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setStatus("success")

        // Generate mock URLs for the uploaded files
        const uploadedUrls = files.map((file, index) => {
          const timestamp = new Date().getTime()
          const randomString = Math.random().toString(36).substring(2, 10)
          return `/uploads/${timestamp}_${randomString}_${file.name}`
        })

        resolve(uploadedUrls)
      }, 3000)
    })
  }

  const reset = () => {
    setFiles([])
    setPreviews([])
    setStatus("idle")
    setProgress(0)
    setError(null)
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]
    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)
    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  return {
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
  }
}
