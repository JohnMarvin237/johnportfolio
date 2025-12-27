// middleware.ts
import createMiddleware from 'next-intl/middleware';
import {defaultLocale, locales} from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // URLs that should not have locale prefixes
  localeDetection: true,

  // The default locale can have a prefix too
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)'
  ]
};