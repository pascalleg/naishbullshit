import { APIError } from './api-error'
import { apiMiddleware } from './api-middleware'
import { APIResponse, createErrorResponse, createSuccessResponse } from './api-response'

type RouteHandler = (request: Request, params: Record<string, string>) => Promise<Response>
type RouteMatcher = (path: string) => Record<string, string> | null

interface Route {
  method: string
  path: string
  handler: RouteHandler
  matcher: RouteMatcher
}

class APIRouter {
  private routes: Route[] = []

  private createRouteMatcher(path: string): RouteMatcher {
    const pattern = path
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          return `(?<${segment.slice(1)}>[^/]+)`
        }
        return segment
      })
      .join('/')

    const regex = new RegExp(`^${pattern}$`)

    return (path: string) => {
      const match = path.match(regex)
      if (!match) {
        return null
      }
      return match.groups || {}
    }
  }

  private addRoute(method: string, path: string, handler: RouteHandler): void {
    this.routes.push({
      method,
      path,
      handler,
      matcher: this.createRouteMatcher(path),
    })
  }

  get(path: string, handler: RouteHandler): void {
    this.addRoute('GET', path, handler)
  }

  post(path: string, handler: RouteHandler): void {
    this.addRoute('POST', path, handler)
  }

  put(path: string, handler: RouteHandler): void {
    this.addRoute('PUT', path, handler)
  }

  patch(path: string, handler: RouteHandler): void {
    this.addRoute('PATCH', path, handler)
  }

  delete(path: string, handler: RouteHandler): void {
    this.addRoute('DELETE', path, handler)
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const method = request.method
    const path = url.pathname

    const route = this.routes.find(
      (route) => route.method === method && route.matcher(path)
    )

    if (!route) {
      throw new APIError('Not found', 404)
    }

    const params = route.matcher(path)
    if (!params) {
      throw new APIError('Not found', 404)
    }

    return route.handler(request, params)
  }

  async process(request: Request): Promise<Response> {
    try {
      return await apiMiddleware.handle(request)
    } catch (error) {
      if (error instanceof APIError) {
        return new Response(
          JSON.stringify(createErrorResponse(error)),
          {
            status: error.statusCode,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      return new Response(
        JSON.stringify(createErrorResponse(new APIError('Internal server error', 500))),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }
}

// Helper functions for common response patterns
function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(
    JSON.stringify(createSuccessResponse(data)),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

function errorResponse(error: APIError): Response {
  return new Response(
    JSON.stringify(createErrorResponse(error)),
    {
      status: error.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

function notFoundResponse(): Response {
  return errorResponse(new APIError('Not found', 404))
}

function unauthorizedResponse(): Response {
  return errorResponse(new APIError('Unauthorized', 401))
}

function forbiddenResponse(): Response {
  return errorResponse(new APIError('Forbidden', 403))
}

function badRequestResponse(message: string): Response {
  return errorResponse(new APIError(message, 400))
}

function internalErrorResponse(): Response {
  return errorResponse(new APIError('Internal server error', 500))
}

// Create a singleton instance
const apiRouter = new APIRouter()

export { APIRouter, apiRouter }
export {
  jsonResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  internalErrorResponse,
}
export type { RouteHandler, RouteMatcher, Route } 