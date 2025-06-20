import { z } from 'zod'

interface ValidationConfig {
  abortEarly?: boolean
  stripUnknown?: boolean
  errorMap?: (error: z.ZodError) => Record<string, string>
}

class APIValidation {
  private config: Required<ValidationConfig>

  constructor(config: ValidationConfig = {}) {
    this.config = {
      abortEarly: config.abortEarly ?? false,
      stripUnknown: config.stripUnknown ?? true,
      errorMap: config.errorMap || ((error) => {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          errors[path] = err.message
        })
        return errors
      }),
    }
  }

  private formatError(error: z.ZodError): Record<string, string> {
    return this.config.errorMap(error)
  }

  async validateRequest<T extends z.ZodType>(
    schema: T,
    request: Request
  ): Promise<{ data: z.infer<T>; errors: Record<string, string> | null }> {
    try {
      const contentType = request.headers.get('content-type') || ''
      let data: unknown

      if (contentType.includes('application/json')) {
        data = await request.json()
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        data = Object.fromEntries(formData.entries())
      } else if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData()
        data = Object.fromEntries(formData.entries())
      } else {
        data = await request.text()
      }

      const result = await schema.parseAsync(data, {
        errorMap: (issue) => ({
          message: issue.message || 'Invalid value',
        }),
      })

      return { data: result, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { data: null as any, errors: this.formatError(error) }
      }
      throw error
    }
  }

  async validateQuery<T extends z.ZodType>(
    schema: T,
    request: Request
  ): Promise<{ data: z.infer<T>; errors: Record<string, string> | null }> {
    try {
      const url = new URL(request.url)
      const params = Object.fromEntries(url.searchParams.entries())
      const result = await schema.parseAsync(params, {
        errorMap: (issue) => ({
          message: issue.message || 'Invalid value',
        }),
      })

      return { data: result, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { data: null as any, errors: this.formatError(error) }
      }
      throw error
    }
  }

  async validateParams<T extends z.ZodType>(
    schema: T,
    params: Record<string, string>
  ): Promise<{ data: z.infer<T>; errors: Record<string, string> | null }> {
    try {
      const result = await schema.parseAsync(params, {
        errorMap: (issue) => ({
          message: issue.message || 'Invalid value',
        }),
      })

      return { data: result, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { data: null as any, errors: this.formatError(error) }
      }
      throw error
    }
  }

  async validateHeaders<T extends z.ZodType>(
    schema: T,
    request: Request
  ): Promise<{ data: z.infer<T>; errors: Record<string, string> | null }> {
    try {
      const headers = Object.fromEntries(request.headers.entries())
      const result = await schema.parseAsync(headers, {
        errorMap: (issue) => ({
          message: issue.message || 'Invalid value',
        }),
      })

      return { data: result, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { data: null as any, errors: this.formatError(error) }
      }
      throw error
    }
  }

  async validateFile(
    file: File,
    options: {
      maxSize?: number
      allowedTypes?: string[]
      required?: boolean
    } = {}
  ): Promise<{ errors: Record<string, string> | null }> {
    const errors: Record<string, string> = {}

    if (options.required && !file) {
      errors.file = 'File is required'
      return { errors }
    }

    if (file) {
      if (options.maxSize && file.size > options.maxSize) {
        errors.size = `File size must be less than ${options.maxSize} bytes`
      }

      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        errors.type = `File type must be one of: ${options.allowedTypes.join(', ')}`
      }
    }

    return { errors: Object.keys(errors).length > 0 ? errors : null }
  }

  async validateFiles(
    files: File[],
    options: {
      maxSize?: number
      allowedTypes?: string[]
      required?: boolean
      maxFiles?: number
    } = {}
  ): Promise<{ errors: Record<string, string> | null }> {
    const errors: Record<string, string> = {}

    if (options.required && (!files || files.length === 0)) {
      errors.files = 'Files are required'
      return { errors }
    }

    if (files) {
      if (options.maxFiles && files.length > options.maxFiles) {
        errors.count = `Maximum ${options.maxFiles} files allowed`
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (options.maxSize && file.size > options.maxSize) {
          errors[`files.${i}.size`] = `File size must be less than ${options.maxSize} bytes`
        }

        if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
          errors[`files.${i}.type`] = `File type must be one of: ${options.allowedTypes.join(', ')}`
        }
      }
    }

    return { errors: Object.keys(errors).length > 0 ? errors : null }
  }

  setConfig(config: Partial<ValidationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  getConfig(): Required<ValidationConfig> {
    return { ...this.config }
  }
}

// Create a singleton instance with default config
const apiValidation = new APIValidation()

export { APIValidation, apiValidation }
export type { ValidationConfig } 