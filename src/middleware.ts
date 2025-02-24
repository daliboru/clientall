import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('payload-token')
  const isAuthRoute =
    request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect authenticated routes
  if (
    (request.nextUrl.pathname.startsWith('/spaces') ||
      request.nextUrl.pathname.startsWith('/user-settings') ||
      request.nextUrl.pathname.startsWith('/dashboard')) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/signup', '/spaces/:path*', '/user-settings/:path*', '/dashboard/:path*'],
}
