import { NextRequest } from 'next/server'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Get file from form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      throw new APIError('No file provided', 400)
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new APIError('File size exceeds 10MB limit', 400)
    }

    // Validate file type
    const ALLOWED_TYPES = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new APIError('File type not allowed', 400)
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('contract-attachments')
      .upload(`${user.id}/${filename}`, file)

    if (error) {
      throw new APIError('Failed to upload file', 500)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('contract-attachments')
      .getPublicUrl(`${user.id}/${filename}`)

    // Return file information
    return Response.json({
      id: data.path,
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size
    })
  } catch (error) {
    apiLogger.error('Failed to upload file', { error })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 