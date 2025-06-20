type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogConfig {
  level?: LogLevel
  format?: 'json' | 'text'
  timestamp?: boolean
  colors?: boolean
  maxSize?: number
  maxFiles?: number
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
  error?: Error
}

class APILogger {
  private config: Required<LogConfig>
  private entries: LogEntry[]

  constructor(config: LogConfig = {}) {
    this.config = {
      level: config.level || 'info',
      format: config.format || 'json',
      timestamp: config.timestamp ?? true,
      colors: config.colors ?? true,
      maxSize: config.maxSize || 1000,
      maxFiles: config.maxFiles || 5,
    }
    this.entries = []
  }

  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, data, error } = entry
    const base: Record<string, unknown> = {
      level,
      message,
    }

    if (this.config.timestamp) {
      base.timestamp = timestamp
    }

    if (data) {
      base.data = data
    }

    if (error) {
      base.error = {
        message: error.message,
        stack: error.stack,
      }
    }

    if (this.config.format === 'json') {
      return JSON.stringify(base)
    }

    const parts = [
      this.config.timestamp ? `[${timestamp}]` : '',
      `[${level.toUpperCase()}]`,
      message,
    ]

    if (data) {
      parts.push(JSON.stringify(data))
    }

    if (error) {
      parts.push(`\nError: ${error.message}\nStack: ${error.stack}`)
    }

    return parts.filter(Boolean).join(' ')
  }

  private addEntry(entry: LogEntry): void {
    this.entries.push(entry)
    if (this.entries.length > this.config.maxSize) {
      this.entries = this.entries.slice(-this.config.maxSize)
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.config.level)
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      this.addEntry({
        level: 'debug',
        message,
        timestamp: this.getTimestamp(),
        data,
      })
      console.debug(this.formatMessage(this.entries[this.entries.length - 1]))
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      this.addEntry({
        level: 'info',
        message,
        timestamp: this.getTimestamp(),
        data,
      })
      console.info(this.formatMessage(this.entries[this.entries.length - 1]))
    }
  }

  warn(message: string, data?: unknown, error?: Error): void {
    if (this.shouldLog('warn')) {
      this.addEntry({
        level: 'warn',
        message,
        timestamp: this.getTimestamp(),
        data,
        error,
      })
      console.warn(this.formatMessage(this.entries[this.entries.length - 1]))
    }
  }

  error(message: string, data?: unknown, error?: Error): void {
    if (this.shouldLog('error')) {
      this.addEntry({
        level: 'error',
        message,
        timestamp: this.getTimestamp(),
        data,
        error,
      })
      console.error(this.formatMessage(this.entries[this.entries.length - 1]))
    }
  }

  logRequest(request: Request): void {
    const { method, url } = request
    this.info(`Request: ${method} ${url}`)
  }

  logResponse(response: Response, duration: number): void {
    const { status, statusText } = response
    this.info(`Response: ${status} ${statusText} (${duration}ms)`)
  }

  logError(error: Error, request?: Request): void {
    const message = request
      ? `Error processing ${request.method} ${request.url}`
      : 'Error occurred'
    this.error(message, undefined, error)
  }

  getEntries(): LogEntry[] {
    return [...this.entries]
  }

  clear(): void {
    this.entries = []
  }

  setConfig(config: Partial<LogConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  getConfig(): Required<LogConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiLogger = new APILogger()

export { APILogger, apiLogger }
export type { LogConfig, LogEntry, LogLevel } 