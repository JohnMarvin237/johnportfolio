import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes: anything that's not /admin or /api
  const isPublicRoute =
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api');

  if (isPublicRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME);
    if (token) {
      // Strip the cookie from the forwarded request so Server Components
      // don't see it (AdminBar won't render, no admin state on public pages).
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
      // Tell the browser to delete the cookie too
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
