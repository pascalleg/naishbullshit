import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
export type { Database } from './database/types/database.types'

import {
  createServerClient
} from '@supabase/ssr'
import {
  createRouteHandlerClient,
  createMiddlewareClient
} from '@supabase/auth-helpers-nextjs'

// Server-side Supabase client for Server Components
export function createServerClientComponentClient(
  cookieStore: ReadonlyRequestCookies
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Server-side Supabase client for API Routes / Server Actions
export function createRouteHandlerClientSide(cookieStore: ReadonlyRequestCookies) {
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
}

// Supabase client for Middleware
export function createMiddlewareClientSide(
  req: NextRequest,
  res: NextResponse
) {
  return createMiddlewareClient<Database>({ req, res })
}

// Client-side Supabase client (used in browser)
import { createClient as createBrowserClient } from '@supabase/supabase-js'

export function createBrowserClientComponent() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
