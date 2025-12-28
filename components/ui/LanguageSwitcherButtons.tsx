// components/ui/LanguageSwitcherButtons.tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';
import { useTransition } from 'react';

export default function LanguageSwitcherButtons() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return; // Don't switch if already on this locale

    startTransition(() => {
      // Get the current pathname without the locale
      const currentPathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

      // Navigate to the new locale path
      router.push(`/${newLocale}${currentPathWithoutLocale}`);
    });
  };

  return (
    <div className="flex items-center space-x-1 relative">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          disabled={isPending}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${locale === loc
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={`Switch to ${loc.toUpperCase()}`}
          aria-current={locale === loc ? 'true' : 'false'}
        >
          {loc.toUpperCase()}
        </button>
      ))}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
}