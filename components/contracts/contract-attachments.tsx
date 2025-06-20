"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  FileText, 
  Image, 
  X, 
  Upload, 
  Loader2,
  File,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

interface UploadProgress {
  [key: string]: number
}

interface ContractAttachmentsProps {
  attachments: Attachment[]
  onAttachmentsChange: (attachments: Attachment[]) => void
  onAttachmentDelete: (attachmentId: string) => void
  disabled?: boolean
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export function ContractAttachments({
  attachments,
  onAttachmentsChange,
  onAttachmentDelete,
  disabled = false
}: ContractAttachmentsProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return

    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        return false
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported type.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    const newAttachments: Attachment[] = []

    try {
      for (const file of validFiles) {
        const formData = new FormData()
        formData.append('file', file)

        // Start upload
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
          }
        }

        const uploadPromise = new Promise<Attachment>((resolve, reject) => {
          xhr.onload = async () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText)
              resolve({
                id: response.id,
                name: file.name,
                url: response.url,
                type: file.type,
                size: file.size
              })
            } else {
              reject(new Error(`Failed to upload ${file.name}`))
            }
          }
          xhr.onerror = () => reject(new Error(`Failed to upload ${file.name}`))
          xhr.open('POST', '/api/upload')
          xhr.send(formData)
        })

        const attachment = await uploadPromise
        newAttachments.push(attachment)
      }

      onAttachmentsChange([...attachments, ...newAttachments])
      toast.success('Files uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload files')
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }, [attachments, onAttachmentsChange, disabled])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: MAX_FILE_SIZE,
    disabled: disabled || uploading
  })

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (type === 'application/pdf') return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, JPG, PNG, DOC, DOCX (max 10MB)
        </p>
      </div>

      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate">{fileName}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ))}

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(attachment.type)}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.url, '_blank')}
                  disabled={disabled}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAttachmentDelete(attachment.id)}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}