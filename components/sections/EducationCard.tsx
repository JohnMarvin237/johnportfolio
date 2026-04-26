// components/sections/EducationCard.tsx
// 'use client' required: calls useTranslation() hook
'use client';

import React from 'react';
import Card from '../ui/Card';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  field?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description?: string | null;
  gpa?: string | null;
  note?: string | null;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatYear(date: Date | string | null | undefined): string {
  if (!date) return '';
  return String(new Date(date).getFullYear());
}

export default function EducationCard({ education }: { education: Education }) {
  const { t } = useTranslation();

  if (!education) return null;

  const { degree, institution, location, field, startDate, endDate, current, description, note } =
    education;

  const dateRange = `${formatYear(startDate)} - ${current ? t('experience.current') : formatYear(endDate)}`;

  return (
    <Card className="h-full">
      {/* En-tête */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{degree}</h3>
        {field && (
          <p className="text-sm text-primary-600 font-medium mt-1">{field}</p>
        )}
      </div>

      {/* Institution et localisation */}
      <div className="mb-3">
        <p className="text-gray-700 dark:text-gray-300 font-medium">{institution}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>{location}</span>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span>{dateRange}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      )}

      {/* Note */}
      {note && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">{t('experience.note')}</span> {note}
          </p>
        </div>
      )}

      {/* Indicateur de formation en cours */}
      {current && (
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
            <span className="mr-1.5 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            {t('experience.current')}
          </span>
        </div>
      )}
    </Card>
  );
}
