import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the route is under the (authed) group
  if (
    request.nextUrl.pathname.startsWith('/spaces') ||
    request.nextUrl.pathname.startsWith('/user-settings') ||
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const isAuthenticated = request.cookies.has('payload-token')

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/spaces/:path*', '/user-settings'],
}
