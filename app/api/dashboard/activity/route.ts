import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch recent bookings
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select(`
        id,
        created_at,
        status,
        venue:venues (
          name,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch recent messages
    const { data: recentMessages } = await supabase
      .from("messages")
      .select(`
        id,
        created_at,
        content,
        sender:profiles (
          full_name,
          avatar_url
        )
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch recent payments
    const { data: recentPayments } = await supabase
      .from("payments")
      .select(`
        id,
        created_at,
        amount,
        status,
        booking:bookings (
          venue:venues (
            name
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Combine and sort all activities
    const activities = [
      ...(recentBookings?.map(booking => ({
        id: booking.id,
        type: "booking",
        title: "New Booking",
        description: `Booking at ${booking.venue?.name}`,
        time: booking.created_at,
        status: booking.status,
        venue: booking.venue,
      })) || []),
      ...(recentMessages?.map(message => ({
        id: message.id,
        type: "message",
        title: "New Message",
        description: message.content,
        time: message.created_at,
        user: message.sender,
      })) || []),
      ...(recentPayments?.map(payment => ({
        id: payment.id,
        type: "payment",
        title: "Payment Received",
        description: `$${payment.amount} for ${payment.booking?.venue?.name}`,
        time: payment.created_at,
        status: payment.status,
      })) || []),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching dashboard activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 