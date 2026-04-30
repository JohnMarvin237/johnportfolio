// lib/admin/safe-callback-url.ts
//
// Validates the post-login callbackUrl to prevent open-redirect attacks
// (e.g. /admin/login?callbackUrl=https://evil.com).
//
// Rules — the URL must be ALL of:
//   1. Non-empty.
//   2. Start with exactly one "/" (rejects "//evil.com" — a protocol-relative
//      URL the browser treats as cross-origin).
//   3. Contain no backslashes (some browsers normalise "\" to "/").
//   4. Be either "/admin" or under "/admin/" or "/admin?…" (path-prefix check).
//
// Anything else falls back to "/admin".

const FALLBACK = '/admin';

export function safeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return FALLBACK;
  if (typeof raw !== 'string') return FALLBACK;
  if (!raw.startsWith('/')) return FALLBACK;
  if (raw.startsWith('//')) return FALLBACK;
  if (raw.startsWith('/\\')) return FALLBACK;
  if (raw.includes('\\')) return FALLBACK;
  if (raw !== '/admin' && !raw.startsWith('/admin/') && !raw.startsWith('/admin?')) {
    return FALLBACK;
  }
  return raw;
}
