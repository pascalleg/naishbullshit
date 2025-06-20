import { APIError } from './api-error'
import { apiLogger } from './api-logger'
import { apiRateLimit } from './api-rate-limit'
import { apiCache } from './api-cache'

type MiddlewareFunction = (
  request: Request,
  next: () => Promise<Response>
) => Promise<Response>

class APIMiddleware {
  private middleware: MiddlewareFunction[] = []

  use(middleware: MiddlewareFunction): void {
    this.middleware.push(middleware)
  }

  async handle(request: Request): Promise<Response> {
    const middlewareChain = this.middleware.reduceRight<() => Promise<Response>>(
      (next, middleware) => () => middleware(request, next),
      () => Promise.reject(new APIError('No middleware handled the request', 500))
    )

    return middlewareChain()
  }
}

// Default middleware functions
const errorHandler: MiddlewareFunction = async (request, next) => {
  try {
    return await next()
  } catch (error) {
    apiLogger.error('Request failed', error)
    const apiError = error instanceof APIError ? error : new APIError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      500
    )
    return new Response(
      JSON.stringify({
        error: {
          message: apiError.message,
          code: apiError.code,
          details: apiError.details,
        },
      }),
      {
        status: apiError.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

const requestLogger: MiddlewareFunction = async (request, next) => {
  const start = Date.now()
  const response = await next()
  const duration = Date.now() - start
  apiLogger.logRequest(request)
  apiLogger.logResponse(response, duration)
  return response
}

const rateLimiterMiddleware: MiddlewareFunction = async (request, next) => {
  const rateLimitResponse = await apiRateLimit.handle(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  return next()
}

const cacheMiddleware: MiddlewareFunction = async (request, next) => {
  if (request.method !== 'GET') {
    return next()
  }

  const cacheKey = request // Use Request object as key
  const cachedEntry = await apiCache.get<Response>(cacheKey)

  if (cachedEntry) {
    return cachedEntry.data // Return the data from the CacheEntry
  }

  const response = await next()
  await apiCache.set(cacheKey, response) // Use Request object and Response object
  return response
}

const corsMiddleware: MiddlewareFunction = async (request, next) => {
  const response = await next()
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const authMiddleware: MiddlewareFunction = async (request, next) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new APIError('Unauthorized', 401)
  }

  const token = authHeader.slice(7)
  // In a real implementation, you would validate the token here
  // For example, using JWT verification or checking against a database

  return next()
}

const validationMiddleware: MiddlewareFunction = async (request, next) => {
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    const contentType = request.headers.get('Content-Type')
    if (contentType?.includes('application/json')) {
      try {
        const body = await request.json()
        // In a real implementation, you would validate the body here
        // For example, using a schema validation library like Zod or Joi
        request = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(body),
        })
      } catch (error) {
        throw new APIError('Invalid JSON body', 400)
      }
    }
  }

  return next()
}

// Create a singleton instance with default middleware
const apiMiddleware = new APIMiddleware()
apiMiddleware.use(errorHandler)
apiMiddleware.use(requestLogger)
apiMiddleware.use(rateLimiterMiddleware)
apiMiddleware.use(cacheMiddleware)
apiMiddleware.use(corsMiddleware)
apiMiddleware.use(authMiddleware)
apiMiddleware.use(validationMiddleware)

export { APIMiddleware, apiMiddleware }
export type { MiddlewareFunction } 