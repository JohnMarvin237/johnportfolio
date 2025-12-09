// lib/auth/session.ts
export const SESSION_COOKIE_NAME = 'auth_token';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Set authentication cookie (client-side only)
 */
export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return;

  document.cookie = `${SESSION_COOKIE_NAME}=${token}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

/**
 * Get authentication cookie (client-side only)
 */
export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  return cookie ? cookie.split('=')[1] : null;
}

/**
 * Clear authentication cookie (client-side only)
 */
export function clearAuthCookie() {
  if (typeof document === 'undefined') return;

  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}
