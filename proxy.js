import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Fail closed: if JWT_SECRET is missing, no token will ever verify → all admin
// requests redirect to login. Never falls back to a known string.
function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) return new Uint8Array(0);
  return new TextEncoder().encode(s);
}

const SESSION_COOKIE = 'auth_token';
const PREVIEW_COOKIE = 'admin_preview';

/** @param {import('next/server').NextRequest} request */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Admin routes ────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Login page is public — let it through unconditionally.
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return redirectToLogin(request, pathname);
    }

    try {
      const { payload } = await jwtVerify(token, getSecret(), {
        algorithms: ['HS256'],
      });

      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch {
      // Token expired or tampered — clear stale cookie and redirect to login.
      const response = redirectToLogin(request, pathname);
      response.cookies.set(SESSION_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return response;
    }
  }

  // ── Public routes ────────────────────────────────────────────────────────
  // If the admin came via "Voir le site" the admin_preview cookie is set
  // → keep both cookies (AdminBar stays visible).
  // A fresh visit (bookmark, direct URL) has no preview flag
  // → strip the auth_token so no admin state leaks onto the public site.
  const token = request.cookies.get(SESSION_COOKIE);
  const preview = request.cookies.get(PREVIEW_COOKIE);

  if (token && !preview) {
    const requestHeaders = new Headers(request.headers);
    const cookieHeader = requestHeaders.get('cookie') ?? '';
    const stripped = cookieHeader
      .split(';')
      .map(c => c.trim())
      .filter(c => !c.startsWith(`${SESSION_COOKIE}=`))
      .join('; ');
    if (stripped) {
      requestHeaders.set('cookie', stripped);
    } else {
      requestHeaders.delete('cookie');
    }
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

/**
 * @param {import('next/server').NextRequest} request
 * @param {string} pathname
 */
function redirectToLogin(request, pathname) {
  const loginUrl = new URL('/admin/login', request.url);
  if (pathname !== '/admin') {
    loginUrl.searchParams.set('callbackUrl', pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/admin(.*)',
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)',
  ],
};
