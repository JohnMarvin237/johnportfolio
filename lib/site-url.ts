// Single source of truth for the site's absolute base URL.
// Used by app/layout.tsx (metadataBase), app/robots.ts and app/sitemap.ts.
//
// Priority:
// 1. NEXT_PUBLIC_APP_URL, but only if it's a valid URL that doesn't point at
//    localhost/127.0.0.1 — a misconfigured Production env var must never win.
// 2. Vercel's system environment variables (always injected at build/runtime
//    on every Vercel deployment): VERCEL_PROJECT_PRODUCTION_URL in production,
//    VERCEL_BRANCH_URL / VERCEL_URL in preview. These require "Enable access
//    to System Environment Variables" in Vercel Project Settings.
// 3. localhost — only reachable in local `next dev`, never on Vercel.
function isUsableUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol, hostname } = new URL(value);
    if (!protocol.startsWith('http')) return false;
    return hostname !== 'localhost' && hostname !== '127.0.0.1';
  } catch {
    return false;
  }
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (isUsableUrl(explicit)) return explicit.replace(/\/$/, '');

  const vercelHost =
    process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;

  if (vercelHost) return `https://${vercelHost}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
