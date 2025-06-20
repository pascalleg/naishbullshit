interface CompressionConfig {
  minSize?: number
  maxSize?: number
  level?: number
  types?: string[]
  enabled?: boolean
}

class APICompression {
  private config: Required<CompressionConfig>

  constructor(config: CompressionConfig = {}) {
    this.config = {
      minSize: config.minSize || 1024, // 1KB
      maxSize: config.maxSize || 10 * 1024 * 1024, // 10MB
      level: config.level || 6,
      types: config.types || [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/javascript',
        'application/json',
        'application/xml',
        'application/x-www-form-urlencoded',
      ],
      enabled: config.enabled ?? true,
    }
  }

  private isCompressible(contentType: string): boolean {
    return this.config.types.some((type) => {
      if (type.endsWith('*')) {
        return contentType.startsWith(type.slice(0, -1))
      }
      return contentType === type
    })
  }

  private isSizeInRange(size: number): boolean {
    return size >= this.config.minSize && size <= this.config.maxSize
  }

  private async compress(data: string): Promise<Uint8Array> {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(data)
    const compressed = await new Response(
      new Blob([encoded]).stream().pipeThrough(new CompressionStream('gzip'))
    ).arrayBuffer()
    return new Uint8Array(compressed)
  }

  private async decompress(data: Uint8Array): Promise<string> {
    const decompressed = await new Response(
      new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))
    ).arrayBuffer()
    const decoder = new TextDecoder()
    return decoder.decode(decompressed)
  }

  async compressResponse(response: Response): Promise<Response> {
    if (!this.config.enabled) {
      return response
    }

    const contentType = response.headers.get('content-type') || ''
    if (!this.isCompressible(contentType)) {
      return response
    }

    const contentLength = parseInt(response.headers.get('content-length') || '0', 10)
    if (!this.isSizeInRange(contentLength)) {
      return response
    }

    const text = await response.text()
    const compressed = await this.compress(text)

    const headers = new Headers(response.headers)
    headers.set('Content-Encoding', 'gzip')
    headers.set('Content-Length', String(compressed.length))
    headers.set('Vary', 'Accept-Encoding')

    return new Response(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }

  async decompressRequest(request: Request): Promise<Request> {
    const contentEncoding = request.headers.get('content-encoding')
    if (contentEncoding !== 'gzip') {
      return request
    }

    const arrayBuffer = await request.arrayBuffer()
    const decompressed = await this.decompress(new Uint8Array(arrayBuffer))

    const headers = new Headers(request.headers)
    headers.delete('content-encoding')
    headers.set('content-length', String(decompressed.length))

    return new Request(request.url, {
      method: request.method,
      headers,
      body: decompressed,
      redirect: request.redirect,
      signal: request.signal,
    })
  }

  setConfig(config: Partial<CompressionConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  getConfig(): Required<CompressionConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiCompression = new APICompression()

export { APICompression, apiCompression }
export type { CompressionConfig } 