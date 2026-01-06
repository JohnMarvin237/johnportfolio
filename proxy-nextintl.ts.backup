import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from '@/i18n/config';

export default createMiddleware({
  // List of all supported locales
  locales,

  // Default locale if no match
  defaultLocale,

  // Prefix strategy
  localePrefix,

  // Automatically detect locale from browser
  localeDetection: true,
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next internals
  // - _vercel internals
  // - static files (e.g. favicon.ico, robots.txt, etc.)
  matcher: [
    // Match all pathnames except for the ones starting with:
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match root
    '/'
  ]
};