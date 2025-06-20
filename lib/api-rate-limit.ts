interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  statusCode?: number
  headers?: boolean
}

interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
}

class APIRateLimit {
  private config: Required<RateLimitConfig>
  private store: Map<string, { count: number; reset: number }>

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      maxRequests: config.maxRequests || 100,
      message: config.message || 'Too many requests, please try again later.',
      statusCode: config.statusCode || 429,
      headers: config.headers ?? true,
    }
    this.store = new Map()
  }

  private getKey(request: Request): string {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const path = new URL(request.url).pathname
    return `${ip}:${path}`
  }

  private getRateLimitInfo(key: string): RateLimitInfo {
    const now = Date.now()
    const info = this.store.get(key)

    if (!info || now > info.reset) {
      this.store.set(key, {
        count: 0,
        reset: now + this.config.windowMs,
      })
      return {
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests,
        reset: now + this.config.windowMs,
      }
    }

    return {
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - info.count),
      reset: info.reset,
    }
  }

  private updateRateLimit(key: string): RateLimitInfo {
    const now = Date.now()
    const info = this.store.get(key)

    if (!info || now > info.reset) {
      this.store.set(key, {
        count: 1,
        reset: now + this.config.windowMs,
      })
      return {
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        reset: now + this.config.windowMs,
      }
    }

    info.count++
    return {
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - info.count),
      reset: info.reset,
    }
  }

  private getRateLimitHeaders(info: RateLimitInfo): Headers {
    const headers = new Headers()
    if (this.config.headers) {
      headers.set('X-RateLimit-Limit', String(info.limit))
      headers.set('X-RateLimit-Remaining', String(info.remaining))
      headers.set('X-RateLimit-Reset', String(info.reset))
    }
    return headers
  }

  async handle(request: Request): Promise<Response | null> {
    const key = this.getKey(request)
    const info = this.getRateLimitInfo(key)

    if (info.remaining <= 0) {
      const headers = this.getRateLimitHeaders(info)
      return new Response(this.config.message, {
        status: this.config.statusCode,
        headers,
      })
    }

    this.updateRateLimit(key)
    return null
  }

  setConfig(config: Partial<RateLimitConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  getConfig(): Required<RateLimitConfig> {
    return { ...this.config }
  }

  clear(): void {
    this.store.clear()
  }
}

// Create a singleton instance with default config
const apiRateLimit = new APIRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests, please try again later.',
  statusCode: 429,
  headers: true,
})

export { APIRateLimit, apiRateLimit }
export type { RateLimitConfig, RateLimitInfo } 