import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (!profile) {
          // Create profile for OAuth user
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.email?.split("@")[0],
              avatar_url: session.user.user_metadata.avatar_url,
              account_type: "artist", // Default account type
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
            return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=Failed to create profile`);
          }
        }
      }
    }

    // Redirect to the dashboard or onboarding
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=No code provided`);
} 