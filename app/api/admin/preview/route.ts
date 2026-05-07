import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, ADMIN_PREVIEW_COOKIE_NAME, ADMIN_PREVIEW_MAX_AGE } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/jwt';

// GET /api/admin/preview
// Called when the admin clicks "Voir le site" in the dashboard.
// Sets admin_preview cookie so the public middleware keeps the auth session,
// then redirects to the public homepage.
export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set(ADMIN_PREVIEW_COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_PREVIEW_MAX_AGE,
  });
  return response;
}
