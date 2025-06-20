export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type BookingType = "hourly" | "daily";

export interface Booking {
  id: string;
  professional_id: string;
  client_id: string;
  booking_type: BookingType;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  duration: number; // in hours or days
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  project_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  payment_id?: string;
  refund_id?: string;
}

export interface ProfessionalAvailability {
  id: string;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingRequest {
  professional_id: string;
  client_id: string;
  booking_type: BookingType;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number;
  project_type: string;
  notes?: string;
} 