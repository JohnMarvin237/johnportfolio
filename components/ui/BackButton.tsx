'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface BackButtonProps {
  from?: string | null;
}

const PAGE_LABEL_KEYS: Record<string, string> = {
  '/': 'nav.home',
  '/projects': 'nav.projects',
  '/experience': 'nav.experience',
  '/about': 'nav.about',
  '/contact': 'nav.contact',
};

export default function BackButton({ from }: BackButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const labelKey = from && PAGE_LABEL_KEYS[from];
  const label = labelKey ? t(labelKey) : t('projects.backToProjects');

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {label}
    </button>
  );
}
