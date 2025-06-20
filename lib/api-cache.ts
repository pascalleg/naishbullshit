interface CacheConfig {
  ttl: number
  maxSize?: number
  staleWhileRevalidate?: boolean
  headers?: boolean
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  etag: string
}

class APICache {
  private config: Required<CacheConfig>
  private store: Map<string, CacheEntry<unknown>>
  private size: number

  constructor(config: CacheConfig) {
    this.config = {
      ttl: config.ttl || 60 * 1000, // 1 minute
      maxSize: config.maxSize || 1000,
      staleWhileRevalidate: config.staleWhileRevalidate ?? false,
      headers: config.headers ?? true,
    }
    this.store = new Map()
    this.size = 0
  }

  private getKey(request: Request): string {
    const url = new URL(request.url)
    return `${request.method}:${url.pathname}${url.search}`
  }

  private generateETag(data: unknown): string {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `"${hash.toString(16)}"`
  }

  private isStale(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp > this.config.ttl
  }

  private cleanup(): void {
    if (this.size <= this.config.maxSize) {
      return
    }

    const entries = Array.from(this.store.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

    const toDelete = entries.slice(0, this.size - this.config.maxSize)
    for (const [key] of toDelete) {
      this.store.delete(key)
      this.size--
    }
  }

  async get<T>(request: Request): Promise<CacheEntry<T> | null> {
    const key = this.getKey(request)
    const entry = this.store.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      return null
    }

    if (this.isStale(entry)) {
      if (!this.config.staleWhileRevalidate) {
        this.store.delete(key)
        this.size--
        return null
      }
    }

    return entry
  }

  async set<T>(request: Request, data: T): Promise<void> {
    const key = this.getKey(request)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      etag: this.generateETag(data),
    }

    if (!this.store.has(key)) {
      this.size++
    }

    this.store.set(key, entry)
    this.cleanup()
  }

  async delete(request: Request): Promise<void> {
    const key = this.getKey(request)
    if (this.store.delete(key)) {
      this.size--
    }
  }

  getCacheHeaders(entry: CacheEntry<unknown> | null): Headers {
    const headers = new Headers()
    if (!this.config.headers) {
      return headers
    }

    if (entry) {
      headers.set('ETag', entry.etag)
      headers.set('Cache-Control', `max-age=${Math.floor(this.config.ttl / 1000)}`)
      if (this.isStale(entry) && this.config.staleWhileRevalidate) {
        headers.set('Cache-Control', `${headers.get('Cache-Control')}, stale-while-revalidate`)
      }
    } else {
      headers.set('Cache-Control', 'no-cache')
    }

    return headers
  }

  setConfig(config: Partial<CacheConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  getConfig(): Required<CacheConfig> {
    return { ...this.config }
  }

  clear(): void {
    this.store.clear()
    this.size = 0
  }
}

// Create a singleton instance with default config
const apiCache = new APICache({
  ttl: 60 * 1000, // 1 minute
  maxSize: 1000,
  staleWhileRevalidate: false,
  headers: true,
})

export { APICache, apiCache }
export type { CacheConfig, CacheEntry } 