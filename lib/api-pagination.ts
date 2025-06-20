interface PaginationOptions {
  page?: number
  limit?: number
  maxLimit?: number
  defaultLimit?: number
}

interface PaginationResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

class APIPagination {
  private options: Required<PaginationOptions>

  constructor(options: PaginationOptions = {}) {
    this.options = {
      page: 1,
      limit: options.defaultLimit || 10,
      maxLimit: options.maxLimit || 100,
      defaultLimit: options.defaultLimit || 10,
    }
  }

  private validateOptions(options: Partial<PaginationOptions>): Required<PaginationOptions> {
    const page = Math.max(1, options.page || this.options.page)
    const limit = Math.min(
      this.options.maxLimit,
      Math.max(1, options.limit || this.options.limit)
    )

    return {
      page,
      limit,
      maxLimit: this.options.maxLimit,
      defaultLimit: this.options.defaultLimit,
    }
  }

  async paginate<T>(
    data: T[],
    options: Partial<PaginationOptions> = {}
  ): Promise<PaginationResult<T>> {
    const { page, limit } = this.validateOptions(options)
    const start = (page - 1) * limit
    const end = start + limit
    const total = data.length
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrevious = page > 1

    return {
      data: data.slice(start, end),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    }
  }

  async paginateQuery<T>(
    query: Promise<T[]>,
    options: Partial<PaginationOptions> = {}
  ): Promise<PaginationResult<T>> {
    const { page, limit } = this.validateOptions(options)
    const start = (page - 1) * limit
    const end = start + limit

    const [data, total] = await Promise.all([
      query.then((results) => results.slice(start, end)),
      query.then((results) => results.length),
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrevious = page > 1

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    }
  }

  getPaginationParams(request: Request): Required<PaginationOptions> {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || String(this.options.defaultLimit), 10)

    return this.validateOptions({ page, limit })
  }

  getPaginationHeaders(meta: PaginationResult<unknown>['meta']): Headers {
    const headers = new Headers()
    headers.set('X-Page', String(meta.page))
    headers.set('X-Limit', String(meta.limit))
    headers.set('X-Total', String(meta.total))
    headers.set('X-Total-Pages', String(meta.totalPages))
    headers.set('X-Has-Next', String(meta.hasNext))
    headers.set('X-Has-Previous', String(meta.hasPrevious))
    return headers
  }

  setOptions(options: Partial<PaginationOptions>): void {
    this.options = this.validateOptions(options)
  }

  getOptions(): Required<PaginationOptions> {
    return { ...this.options }
  }
}

// Create a singleton instance with default options
const apiPagination = new APIPagination()

export { APIPagination, apiPagination }
export type { PaginationOptions, PaginationResult } 