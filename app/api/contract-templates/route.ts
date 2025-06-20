import { NextRequest, NextResponse } from 'next/server'
import { contractTemplateService } from '@/lib/services/contract-template-service'
import { apiAuth } from '@/lib/api-auth'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiCache } from '@/lib/api-cache'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await apiRateLimit.handle(request)
    const user = await apiAuth.authenticateRequest(request)

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const isPublic = searchParams.get('isPublic')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const templates = await contractTemplateService.listTemplates(user.id, {
      category: category || undefined,
      isPublic: isPublic ? isPublic === 'true' : undefined,
      search: search || undefined,
      page,
      limit
    })

    const cacheUrl = new URL(request.url)
    cacheUrl.pathname = `/api/contract-templates/user/${user.id}`
    if (category) cacheUrl.searchParams.set('category', category)
    if (isPublic) cacheUrl.searchParams.set('isPublic', isPublic)
    if (search) cacheUrl.searchParams.set('search', search)
    cacheUrl.searchParams.set('page', page.toString())
    cacheUrl.searchParams.set('limit', limit.toString())

    const cacheRequest = new Request(cacheUrl.toString(), { method: request.method })
    await apiCache.set(cacheRequest, templates)

    return NextResponse.json(templates)
  } catch (error) {
    apiLogger.error('Failed to fetch contract templates', { error })

    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to fetch contract templates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await apiRateLimit.handle(request)
    const user = await apiAuth.authenticateRequest(request)

    const body = await request.json()
    const { title, description, content, category, isPublic } = body

    const template = await contractTemplateService.createTemplate(user.id, {
      title,
      description,
      content,
      category,
      is_public: isPublic
    })

    const cacheUrl = new URL(request.url)
    cacheUrl.pathname = `/api/contract-templates/user/${user.id}`
    const cacheRequest = new Request(cacheUrl.toString(), { method: 'GET' })
    await apiCache.delete(cacheRequest)

    return NextResponse.json(template)
  } catch (error) {
    apiLogger.error('Failed to create contract template', { error })

    if (error instanceof APIError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: 'Failed to create contract template' }, { status: 500 })
  }
}
