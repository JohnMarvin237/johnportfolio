// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

const AUTH_COOKIE_NAME = 'portfolio_auth_token';

// Routes that require authentication
const protectedRoutes = ['/admin'];
const publicRoutes = ['/admin/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isPublicRoute) {
    // Get token from cookie or header
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);

      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookie
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }

    // Check admin role for admin routes
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      // Not admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - admin/login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|admin/login|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};