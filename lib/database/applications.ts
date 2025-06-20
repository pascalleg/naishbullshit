import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Application = Database["public"]["Tables"]["applications"]["Row"];
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];
type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"];

export class ApplicationService {
  // Get applications for a specific gig
  static async getApplicationsForGig(gigId: string) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          profiles:applicant_id (
            id,
            name,
            avatar_url,
            account_type,
            bio,
            location
          ),
          gigs:gig_id (
            id,
            title,
            type,
            budget_min,
            budget_max
          )
        `
        )
        .eq("gig_id", gigId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { applications: data || [], error: null };
    } catch (error) {
      return { applications: [], error };
    }
  }

  // Get applications by a specific user
  static async getApplicationsByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          gigs:gig_id (
            id,
            title,
            type,
            location,
            date,
            budget_min,
            budget_max,
            status,
            profiles:posted_by (
              id,
              name,
              avatar_url
            )
          )
        `
        )
        .eq("applicant_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { applications: data || [], error: null };
    } catch (error) {
      return { applications: [], error };
    }
  }

  // Create a new application
  static async createApplication(applicationData: ApplicationInsert) {
    try {
      // Check if user already applied for this gig
      const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("gig_id", applicationData.gig_id)
        .eq("applicant_id", applicationData.applicant_id)
        .single();

      if (existing) {
        throw new Error("You have already applied for this gig");
      }

      const { data, error } = await supabase
        .from("applications")
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;

      return { application: data, error: null };
    } catch (error) {
      return { application: null, error };
    }
  }

  // Update application status
  static async updateApplicationStatus(
    applicationId: string,
    status: "pending" | "accepted" | "rejected"
  ) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) throw error;

      return { application: data, error: null };
    } catch (error) {
      return { application: null, error };
    }
  }

  // Delete an application
  static async deleteApplication(applicationId: string) {
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Get application by ID
  static async getApplicationById(id: string) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          profiles:applicant_id (
            id,
            name,
            avatar_url,
            account_type,
            bio,
            location,
            website
          ),
          gigs:gig_id (
            id,
            title,
            description,
            type,
            location,
            date,
            budget_min,
            budget_max,
            profiles:posted_by (
              id,
              name,
              avatar_url
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return { application: data, error: null };
    } catch (error) {
      return { application: null, error };
    }
  }

  // Get applications for gigs posted by a user (for venue/organizer dashboard)
  static async getApplicationsForUserGigs(userId: string) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          profiles:applicant_id (
            id,
            name,
            avatar_url,
            account_type,
            bio,
            location
          ),
          gigs:gig_id (
            id,
            title,
            type,
            location,
            date,
            budget_min,
            budget_max
          )
        `
        )
        .eq("gigs.posted_by", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { applications: data || [], error: null };
    } catch (error) {
      return { applications: [], error };
    }
  }
}
