interface MetricConfig {
  enabled?: boolean
  prefix?: string
  labels?: Record<string, string>
  flushInterval?: number
}

interface MetricValue {
  value: number
  timestamp: number
  labels: Record<string, string>
}

interface Metric {
  name: string
  type: 'counter' | 'gauge' | 'histogram'
  values: MetricValue[]
  labels: Record<string, string>
}

class APIMetrics {
  private config: Required<MetricConfig>
  private metrics: Map<string, Metric>
  private flushTimer: NodeJS.Timeout | null

  constructor(config: MetricConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      prefix: config.prefix || 'api_',
      labels: config.labels || {},
      flushInterval: config.flushInterval || 60000, // 1 minute
    }
    this.metrics = new Map()
    this.flushTimer = null

    if (this.config.enabled) {
      this.startFlushTimer()
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private getMetricName(name: string): string {
    return `${this.config.prefix}${name}`
  }

  private getMetric(name: string, type: Metric['type']): Metric {
    const fullName = this.getMetricName(name)
    let metric = this.metrics.get(fullName)

    if (!metric) {
      metric = {
        name: fullName,
        type,
        values: [],
        labels: { ...this.config.labels },
      }
      this.metrics.set(fullName, metric)
    }

    return metric
  }

  private addValue(metric: Metric, value: number, labels: Record<string, string> = {}): void {
    metric.values.push({
      value,
      timestamp: Date.now(),
      labels: { ...metric.labels, ...labels },
    })
  }

  increment(name: string, value = 1, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const metric = this.getMetric(name, 'counter')
    this.addValue(metric, value, labels)
  }

  decrement(name: string, value = 1, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const metric = this.getMetric(name, 'counter')
    this.addValue(metric, -value, labels)
  }

  gauge(name: string, value: number, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const metric = this.getMetric(name, 'gauge')
    this.addValue(metric, value, labels)
  }

  histogram(name: string, value: number, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const metric = this.getMetric(name, 'histogram')
    this.addValue(metric, value, labels)
  }

  recordRequest(request: Request, response: Response, duration: number): void {
    if (!this.config.enabled) return

    const { method, url } = request
    const { status } = response
    const path = new URL(url).pathname

    this.increment('requests_total', 1, { method, path, status: String(status) })
    this.histogram('request_duration_ms', duration, { method, path })
  }

  recordError(request: Request, error: Error): void {
    if (!this.config.enabled) return

    const { method, url } = request
    const path = new URL(url).pathname

    this.increment('errors_total', 1, {
      method,
      path,
      error: error.name,
    })
  }

  async flush(): Promise<void> {
    if (!this.config.enabled) return

    const metrics = Array.from(this.metrics.values())
    for (const metric of metrics) {
      // In a real implementation, you would send these metrics to a monitoring system
      console.log(`Metric: ${metric.name}`, {
        type: metric.type,
        values: metric.values,
        labels: metric.labels,
      })
    }

    // Clear the values after flushing
    for (const metric of metrics) {
      metric.values = []
    }
  }

  getMetrics(): Metric[] {
    return Array.from(this.metrics.values())
  }

  clear(): void {
    this.metrics.clear()
  }

  setConfig(config: Partial<MetricConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }

    if (this.config.enabled) {
      this.startFlushTimer()
    } else if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }

  getConfig(): Required<MetricConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiMetrics = new APIMetrics()

export { APIMetrics, apiMetrics }
export type { MetricConfig, Metric, MetricValue } 