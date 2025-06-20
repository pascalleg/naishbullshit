import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Gig = Database["public"]["Tables"]["gigs"]["Row"];
type GigInsert = Database["public"]["Tables"]["gigs"]["Insert"];
type GigUpdate = Database["public"]["Tables"]["gigs"]["Update"];

export class GigService {
  // Get all gigs with pagination
  static async getGigs(
    page = 1,
    limit = 10,
    filters?: {
      type?: string;
      location?: string;
      status?: string;
      minBudget?: number;
      maxBudget?: number;
    }
  ) {
    try {
      let query = supabase
        .from("gigs")
        .select(
          `
          *,
          profiles:posted_by (
            id,
            name,
            avatar_url,
            account_type
          )
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.type) {
        query = query.eq("type", filters.type);
      }
      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.minBudget) {
        query = query.gte("budget_min", filters.minBudget);
      }
      if (filters?.maxBudget) {
        query = query.lte("budget_max", filters.maxBudget);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        gigs: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
        error: null,
      };
    } catch (error) {
      return {
        gigs: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        error,
      };
    }
  }

  // Get a single gig by ID
  static async getGigById(id: string) {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(
          `
          *,
          profiles:posted_by (
            id,
            name,
            avatar_url,
            account_type,
            bio,
            location,
            website
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return { gig: data, error: null };
    } catch (error) {
      return { gig: null, error };
    }
  }

  // Create a new gig
  static async createGig(gigData: GigInsert) {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .insert(gigData)
        .select()
        .single();

      if (error) throw error;

      return { gig: data, error: null };
    } catch (error) {
      return { gig: null, error };
    }
  }

  // Update a gig
  static async updateGig(id: string, updates: GigUpdate) {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { gig: data, error: null };
    } catch (error) {
      return { gig: null, error };
    }
  }

  // Delete a gig
  static async deleteGig(id: string) {
    try {
      const { error } = await supabase.from("gigs").delete().eq("id", id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Get gigs posted by a specific user
  static async getGigsByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select("*")
        .eq("posted_by", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { gigs: data || [], error: null };
    } catch (error) {
      return { gigs: [], error };
    }
  }

  // Search gigs
  static async searchGigs(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(
          `
          *,
          profiles:posted_by (
            id,
            name,
            avatar_url,
            account_type
          )
        `
        )
        .or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
        )
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { gigs: data || [], error: null };
    } catch (error) {
      return { gigs: [], error };
    }
  }
}
