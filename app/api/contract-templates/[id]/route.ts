import { NextRequest, NextResponse } from 'next/server'
import { contractTemplateService } from '@/lib/services/contract-template-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiCache } from '@/lib/api-cache'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await apiRateLimit.handle(request)
    const user = await apiAuth.authenticateRequest(request)

    const template = await contractTemplateService.getTemplate(params.id, user.id)

    const cacheUrl = new URL(request.url)
    cacheUrl.pathname = `/api/contract-templates/${params.id}`
    const cacheRequest = new Request(cacheUrl.toString(), { method: request.method })
    await apiCache.set(cacheRequest, template)

    return NextResponse.json(template)
  } catch (error) {
    apiLogger.error('Failed to fetch contract template', {
      error,
      templateId: params.id
    })

    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to fetch contract template' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await apiRateLimit.handle(request)
    const user = await apiAuth.authenticateRequest(request)

    const body = await request.json()
    const { title, description, content, category, isPublic } = body

    const template = await contractTemplateService.updateTemplate(
      params.id,
      user.id,
      {
        title,
        description,
        content,
        category,
        is_public: isPublic
      }
    )

    const cacheUrl = new URL(request.url)
    cacheUrl.pathname = `/api/contract-templates/${params.id}`
    const cacheRequest = new Request(cacheUrl.toString(), { method: 'GET' })
    await apiCache.delete(cacheRequest)

    return NextResponse.json(template)
  } catch (error) {
    apiLogger.error('Failed to update contract template', {
      error,
      templateId: params.id
    })

    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to update contract template' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await apiRateLimit.handle(request)
    const user = await apiAuth.authenticateRequest(request)

    await contractTemplateService.deleteTemplate(params.id, user.id)

    const cacheUrl = new URL(request.url)
    cacheUrl.pathname = `/api/contract-templates/${params.id}`
    const cacheRequest = new Request(cacheUrl.toString(), { method: 'GET' })
    await apiCache.delete(cacheRequest)

    return new Response(null, { status: 204 })
  } catch (error) {
    apiLogger.error('Failed to delete contract template', {
      error,
      templateId: params.id
    })

    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to delete contract template' }, { status: 500 })
  }
}
