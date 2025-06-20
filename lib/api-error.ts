export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }

  static badRequest(message: string, details?: unknown) {
    return new APIError(message, 400, 'BAD_REQUEST', details)
  }

  static unauthorized(message = 'Unauthorized') {
    return new APIError(message, 401, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden') {
    return new APIError(message, 403, 'FORBIDDEN')
  }

  static notFound(message = 'Not found') {
    return new APIError(message, 404, 'NOT_FOUND')
  }

  static conflict(message: string, details?: unknown) {
    return new APIError(message, 409, 'CONFLICT', details)
  }

  static tooManyRequests(message = 'Too many requests') {
    return new APIError(message, 429, 'TOO_MANY_REQUESTS')
  }

  static internal(message = 'Internal server error', details?: unknown) {
    return new APIError(message, 500, 'INTERNAL_SERVER_ERROR', details)
  }

  static serviceUnavailable(message = 'Service unavailable') {
    return new APIError(message, 503, 'SERVICE_UNAVAILABLE')
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
    }
  }
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError
}

export function handleAPIError(error: unknown): APIError {
  if (isAPIError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new APIError(error.message, 500, 'INTERNAL_SERVER_ERROR')
  }

  return new APIError('An unknown error occurred', 500, 'INTERNAL_SERVER_ERROR')
}

export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred'
}

export function getErrorDetails(error: unknown): unknown {
  if (isAPIError(error)) {
    return error.details
  }

  return undefined
}

export function getErrorStatusCode(error: unknown): number {
  if (isAPIError(error)) {
    return error.statusCode
  }

  return 500
}

export function getErrorCode(error: unknown): string | undefined {
  if (isAPIError(error)) {
    return error.code
  }

  return undefined
}

export function isRetryableError(error: unknown): boolean {
  const statusCode = getErrorStatusCode(error)
  return statusCode === 429 || statusCode === 503
}

export function shouldLogError(error: unknown): boolean {
  const statusCode = getErrorStatusCode(error)
  return statusCode >= 500
}

export function formatErrorForLogging(error: unknown): Record<string, unknown> {
  return {
    message: getErrorMessage(error),
    statusCode: getErrorStatusCode(error),
    code: getErrorCode(error),
    details: getErrorDetails(error),
    stack: error instanceof Error ? error.stack : undefined,
  }
} 