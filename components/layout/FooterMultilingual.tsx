'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

export default function FooterMultilingual() {
  const locale = useLocale() as 'fr' | 'en';

  const content = locale === 'fr'
    ? {
        rights: 'Tous droits réservés',
        builtWith: 'Construit avec',
        and: 'et'
      }
    : {
        rights: 'All rights reserved',
        builtWith: 'Built with',
        and: 'and'
      };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} John Portfolio. {content.rights}.
          </p>
          <p className="text-sm text-gray-400">
            {content.builtWith} Next.js {content.and} ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}