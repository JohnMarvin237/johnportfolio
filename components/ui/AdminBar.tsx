'use client';
// Client Component — uses useState/useEffect for the collapse toggle

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminBarProps {
  name: string;
}

export default function AdminBar({ name }: AdminBarProps) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 640) setExpanded(false);
  }, []);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        aria-label="Ouvrir la barre admin"
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-gray-700">
      <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span className="font-medium">{name}</span>
      <span className="h-4 w-px bg-white/25" aria-hidden="true" />
      <Link
        href="/admin"
        className="font-medium text-primary-300 hover:text-primary-200 transition-colors"
      >
        Dashboard
      </Link>
      <button
        onClick={() => setExpanded(false)}
        aria-label="Réduire la barre admin"
        className="ml-1 rounded-full p-0.5 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
