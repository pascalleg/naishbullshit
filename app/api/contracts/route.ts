import { NextRequest } from 'next/server'
import { contractService } from '@/lib/services/contract-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await apiRateLimit.handle(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Authenticate user
    const user = await apiAuth.authenticateRequest(request)

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const role = searchParams.get('role') as 'client' | 'artist' | 'venue' | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Check cache
    const cacheKey = `contracts:${user.id}:${status}:${role}:${startDate}:${endDate}`
    const cacheRequest = new Request(`/api/contracts?${cacheKey}`)
    const cachedData = await apiCache.get(cacheRequest)
    if (cachedData) {
      return Response.json(cachedData.data)
    }

    // Get contracts
    const contracts = await contractService.getContracts(user.id, {
      status: status ? [status] : undefined,
      role: role || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })

    // Cache the result
    await apiCache.set(cacheRequest, contracts)

    return Response.json(contracts)
  } catch (error) {
    apiLogger.error('Failed to get contracts', { error })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Create contract
    const contract = await contractService.createContract(user.id, body)

    // Invalidate cache
    const cacheRequest = new Request(`/api/contracts?${user.id}:*`)
    await apiCache.delete(cacheRequest)

    return Response.json(contract)
  } catch (error) {
    apiLogger.error('Failed to create contract', { error })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 