// lib/auth/session.ts
// Cookie name and TTL used by the login/logout route handlers.
// The auth_token cookie is HttpOnly — it can only be set or cleared server-side.
export const SESSION_COOKIE_NAME = 'auth_token';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Set by /api/admin/preview when the admin clicks "Voir le site".
// Tells the public-page middleware to keep the auth_token instead of clearing it.
export const ADMIN_PREVIEW_COOKIE_NAME = 'admin_preview';
export const ADMIN_PREVIEW_MAX_AGE = 60 * 60; // 1 hour
