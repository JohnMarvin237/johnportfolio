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

/** @param {import('next/server').NextRequest} request */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

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
      // Authenticated but not admin — redirect to home, not login.
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    // Token expired or tampered — clear the stale cookie and redirect to login.
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

/**
 * @param {import('next/server').NextRequest} request
 * @param {string} pathname
 */
function redirectToLogin(request, pathname) {
  const loginUrl = new URL('/admin/login', request.url);
  // Preserve the intended destination so the login page can redirect back.
  if (pathname !== '/admin') {
    loginUrl.searchParams.set('callbackUrl', pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Matches /admin, /admin/login, /admin/projects, /admin/projects/new, etc.
  matcher: ['/admin(.*)'],
};
