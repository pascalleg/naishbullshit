import { APIError } from './api-error'
import { apiLogger } from './api-logger'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  permissions: string[]
}

interface TokenPayload {
  sub: string
  email: string
  name: string
  role: 'user' | 'admin'
  permissions: string[]
  iat: number
  exp: number
}

interface AuthConfig {
  secret: string
  tokenExpiration: number
  refreshTokenExpiration: number
}

class APIAuth {
  private config: AuthConfig

  constructor(config: AuthConfig) {
    this.config = config
  }

  private async generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const tokenPayload: TokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.config.tokenExpiration,
    }

    // In a real implementation, you would use a JWT library like jsonwebtoken
    // For now, we'll just return a mock token
    return `mock-jwt-token-${JSON.stringify(tokenPayload)}`
  }

  private async verifyToken(token: string): Promise<TokenPayload> {
    try {
      // In a real implementation, you would verify the JWT token
      // For now, we'll just parse the mock token
      const payload = JSON.parse(token.replace('mock-jwt-token-', '')) as TokenPayload

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new APIError('Token expired', 401)
      }

      return payload
    } catch (error) {
      throw new APIError('Invalid token', 401)
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
    })

    const refreshToken = await this.generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
    })

    return { accessToken, refreshToken }
  }

  async verifyAccessToken(token: string): Promise<User> {
    try {
      const payload = await this.verifyToken(token)
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        permissions: payload.permissions,
      }
    } catch (error) {
      apiLogger.error('Failed to verify access token', error)
      throw error
    }
  }

  async verifyRefreshToken(token: string): Promise<User> {
    try {
      const payload = await this.verifyToken(token)
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        permissions: payload.permissions,
      }
    } catch (error) {
      apiLogger.error('Failed to verify refresh token', error)
      throw error
    }
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.verifyRefreshToken(refreshToken)
    return this.generateTokens(user)
  }

  hasPermission(user: User, permission: string): boolean {
    return user.permissions.includes(permission)
  }

  hasRole(user: User, role: 'user' | 'admin'): boolean {
    return user.role === role
  }

  isAdmin(user: User): boolean {
    return this.hasRole(user, 'admin')
  }

  async authenticateRequest(request: Request): Promise<User> {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new APIError('Unauthorized', 401)
    }

    const token = authHeader.slice(7)
    return this.verifyAccessToken(token)
  }

  async requirePermission(request: Request, permission: string): Promise<User> {
    const user = await this.authenticateRequest(request)
    if (!this.hasPermission(user, permission)) {
      throw new APIError('Forbidden', 403)
    }
    return user
  }

  async requireRole(request: Request, role: 'user' | 'admin'): Promise<User> {
    const user = await this.authenticateRequest(request)
    if (!this.hasRole(user, role)) {
      throw new APIError('Forbidden', 403)
    }
    return user
  }

  async requireAdmin(request: Request): Promise<User> {
    const user = await this.authenticateRequest(request)
    if (!this.isAdmin(user)) {
      throw new APIError('Forbidden', 403)
    }
    return user
  }
}

// Create a singleton instance with default configuration
const apiAuth = new APIAuth({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  tokenExpiration: 60 * 60, // 1 hour
  refreshTokenExpiration: 7 * 24 * 60 * 60, // 7 days
})

export { APIAuth, apiAuth }
export type { User, TokenPayload, AuthConfig } 