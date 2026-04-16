// lib/auth/api-auth.ts
import { auth } from '@/lib/auth/config';

/**
 * Require admin role for API routes
 * Uses NextAuth session (cookies) instead of Bearer JWT tokens
 * Returns session if authenticated admin, null otherwise
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return session;
}
