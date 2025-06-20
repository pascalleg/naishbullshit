import { NextRequest } from 'next/server'
import { productionService } from '@/lib/services/production-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

// GET /api/production/equipment
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = await apiRateLimit.handle(request as unknown as Request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authentication
    const user = await apiAuth.authenticateRequest(request as unknown as Request)
    if (!user) {
      throw APIError.unauthorized()
    }

    // Check cache
    const cacheKey = `equipment:${user.id}`
    const cached = await apiCache.get(request as unknown as Request)
    if (cached) {
      return Response.json(cached.data)
    }

    // Get equipment
    const equipment = await productionService.getEquipment(user.id)

    // Cache the result
    await apiCache.set(request as unknown as Request, equipment)

    return Response.json(equipment)
  } catch (error) {
    apiLogger.error('Failed to get equipment', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/production/equipment
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = await apiRateLimit.handle(request as unknown as Request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authentication
    const user = await apiAuth.authenticateRequest(request as unknown as Request)
    if (!user) {
      throw APIError.unauthorized()
    }

    // Parse request body
    const body = await request.json()

    // Add equipment
    const equipment = await productionService.addEquipment(user.id, body)

    // Invalidate cache
    await apiCache.delete(request as unknown as Request)

    return Response.json(equipment)
  } catch (error) {
    apiLogger.error('Failed to add equipment', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/production/equipment/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const rateLimitResponse = await apiRateLimit.handle(request as unknown as Request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authentication
    const user = await apiAuth.authenticateRequest(request as unknown as Request)
    if (!user) {
      throw APIError.unauthorized()
    }

    // Parse request body
    const body = await request.json()

    // Update equipment
    const equipment = await productionService.updateEquipment(
      user.id,
      params.id,
      body
    )

    // Invalidate cache
    await apiCache.delete(request as unknown as Request)

    return Response.json(equipment)
  } catch (error) {
    apiLogger.error('Failed to update equipment', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/production/equipment/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const rateLimitResponse = await apiRateLimit.handle(request as unknown as Request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authentication
    const user = await apiAuth.authenticateRequest(request as unknown as Request)
    if (!user) {
      throw APIError.unauthorized()
    }

    // Delete equipment
    await productionService.deleteEquipment(user.id, params.id)

    // Invalidate cache
    await apiCache.delete(request as unknown as Request)

    return new Response(null, { status: 204 })
  } catch (error) {
    apiLogger.error('Failed to delete equipment', { error })
    if (error instanceof APIError) {
      return Response.json(error.toJSON(), { status: error.statusCode })
    }
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 