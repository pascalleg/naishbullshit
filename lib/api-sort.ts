type SortDirection = 'asc' | 'desc'

interface SortOptions {
  field: string
  direction: SortDirection
}

interface SortConfig {
  allowedFields: string[]
  defaultField?: string
  defaultDirection?: SortDirection
}

class APISort {
  private config: Required<SortConfig>

  constructor(config: SortConfig) {
    this.config = {
      allowedFields: config.allowedFields,
      defaultField: config.defaultField || config.allowedFields[0],
      defaultDirection: config.defaultDirection || 'asc',
    }
  }

  private validateOptions(options: Partial<SortOptions>): Required<SortOptions> {
    const field = this.config.allowedFields.includes(options.field || '')
      ? options.field || this.config.defaultField
      : this.config.defaultField

    const direction = options.direction === 'desc' ? 'desc' : 'asc'

    return { field, direction }
  }

  getSortParams(request: Request): Required<SortOptions> {
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort')
    const direction = url.searchParams.get('direction') as SortDirection | null

    if (!sort) {
      return {
        field: this.config.defaultField,
        direction: this.config.defaultDirection,
      }
    }

    return this.validateOptions({
      field: sort,
      direction: direction || this.config.defaultDirection,
    })
  }

  sort<T>(data: T[], options: Partial<SortOptions> = {}): T[] {
    const { field, direction } = this.validateOptions(options)

    return [...data].sort((a, b) => {
      const aValue = (a as any)[field]
      const bValue = (b as any)[field]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1
      return direction === 'asc' ? comparison : -comparison
    })
  }

  async sortQuery<T>(
    query: Promise<T[]>,
    options: Partial<SortOptions> = {}
  ): Promise<T[]> {
    const { field, direction } = this.validateOptions(options)
    const data = await query

    return this.sort(data, { field, direction })
  }

  getSortHeaders(options: Required<SortOptions>): Headers {
    const headers = new Headers()
    headers.set('X-Sort-Field', options.field)
    headers.set('X-Sort-Direction', options.direction)
    return headers
  }

  setConfig(config: Partial<SortConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      allowedFields: config.allowedFields || this.config.allowedFields,
    }
  }

  getConfig(): Required<SortConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiSort = new APISort({
  allowedFields: ['id', 'createdAt', 'updatedAt'],
  defaultField: 'createdAt',
  defaultDirection: 'desc',
})

export { APISort, apiSort }
export type { SortOptions, SortConfig, SortDirection } 