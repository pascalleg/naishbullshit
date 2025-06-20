interface SearchConfig {
  searchableFields: string[]
  minSearchLength?: number
  maxSearchLength?: number
  caseSensitive?: boolean
}

interface SearchOptions {
  query: string
  fields?: string[]
  caseSensitive?: boolean
}

class APISearch {
  private config: Required<SearchConfig>

  constructor(config: SearchConfig) {
    this.config = {
      searchableFields: config.searchableFields,
      minSearchLength: config.minSearchLength || 2,
      maxSearchLength: config.maxSearchLength || 100,
      caseSensitive: config.caseSensitive || false,
    }
  }

  private validateOptions(options: Partial<SearchOptions>): SearchOptions | null {
    if (!options.query) {
      return null
    }

    const query = options.query.trim()
    if (
      query.length < this.config.minSearchLength ||
      query.length > this.config.maxSearchLength
    ) {
      return null
    }

    const fields = (options.fields || this.config.searchableFields).filter((field) =>
      this.config.searchableFields.includes(field)
    )

    if (fields.length === 0) {
      return null
    }

    return {
      query,
      fields,
      caseSensitive: options.caseSensitive ?? this.config.caseSensitive,
    }
  }

  getSearchParams(request: Request): SearchOptions | null {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    const fields = url.searchParams.get('fields')?.split(',')
    const caseSensitive = url.searchParams.get('caseSensitive') === 'true'

    return this.validateOptions({ query: query || '', fields, caseSensitive })
  }

  search<T>(data: T[], options: Partial<SearchOptions>): T[] {
    const searchOptions = this.validateOptions(options)
    if (!searchOptions) {
      return data
    }

    const { query, fields, caseSensitive } = searchOptions
    const searchQuery = caseSensitive ? query : query.toLowerCase()

    return data.filter((item) => {
      return fields!.some((field) => {
        const value = (item as any)[field]
        if (value === null || value === undefined) {
          return false
        }

        const stringValue = String(value)
        const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase()
        return searchValue.includes(searchQuery)
      })
    })
  }

  async searchQuery<T>(
    query: Promise<T[]>,
    options: Partial<SearchOptions>
  ): Promise<T[]> {
    const searchOptions = this.validateOptions(options)
    if (!searchOptions) {
      return query
    }

    const data = await query
    return this.search(data, searchOptions)
  }

  getSearchHeaders(options: SearchOptions | null): Headers {
    const headers = new Headers()
    if (options) {
      headers.set('X-Search-Query', options.query)
      headers.set('X-Search-Fields', options.fields?.join(',') || '')
      headers.set('X-Search-Case-Sensitive', String(options.caseSensitive))
    }
    return headers
  }

  setConfig(config: Partial<SearchConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      searchableFields: config.searchableFields || this.config.searchableFields,
    }
  }

  getConfig(): Required<SearchConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiSearch = new APISearch({
  searchableFields: ['id', 'name', 'description'],
  minSearchLength: 2,
  maxSearchLength: 100,
  caseSensitive: false,
})

export { APISearch, apiSearch }
export type { SearchConfig, SearchOptions } 