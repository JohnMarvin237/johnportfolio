// Simple locale getter for server components
import { headers } from 'next/headers';

export async function getLocale() {
  // Get locale from URL path
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Extract locale from path like /fr/... or /en/...
  const segments = pathname.split('/');
  const locale = segments[1];

  // Return locale or default
  if (locale === 'fr' || locale === 'en') {
    return locale;
  }

  // Default to French
  return 'fr';
}