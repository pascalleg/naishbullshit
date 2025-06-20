import { APIError } from './api-error'

export interface APIResponse<T> {
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface APIErrorResponse {
  error: {
    message: string
    code?: string
    details?: unknown
  }
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: APIResponse<T>['meta']
): APIResponse<T> {
  return {
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  }
}

export function createErrorResponse(error: unknown): APIErrorResponse {
  const apiError = error instanceof APIError ? error : new APIError(
    error instanceof Error ? error.message : 'An unknown error occurred',
    500,
    'INTERNAL_SERVER_ERROR'
  )

  return {
    error: {
      message: apiError.message,
      code: apiError.code,
      details: apiError.details,
    },
  }
}

export function isSuccessResponse<T>(response: unknown): response is APIResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    !('error' in response)
  )
}

export function isErrorResponse(response: unknown): response is APIErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as APIErrorResponse).error === 'object' &&
    (response as APIErrorResponse).error !== null &&
    'message' in (response as APIErrorResponse).error
  )
}

export function getResponseData<T>(response: APIResponse<T>): T {
  return response.data
}

export function getResponseMessage<T>(response: APIResponse<T>): string | undefined {
  return response.message
}

export function getResponseMeta<T>(response: APIResponse<T>): APIResponse<T>['meta'] {
  return response.meta
}

export function getErrorResponseMessage(response: APIErrorResponse): string {
  return response.error.message
}

export function getErrorResponseCode(response: APIErrorResponse): string | undefined {
  return response.error.code
}

export function getErrorResponseDetails(response: APIErrorResponse): unknown {
  return response.error.details
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): APIResponse<T[]> {
  return createSuccessResponse(
    data,
    message,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  )
}

export function createEmptyResponse<T>(
  message?: string,
  meta?: APIResponse<T>['meta']
): APIResponse<T> {
  return createSuccessResponse({} as T, message, meta)
}

export function createMessageResponse(
  message: string,
  meta?: APIResponse<null>['meta']
): APIResponse<null> {
  return createSuccessResponse(null, message, meta)
}

export function createDataResponse<T>(
  data: T,
  meta?: APIResponse<T>['meta']
): APIResponse<T> {
  return createSuccessResponse(data, undefined, meta)
} 