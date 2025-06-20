"use client";

import { supabase } from "./supabase";

export class OAuthService {
  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Handle OAuth callback
  static async handleOAuthCallback() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Create profile for OAuth user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata.avatar_url,
              account_type: 'artist', // Default account type
            });

          if (profileError) throw profileError;
        }
      }

      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  }
} 