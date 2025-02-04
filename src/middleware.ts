import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the route is under the (authed) group
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check for authentication cookie
    const isAuthenticated = request.cookies.has('payload-token')

    if (!isAuthenticated) {
      // Redirect to login page with the original URL as return path
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
