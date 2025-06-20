import { supabase } from "@/lib/supabase";
import type { Booking, BookingRequest, ProfessionalAvailability } from "./types/booking";

export class BookingService {
  static async createBooking(request: BookingRequest): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        professional_id: request.professional_id,
        client_id: request.client_id,
        booking_type: request.booking_type,
        start_date: request.start_date,
        end_date: request.end_date,
        start_time: request.start_time,
        end_time: request.end_time,
        duration: request.duration,
        total_price: request.total_price,
        project_type: request.project_type,
        notes: request.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBooking(bookingId: string): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateBookingStatus(
    bookingId: string,
    status: Booking["status"],
    userId: string
  ): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status,
        ...(status === "cancelled" ? { cancelled_at: new Date().toISOString() } : {}),
      })
      .match({ id: bookingId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePaymentStatus(
    bookingId: string,
    paymentStatus: Booking["payment_status"],
    paymentId?: string
  ): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        payment_id: paymentId,
      })
      .match({ id: bookingId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async checkAvailability(
    professionalId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("professional_availability")
      .select("*")
      .eq("professional_id", professionalId)
      .eq("date", date)
      .eq("is_available", true)
      .gte("start_time", startTime)
      .lte("end_time", endTime);

    if (error) throw error;

    // Check if there are any existing bookings for this time slot
    const { data: existingBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("professional_id", professionalId)
      .eq("start_date", date)
      .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`)
      .not("status", "eq", "cancelled");

    if (bookingsError) throw bookingsError;

    return data.length > 0 && existingBookings.length === 0;
  }

  static async setAvailability(
    professionalId: string,
    availability: Omit<ProfessionalAvailability, "id" | "professional_id" | "created_at" | "updated_at">
  ): Promise<ProfessionalAvailability> {
    const { data, error } = await supabase
      .from("professional_availability")
      .insert({
        professional_id: professionalId,
        ...availability,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProfessionalAvailability(
    professionalId: string,
    startDate: string,
    endDate: string
  ): Promise<ProfessionalAvailability[]> {
    const { data, error } = await supabase
      .from("professional_availability")
      .select("*")
      .eq("professional_id", professionalId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) throw error;
    return data;
  }
} 