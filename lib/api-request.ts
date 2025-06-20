import { APIError } from './api-error'
import { APIResponse, createErrorResponse, isErrorResponse } from './api-response'

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

interface RetryConfig {
  maxRetries: number
  retryDelay: number
  shouldRetry: (error: unknown) => boolean
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds
const DEFAULT_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: DEFAULT_RETRIES,
  retryDelay: DEFAULT_RETRY_DELAY,
  shouldRetry: (error: unknown) => {
    if (error instanceof APIError) {
      return error.statusCode === 429 || error.statusCode === 503
    }
    return false
  },
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  const data = await response.json()

  if (!response.ok) {
    throw new APIError(
      data.error?.message || 'An error occurred',
      response.status,
      data.error?.code,
      data.error?.details
    )
  }

  return data
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {},
  retryConfig: Partial<RetryConfig> = {}
): Promise<APIResponse<T>> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
  let lastError: unknown

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options)
      return await handleResponse<T>(response)
    } catch (error) {
      lastError = error

      if (attempt === config.maxRetries || !config.shouldRetry(error)) {
        break
      }

      await delay(config.retryDelay * Math.pow(2, attempt))
    }
  }

  throw lastError
}

export async function get<T>(
  url: string,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'GET' }, retryConfig)
}

export async function post<T>(
  url: string,
  data: unknown,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<APIResponse<T>> {
  return apiRequest<T>(
    url,
    {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    },
    retryConfig
  )
}

export async function put<T>(
  url: string,
  data: unknown,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<APIResponse<T>> {
  return apiRequest<T>(
    url,
    {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    },
    retryConfig
  )
}

export async function patch<T>(
  url: string,
  data: unknown,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<APIResponse<T>> {
  return apiRequest<T>(
    url,
    {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    },
    retryConfig
  )
}

export async function del<T>(
  url: string,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<APIResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' }, retryConfig)
}

export async function uploadFile<T>(
  url: string,
  file: File,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<APIResponse<T>> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<T>(
    url,
    {
      ...options,
      method: 'POST',
      headers: {
        ...options.headers,
      },
      body: formData,
    },
    retryConfig
  )
}

export async function downloadFile(
  url: string,
  options: RequestOptions = {},
  retryConfig?: Partial<RetryConfig>
): Promise<Blob> {
  const response = await apiRequest<Blob>(
    url,
    {
      ...options,
      method: 'GET',
      headers: {
        ...options.headers,
      },
    },
    retryConfig
  )

  return response.data
}

export function createQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export function createUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, baseUrl)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
} 