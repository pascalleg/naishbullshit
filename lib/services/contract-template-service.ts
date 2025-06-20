import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { APIError } from '@/lib/api-error'

const templateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.record(z.unknown()),
  category: z.string().min(1),
  is_public: z.boolean(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  usage_count: z.number().int().min(0)
})

type Template = z.infer<typeof templateSchema>

export class ContractTemplateService {
  private static instance: ContractTemplateService

  private constructor() {}

  static getInstance(): ContractTemplateService {
    if (!ContractTemplateService.instance) {
      ContractTemplateService.instance = new ContractTemplateService()
    }
    return ContractTemplateService.instance
  }

  async createTemplate(
    userId: string,
    data: Omit<Template, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'usage_count'>
  ): Promise<Template> {
    const { data: template, error } = await supabase
      .from('contract_templates')
      .insert({
        ...data,
        created_by: userId
      })
      .select()
      .single()

    if (error) {
      throw new APIError('Failed to create template', 500)
    }

    return templateSchema.parse(template)
  }

  async updateTemplate(
    templateId: string,
    userId: string,
    data: Partial<Omit<Template, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'usage_count'>>
  ): Promise<Template> {
    const { data: template, error } = await supabase
      .from('contract_templates')
      .update(data)
      .eq('id', templateId)
      .eq('created_by', userId)
      .select()
      .single()

    if (error) {
      throw new APIError('Failed to update template', 500)
    }

    return templateSchema.parse(template)
  }

  async deleteTemplate(templateId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('contract_templates')
      .delete()
      .eq('id', templateId)
      .eq('created_by', userId)

    if (error) {
      throw new APIError('Failed to delete template', 500)
    }
  }

  async getTemplate(templateId: string, userId: string): Promise<Template> {
    const { data: template, error } = await supabase
      .from('contract_templates')
      .select()
      .eq('id', templateId)
      .or(`created_by.eq.${userId},is_public.eq.true`)
      .single()

    if (error) {
      throw new APIError('Template not found', 404)
    }

    return templateSchema.parse(template)
  }

  async listTemplates(
    userId: string,
    options: {
      category?: string
      isPublic?: boolean
      search?: string
      page?: number
      limit?: number
    } = {}
  ): Promise<{
    templates: Template[]
    total: number
  }> {
    const { category, isPublic, search, page = 1, limit = 10 } = options

    let query = supabase
      .from('contract_templates')
      .select('*', { count: 'exact' })
      .or(`created_by.eq.${userId},is_public.eq.true`)

    if (category) {
      query = query.eq('category', category)
    }

    if (typeof isPublic === 'boolean') {
      query = query.eq('is_public', isPublic)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: templates, error, count } = await query
      .order('usage_count', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw new APIError('Failed to fetch templates', 500)
    }

    return {
      templates: templates.map(template => templateSchema.parse(template)),
      total: count || 0
    }
  }

  async getPopularTemplates(limit = 5): Promise<Template[]> {
    const { data: templates, error } = await supabase
      .from('contract_templates')
      .select()
      .eq('is_public', true)
      .order('usage_count', { ascending: false })
      .limit(limit)

    if (error) {
      throw new APIError('Failed to fetch popular templates', 500)
    }

    return templates.map(template => templateSchema.parse(template))
  }

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('category')
      .eq('is_public', true)

    if (error) {
      throw new APIError('Failed to fetch categories', 500)
    }

    return [...new Set(data.map(item => item.category))]
  }
}

export const contractTemplateService = ContractTemplateService.getInstance() 