import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, ADMIN_PREVIEW_COOKIE_NAME } from '@/lib/auth/session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes: anything that's not /admin or /api
  const isPublicRoute =
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api');

  if (isPublicRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME);
    const preview = request.cookies.get(ADMIN_PREVIEW_COOKIE_NAME);

    // Admin came via "Voir le site" → preview flag present → keep both cookies
    if (token && preview) {
      return NextResponse.next();
    }

    // Fresh visit with a leftover admin cookie → clear it
    if (token && !preview) {
      const requestHeaders = new Headers(request.headers);
      const cookieHeader = requestHeaders.get('cookie') ?? '';
      const stripped = cookieHeader
        .split(';')
        .map(c => c.trim())
        .filter(c => !c.startsWith(`${SESSION_COOKIE_NAME}=`))
        .join('; ');
      if (stripped) {
        requestHeaders.set('cookie', stripped);
      } else {
        requestHeaders.delete('cookie');
      }

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on every path except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
