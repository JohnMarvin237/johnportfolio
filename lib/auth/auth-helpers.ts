// lib/auth/auth-helpers.ts
import { cookies, headers } from 'next/headers';
import { verifyToken } from './jwt';

export const AUTH_COOKIE_NAME = 'portfolio_auth_token';
export const AUTH_HEADER_NAME = 'Authorization';

/**
 * Get auth token from request (supports both cookies and headers)
 * Prioritizes Authorization header over cookies
 * For use in server components and API routes
 */
export async function getAuthToken(): Promise<string | null> {
  // First check Authorization header
  const headersList = await headers();
  const authHeader = headersList.get(AUTH_HEADER_NAME);

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Fallback to cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);

  return cookie?.value || null;
}

/**
 * Set auth token in cookie (server-side)
 * For use after successful login
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Clear auth token (server-side)
 * For use during logout
 */
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Get current authenticated user from token
 * Returns null if not authenticated or token invalid
 */
export async function getCurrentUser() {
  const token = await getAuthToken();

  if (!token) return null;

  const payload = verifyToken(token);

  if (!payload) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Create authorization header for client-side requests
 */
export function createAuthHeader(token: string): Record<string, string> {
  return {
    [AUTH_HEADER_NAME]: `Bearer ${token}`,
  };
}