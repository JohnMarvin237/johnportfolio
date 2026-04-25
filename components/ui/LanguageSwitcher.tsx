'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LanguageSwitcherProps {
  currentLocale: 'fr' | 'en';
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [pathWithoutLocale, setPathWithoutLocale] = useState('/');

  useEffect(() => {
    // Get the path without the locale
    setPathWithoutLocale(pathname.slice(3) || '/');
  }, [pathname]);

  return (
    <div className="flex items-center space-x-1">
      <a
        href={`/fr${pathWithoutLocale}`}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
          ${currentLocale === 'fr'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        FR
      </a>
      <a
        href={`/en${pathWithoutLocale}`}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
          ${currentLocale === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        EN
      </a>
    </div>
  );
}