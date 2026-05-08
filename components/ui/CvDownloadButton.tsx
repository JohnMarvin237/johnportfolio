'use client';
// Client Component — needs useState/useEffect for dropdown toggle and outside-click detection

import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function CvDownloadButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when the user clicks outside the component
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Also close on Escape key for keyboard users
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('hero.downloadCv')}
      >
        {t('hero.downloadCv')}
        {/* Chevron icon — flips when open */}
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('hero.downloadCv')}
          className="absolute left-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <li role="option" aria-selected={false}>
            <a
              href="/cv-fr.pdf"
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
            >
              {/* French flag emoji treated as decoration; label carries meaning */}
              <span aria-hidden="true">🇫🇷</span>
              {t('hero.cvFr')}
            </a>
          </li>
          <li role="option" aria-selected={false}>
            <a
              href="/cv-en.pdf"
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
            >
              <span aria-hidden="true">🇬🇧</span>
              {t('hero.cvEn')}
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}
