import { NextRequest } from 'next/server'
import { contractService } from '@/lib/services/contract-service'
import { apiAuth } from '@/lib/api-auth'
import { apiCache } from '@/lib/api-cache'
import { apiRateLimit } from '@/lib/api-rate-limit'
import { apiLogger } from '@/lib/api-logger'
import { APIError } from '@/lib/api-error'

export async function POST(
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

    // Parse request body for signature
    const { signature } = await request.json();

    if (!signature) {
      throw new APIError("Signature not provided", 400);
    }

    // Sign contract
    const contract = await contractService.signContract(user.id, params.id, signature)

    // Invalidate cache
    const cacheRequest = new Request(`/api/contracts/${params.id}`)
    await apiCache.delete(cacheRequest)

    return Response.json(contract)
  } catch (error) {
    apiLogger.error('Failed to sign contract', { error, contractId: params.id })
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: error.statusCode })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 