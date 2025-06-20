interface SecurityConfig {
  cors?: {
    origin?: string | string[]
    methods?: string[]
    headers?: string[]
    credentials?: boolean
    maxAge?: number
  }
  rateLimit?: {
    windowMs: number
    maxRequests: number
  }
  helmet?: {
    enabled?: boolean
    contentSecurityPolicy?: boolean
    crossOriginEmbedderPolicy?: boolean
    crossOriginOpenerPolicy?: boolean
    crossOriginResourcePolicy?: boolean
    dnsPrefetchControl?: boolean
    frameguard?: boolean
    hidePoweredBy?: boolean
    hsts?: boolean
    ieNoOpen?: boolean
    noSniff?: boolean
    originAgentCluster?: boolean
    permittedCrossDomainPolicies?: boolean
    referrerPolicy?: boolean
    xssFilter?: boolean
  }
}

class APISecurity {
  private config: Required<SecurityConfig>

  constructor(config: SecurityConfig = {}) {
    this.config = {
      cors: {
        origin: config.cors?.origin || '*',
        methods: config.cors?.methods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        headers: config.cors?.headers || ['Content-Type', 'Authorization'],
        credentials: config.cors?.credentials ?? false,
        maxAge: config.cors?.maxAge || 86400, // 24 hours
      },
      rateLimit: {
        windowMs: config.rateLimit?.windowMs || 15 * 60 * 1000, // 15 minutes
        maxRequests: config.rateLimit?.maxRequests || 100,
      },
      helmet: {
        enabled: config.helmet?.enabled ?? true,
        contentSecurityPolicy: config.helmet?.contentSecurityPolicy ?? true,
        crossOriginEmbedderPolicy: config.helmet?.crossOriginEmbedderPolicy ?? true,
        crossOriginOpenerPolicy: config.helmet?.crossOriginOpenerPolicy ?? true,
        crossOriginResourcePolicy: config.helmet?.crossOriginResourcePolicy ?? true,
        dnsPrefetchControl: config.helmet?.dnsPrefetchControl ?? true,
        frameguard: config.helmet?.frameguard ?? true,
        hidePoweredBy: config.helmet?.hidePoweredBy ?? true,
        hsts: config.helmet?.hsts ?? true,
        ieNoOpen: config.helmet?.ieNoOpen ?? true,
        noSniff: config.helmet?.noSniff ?? true,
        originAgentCluster: config.helmet?.originAgentCluster ?? true,
        permittedCrossDomainPolicies: config.helmet?.permittedCrossDomainPolicies ?? true,
        referrerPolicy: config.helmet?.referrerPolicy ?? true,
        xssFilter: config.helmet?.xssFilter ?? true,
      },
    }
  }

  private getCorsHeaders(request: Request): Headers {
    const headers = new Headers()
    const origin = request.headers.get('origin')

    if (origin) {
      const allowedOrigins = Array.isArray(this.config.cors.origin)
        ? this.config.cors.origin
        : [this.config.cors.origin]

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin)
      }
    }

    const methods = this.config.cors.methods || []
    const allowedHeaders = this.config.cors.headers || []

    headers.set('Access-Control-Allow-Methods', methods.join(', '))
    headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))
    headers.set('Access-Control-Max-Age', String(this.config.cors.maxAge))

    if (this.config.cors.credentials) {
      headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return headers
  }

  private getHelmetHeaders(): Headers {
    const headers = new Headers()

    if (!this.config.helmet.enabled) {
      return headers
    }

    if (this.config.helmet.contentSecurityPolicy) {
      headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
      )
    }

    if (this.config.helmet.crossOriginEmbedderPolicy) {
      headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    }

    if (this.config.helmet.crossOriginOpenerPolicy) {
      headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    }

    if (this.config.helmet.crossOriginResourcePolicy) {
      headers.set('Cross-Origin-Resource-Policy', 'same-origin')
    }

    if (this.config.helmet.dnsPrefetchControl) {
      headers.set('X-DNS-Prefetch-Control', 'off')
    }

    if (this.config.helmet.frameguard) {
      headers.set('X-Frame-Options', 'SAMEORIGIN')
    }

    if (this.config.helmet.hidePoweredBy) {
      headers.set('X-Powered-By', '')
    }

    if (this.config.helmet.hsts) {
      headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      )
    }

    if (this.config.helmet.ieNoOpen) {
      headers.set('X-Download-Options', 'noopen')
    }

    if (this.config.helmet.noSniff) {
      headers.set('X-Content-Type-Options', 'nosniff')
    }

    if (this.config.helmet.originAgentCluster) {
      headers.set('Origin-Agent-Cluster', '?1')
    }

    if (this.config.helmet.permittedCrossDomainPolicies) {
      headers.set('X-Permitted-Cross-Domain-Policies', 'none')
    }

    if (this.config.helmet.referrerPolicy) {
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    }

    if (this.config.helmet.xssFilter) {
      headers.set('X-XSS-Protection', '1; mode=block')
    }

    return headers
  }

  async handleRequest(request: Request): Promise<Response | null> {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const headers = this.getCorsHeaders(request)
      return new Response(null, { headers })
    }

    // Add security headers to the response
    const headers = new Headers()
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('X-Frame-Options', 'DENY')
    headers.set('X-XSS-Protection', '1; mode=block')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // Add CORS headers if needed
    const corsHeaders = this.getCorsHeaders(request)
    corsHeaders.forEach((value, key) => {
      headers.set(key, value)
    })

    // Add Helmet headers if enabled
    const helmetHeaders = this.getHelmetHeaders()
    helmetHeaders.forEach((value, key) => {
      headers.set(key, value)
    })

    return null
  }

  setConfig(config: Partial<SecurityConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      cors: {
        ...this.config.cors,
        ...config.cors,
      },
      rateLimit: {
        ...this.config.rateLimit,
        ...config.rateLimit,
      },
      helmet: {
        ...this.config.helmet,
        ...config.helmet,
      },
    }
  }

  getConfig(): Required<SecurityConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiSecurity = new APISecurity()

export { APISecurity, apiSecurity }
export type { SecurityConfig } 