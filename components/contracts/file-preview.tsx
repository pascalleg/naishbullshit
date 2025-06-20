"use client"

import { useState } from 'react'
import { Loader2, AlertCircle, FileText, Image, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FilePreviewProps {
  file: {
    name: string
    url: string
    type: string
  }
  onClose: () => void
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8" />
    if (file.type === 'application/pdf') return <FileText className="w-8 h-8" />
    return <File className="w-8 h-8" />
  }

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="max-w-full max-h-[70vh] object-contain"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError('Failed to load image')
          }}
        />
      )
    }

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={file.url}
          className="w-full h-[70vh]"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError('Failed to load PDF')
          }}
        />
      )
    }

    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        {getFileIcon()}
        <p className="mt-2">Preview not available</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.open(file.url, '_blank')}
        >
          Download File
        </Button>
      </div>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon()}
            <span className="truncate">{file.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="mt-2 text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.open(file.url, '_blank')}
              >
                Download Instead
              </Button>
            </div>
          )}

          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  )
} 