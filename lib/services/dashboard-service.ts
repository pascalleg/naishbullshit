import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase";

export class DashboardService {
  private supabase = createClientComponentClient<Database>();

  async getMetrics() {
    const { data, error } = await this.supabase
      .from("dashboard_metrics")
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async getRecentActivity(limit = 5) {
    const { data, error } = await this.supabase
      .from("recent_activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getUpcomingEvents(limit = 5) {
    const { data, error } = await this.supabase
      .from("upcoming_events")
      .select("*")
      .order("date", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async recordActivity(
    type: "booking" | "message" | "payment",
    title: string,
    description: string,
    userData?: any
  ) {
    const { data, error } = await this.supabase.rpc("record_recent_activity", {
      p_type: type,
      p_title: title,
      p_description: description,
      p_user_data: userData,
    });

    if (error) throw error;
    return data;
  }

  async createUpcomingEvent(
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    status: "confirmed" | "pending" | "cancelled",
    venueData: any,
    teamMembers: any[] = []
  ) {
    const { data, error } = await this.supabase
      .from("upcoming_events")
      .insert({
        title,
        date,
        start_time: startTime,
        end_time: endTime,
        status,
        venue_data: venueData,
        team_members: teamMembers,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUpcomingEvent(
    id: string,
    updates: {
      title?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      status?: "confirmed" | "pending" | "cancelled";
      venueData?: any;
      teamMembers?: any[];
    }
  ) {
    const { data, error } = await this.supabase
      .from("upcoming_events")
      .update({
        title: updates.title,
        date: updates.date,
        start_time: updates.startTime,
        end_time: updates.endTime,
        status: updates.status,
        venue_data: updates.venueData,
        team_members: updates.teamMembers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteUpcomingEvent(id: string) {
    const { error } = await this.supabase
      .from("upcoming_events")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  subscribeToMetrics(callback: (payload: any) => void) {
    return this.supabase
      .channel("dashboard_metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard_metrics" },
        callback
      )
      .subscribe();
  }

  subscribeToActivity(callback: (payload: any) => void) {
    return this.supabase
      .channel("recent_activity")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recent_activity" },
        callback
      )
      .subscribe();
  }

  subscribeToEvents(callback: (payload: any) => void) {
    return this.supabase
      .channel("upcoming_events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "upcoming_events" },
        callback
      )
      .subscribe();
  }
} 