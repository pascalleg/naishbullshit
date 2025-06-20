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

    const now = new Date().toISOString();

    // Fetch upcoming bookings
    const { data: upcomingBookings } = await supabase
      .from("bookings")
      .select(`
        id,
        date,
        start_time,
        end_time,
        status,
        venue:venues (
          name,
          image_url
        ),
        team_members:booking_team_members (
          profile:profiles (
            full_name,
            avatar_url,
            role
          )
        )
      `)
      .eq("user_id", user.id)
      .gte("date", now)
      .order("date", { ascending: true })
      .limit(5);

    // Format the events
    const events = upcomingBookings?.map(booking => ({
      id: booking.id,
      title: `Performance at ${booking.venue?.name}`,
      date: booking.date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      status: booking.status,
      venue: booking.venue,
      teamMembers: booking.team_members?.map(member => member.profile) || [],
    })) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 