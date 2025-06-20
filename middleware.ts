import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/reset-password',
    '/account-deleted',
    '/how-it-works',
    '/about'
  ]
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname)

  // This log will help us debug if the middleware is running
  console.log(`Middleware: Path = ${req.nextUrl.pathname}, Session = ${!!session}, IsPublic = ${isPublicPath}`)

  if (!session && !isPublicPath) {
    // This log will tell us if a redirection is triggered
    console.log(`Middleware: Redirecting to /login from ${req.nextUrl.pathname}`)
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)',
  ],
}