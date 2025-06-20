import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export class BookingService {
  // Get all bookings for a venue
  static async getVenueBookings(venueId: string) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          profiles:user_id (
            id,
            name,
            avatar_url,
            account_type,
            phone,
            email
          )
        `
        )
        .eq("venue_id", venueId)
        .order("start_date", { ascending: true });

      if (error) throw error;

      return { bookings: data || [], error: null };
    } catch (error) {
      return { bookings: [], error };
    }
  }

  // Get all bookings for a user
  static async getUserBookings(userId: string) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          venue:venue_id (
            id,
            name,
            location,
            avatar_url
          )
        `
        )
        .eq("user_id", userId)
        .order("start_date", { ascending: true });

      if (error) throw error;

      return { bookings: data || [], error: null };
    } catch (error) {
      return { bookings: [], error };
    }
  }

  // Create a new booking
  static async createBooking(bookingData: BookingInsert) {
    try {
      // Check for conflicts
      const { data: conflictingBookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("venue_id", bookingData.venue_id)
        .eq("start_date", bookingData.start_date)
        .neq("status", "cancelled");

      if (conflictingBookings && conflictingBookings.length > 0) {
        throw new Error("This time slot is already booked");
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      return { booking: data, error: null };
    } catch (error) {
      return { booking: null, error };
    }
  }

  // Update booking status
  static async updateBookingStatus(
    bookingId: string,
    status: "pending" | "confirmed" | "cancelled"
  ) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;

      return { booking: data, error: null };
    } catch (error) {
      return { booking: null, error };
    }
  }

  // Update payment status
  static async updatePaymentStatus(
    bookingId: string,
    paymentStatus: "unpaid" | "paid" | "refunded"
  ) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;

      return { booking: data, error: null };
    } catch (error) {
      return { booking: null, error };
    }
  }

  // Get booking by ID
  static async getBookingById(id: string) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          profiles:user_id (
            id,
            name,
            avatar_url,
            account_type,
            phone,
            email,
            bio
          ),
          venue:venue_id (
            id,
            name,
            location,
            avatar_url,
            description
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return { booking: data, error: null };
    } catch (error) {
      return { booking: null, error };
    }
  }

  // Get bookings for a date range
  static async getBookingsInDateRange(
    venueId: string,
    startDate: string,
    endDate: string
  ) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("venue_id", venueId)
        .gte("start_date", startDate)
        .lte("start_date", endDate)
        .neq("status", "cancelled")
        .order("start_date", { ascending: true });

      if (error) throw error;

      return { bookings: data || [], error: null };
    } catch (error) {
      return { bookings: [], error };
    }
  }

  // Cancel a booking
  static async cancelBooking(bookingId: string) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;

      return { booking: data, error: null };
    } catch (error) {
      return { booking: null, error };
    }
  }

  // Get upcoming bookings for a user
  static async getUpcomingBookings(userId: string) {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          venue:venue_id (
            id,
            name,
            location,
            avatar_url
          )
        `
        )
        .eq("user_id", userId)
        .gte("start_date", today)
        .neq("status", "cancelled")
        .order("start_date", { ascending: true })
        .limit(5);

      if (error) throw error;

      return { bookings: data || [], error: null };
    } catch (error) {
      return { bookings: [], error };
    }
  }
}
