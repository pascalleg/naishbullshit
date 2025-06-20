import { NextRequest } from 'next/server'
import { contractService } from '@/lib/services/contract-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Check cache
    const cacheKey = `contract:${params.id}`
    const cacheRequest = new Request(`/api/contracts/${cacheKey}`)
    const cachedData = await apiCache.get(cacheRequest)
    if (cachedData) {
      return Response.json(cachedData.data)
    }

    // Get contract
    const contract = await contractService.getContract(params.id, user.id)

    // Cache the result
    await apiCache.set(cacheRequest, contract)

    return Response.json(contract)
  } catch (error) {
    apiLogger.error('Failed to get contract', { error, contractId: params.id })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Parse request body
    const body = await request.json()

    // Update contract
    const contract = await contractService.updateContract(params.id, user.id, body)

    // Invalidate cache
    const cacheRequest = new Request(`/api/contracts/${params.id}`)
    await apiCache.delete(cacheRequest)

    return Response.json(contract)
  } catch (error) {
    apiLogger.error('Failed to update contract', { error, contractId: params.id })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Delete contract
    await contractService.cancelContract(user.id, params.id, "Contract cancelled via API")

    // Invalidate cache
    const cacheRequest = new Request(`/api/contracts/${params.id}`)
    await apiCache.delete(cacheRequest)

    return new Response(null, { status: 204 })
  } catch (error) {
    apiLogger.error('Failed to delete contract', { error, contractId: params.id })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 