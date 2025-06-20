export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string
          created_at: string
          professional_id: string
          name: string
          category: string
          quantity: number
          condition: "excellent" | "good" | "fair" | "poor"
          last_maintenance: string
          notes: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["equipment"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["equipment"]["Insert"]>
      }
      availability: {
        Row: {
          id: string
          created_at: string
          professional_id: string
          date: string
          start_time: string
          end_time: string
          is_available: boolean
          notes: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["availability"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["availability"]["Insert"]>
      }
      portfolio_items: {
        Row: {
          id: string
          created_at: string
          professional_id: string
          title: string
          description: string
          image_url: string
          category: string
          tags: string[]
          featured: boolean
        }
        Insert: Omit<Database["public"]["Tables"]["portfolio_items"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Insert"]>
      }
      calendar_sync: {
        Row: {
          id: string
          created_at: string
          professional_id: string
          calendar_data: Json
          last_synced: string
        }
        Insert: Omit<Database["public"]["Tables"]["calendar_sync"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["calendar_sync"]["Insert"]>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 