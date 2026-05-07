// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, ADMIN_PREVIEW_COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnecté' });
  const expired = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
  response.cookies.set(SESSION_COOKIE_NAME, '', expired);
  response.cookies.set(ADMIN_PREVIEW_COOKIE_NAME, '', expired);
  return response;
}
