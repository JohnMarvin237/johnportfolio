// components/sections/VolunteerCard.tsx
// 'use client' required: calls useTranslation() hook
'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export interface Volunteer {
  id: string;
  title: string;
  organization: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description: string;
  location?: string | null;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' });
}

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const { t } = useTranslation();

  if (!volunteer) return null;

  const { title, organization, startDate, endDate, current, description, location } = volunteer;

  const dateRange = `${formatDate(startDate)} - ${current ? t('experience.present') : formatDate(endDate)}`;

  return (
    <div className="bg-gradient-to-r from-accent-50 to-white dark:from-accent-900/20 dark:to-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icône */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-grow">
          {/* Titre et organisation */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-accent-700 font-medium">{organization}</p>

          {/* Localisation et dates */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
            {location && (
              <>
                <span>{location}</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
              </>
            )}
            <span>{dateRange}</span>
            {current && (
              <>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-800 rounded">
                  {t('experience.active')}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
