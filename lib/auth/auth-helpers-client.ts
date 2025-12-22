// lib/auth/auth-helpers-client.ts
// Client-side auth helpers

export const AUTH_COOKIE_NAME = 'portfolio_auth_token';
export const AUTH_HEADER_NAME = 'Authorization';

/**
 * Create authorization header for client-side requests
 */
export function createAuthHeader(token: string): Record<string, string> {
  return {
    [AUTH_HEADER_NAME]: `Bearer ${token}`,
  };
}

/**
 * Get auth token from browser cookies
 */
export function getAuthTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${AUTH_COOKIE_NAME}=`));
  return cookie ? cookie.split('=')[1] : null;
}

/**
 * Set auth token in browser cookie
 */
export function setAuthTokenCookie(token: string): void {
  if (typeof document === 'undefined') return;

  const maxAge = 30 * 24 * 60 * 60; // 30 days
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Clear auth token from browser cookie
 */
export function clearAuthTokenCookie(): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}