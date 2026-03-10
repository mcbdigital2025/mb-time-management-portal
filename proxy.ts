import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
]

const PRIVATE_PATH_PREFIXES = [
  '/dashboard',
  '/account',
  '/settings',
  '/employees',
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname)
}

function isPrivatePath(pathname: string) {
  return PRIVATE_PATH_PREFIXES.some((path) => pathname.startsWith(path))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore Next internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('session')?.value
  const isAuthenticated = Boolean(sessionCookie)

  // Protect private pages
  if (isPrivatePath(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Stop logged-in users from visiting auth pages
  if (isPublicPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Run on all routes except:
      - api routes you don't want checked
      - Next internals
      - static assets
    */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}