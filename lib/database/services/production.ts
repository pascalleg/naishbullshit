import { supabase } from "../supabase"
import { Database } from "../types/supabase"

export type Equipment = Database["public"]["Tables"]["equipment"]["Row"]
export type EquipmentInsert = Database["public"]["Tables"]["equipment"]["Insert"]
export type EquipmentUpdate = Database["public"]["Tables"]["equipment"]["Update"]

export type Availability = Database["public"]["Tables"]["availability"]["Row"]
export type AvailabilityInsert = Database["public"]["Tables"]["availability"]["Insert"]
export type AvailabilityUpdate = Database["public"]["Tables"]["availability"]["Update"]

export type PortfolioItem = Database["public"]["Tables"]["portfolio_items"]["Row"]
export type PortfolioItemInsert = Database["public"]["Tables"]["portfolio_items"]["Insert"]
export type PortfolioItemUpdate = Database["public"]["Tables"]["portfolio_items"]["Update"]

export class ProductionService {
  // Equipment Management
  static async getEquipment(professionalId: string) {
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  static async addEquipment(equipment: EquipmentInsert) {
    const { data, error } = await supabase
      .from("equipment")
      .insert(equipment)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateEquipment(id: string, equipment: EquipmentUpdate) {
    const { data, error } = await supabase
      .from("equipment")
      .update(equipment)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteEquipment(id: string) {
    const { error } = await supabase
      .from("equipment")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Availability Management
  static async getAvailability(professionalId: string) {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("professional_id", professionalId)
      .order("date", { ascending: true })

    if (error) throw error
    return data
  }

  static async setAvailability(availability: AvailabilityInsert) {
    const { data, error } = await supabase
      .from("availability")
      .insert(availability)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateAvailability(id: string, availability: AvailabilityUpdate) {
    const { data, error } = await supabase
      .from("availability")
      .update(availability)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteAvailability(id: string) {
    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Portfolio Management
  static async getPortfolioItems(professionalId: string) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  static async addPortfolioItem(item: PortfolioItemInsert) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePortfolioItem(id: string, item: PortfolioItemUpdate) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .update(item)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deletePortfolioItem(id: string) {
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  // Calendar Sync
  static async syncCalendar(professionalId: string, calendarData: any) {
    const { data, error } = await supabase
      .from("calendar_sync")
      .upsert({
        professional_id: professionalId,
        calendar_data: calendarData,
        last_synced: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getCalendarSync(professionalId: string) {
    const { data, error } = await supabase
      .from("calendar_sync")
      .select("*")
      .eq("professional_id", professionalId)
      .single()

    if (error) throw error
    return data
  }
} 