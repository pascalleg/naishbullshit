import { NextRequest } from 'next/server'
import { contractExportService } from '@/lib/services/contract-export-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check rate limit
    await apiRateLimit.handle(request)

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Get format from query parameter
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format')

    if (!format || !['pdf', 'docx', 'csv'].includes(format)) {
      throw new APIError('Invalid export format', 400)
    }

    // Export contract
    const { data, filename, contentType } = await contractExportService.exportContract(
      params.id,
      user.id,
      format as 'pdf' | 'docx' | 'csv'
    )

    // Return file
    return new Response(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    apiLogger.error('Failed to export contract', {
      error,
      contractId: params.id
    })

    if (error instanceof APIError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }

    return Response.json(
      { error: 'Failed to export contract' },
      { status: 500 }
    )
  }
} 