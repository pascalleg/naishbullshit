type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith'

interface FilterCondition {
  field: string
  operator: FilterOperator
  value: any
}

interface FilterConfig {
  allowedFields: string[]
  allowedOperators?: FilterOperator[]
  defaultOperator?: FilterOperator
}

class APIFilter {
  private config: Required<FilterConfig>

  constructor(config: FilterConfig) {
    this.config = {
      allowedFields: config.allowedFields,
      allowedOperators: config.allowedOperators || ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'startsWith', 'endsWith'],
      defaultOperator: config.defaultOperator || 'eq',
    }
  }

  private validateCondition(condition: Partial<FilterCondition>): FilterCondition | null {
    if (!condition.field || !this.config.allowedFields.includes(condition.field)) {
      return null
    }

    const operator = this.config.allowedOperators.includes(condition.operator || '')
      ? condition.operator
      : this.config.defaultOperator

    if (condition.value === undefined || condition.value === null) {
      return null
    }

    return {
      field: condition.field,
      operator: operator as FilterOperator,
      value: condition.value,
    }
  }

  getFilterParams(request: Request): FilterCondition[] {
    const url = new URL(request.url)
    const conditions: FilterCondition[] = []

    for (const [key, value] of url.searchParams.entries()) {
      const [field, operator] = key.split('_')
      const condition = this.validateCondition({
        field,
        operator: operator as FilterOperator,
        value: this.parseValue(value),
      })

      if (condition) {
        conditions.push(condition)
      }
    }

    return conditions
  }

  private parseValue(value: string): any {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  filter<T>(data: T[], conditions: FilterCondition[]): T[] {
    return data.filter((item) => {
      return conditions.every((condition) => {
        const itemValue = (item as any)[condition.field]
        return this.evaluateCondition(itemValue, condition)
      })
    })
  }

  private evaluateCondition(itemValue: any, condition: FilterCondition): boolean {
    const { operator, value } = condition

    switch (operator) {
      case 'eq':
        return itemValue === value
      case 'neq':
        return itemValue !== value
      case 'gt':
        return itemValue > value
      case 'gte':
        return itemValue >= value
      case 'lt':
        return itemValue < value
      case 'lte':
        return itemValue <= value
      case 'in':
        return Array.isArray(value) && value.includes(itemValue)
      case 'nin':
        return Array.isArray(value) && !value.includes(itemValue)
      case 'contains':
        return String(itemValue).includes(String(value))
      case 'startsWith':
        return String(itemValue).startsWith(String(value))
      case 'endsWith':
        return String(itemValue).endsWith(String(value))
      default:
        return false
    }
  }

  async filterQuery<T>(
    query: Promise<T[]>,
    conditions: FilterCondition[]
  ): Promise<T[]> {
    const data = await query
    return this.filter(data, conditions)
  }

  getFilterHeaders(conditions: FilterCondition[]): Headers {
    const headers = new Headers()
    headers.set('X-Filter-Count', String(conditions.length))
    return headers
  }

  setConfig(config: Partial<FilterConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      allowedFields: config.allowedFields || this.config.allowedFields,
      allowedOperators: config.allowedOperators || this.config.allowedOperators,
    }
  }

  getConfig(): Required<FilterConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiFilter = new APIFilter({
  allowedFields: ['id', 'createdAt', 'updatedAt'],
})

export { APIFilter, apiFilter }
export type { FilterCondition, FilterConfig, FilterOperator } 