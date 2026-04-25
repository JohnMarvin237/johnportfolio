// components/sections/ExperienceCardMultilingual.tsx
'use client';

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useLocale } from '@/components/providers/LocaleProvider';

export interface ExperienceMultilingual {
  id: string;
  // Legacy fields
  title?: string | null;
  description?: string | null;
  achievements?: string[] | null;
  // Multilingual fields
  title_fr?: string | null;
  title_en?: string | null;
  description_fr?: string | null;
  description_en?: string | null;
  achievements_fr?: string[] | null;
  achievements_en?: string[] | null;
  // Non-translatable fields
  company: string;
  companyUrl?: string | null;
  location: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  technologies: string[];
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ExperienceCardMultilingualProps {
  experience: ExperienceMultilingual;
}

/**
 * Formate une plage de dates selon la locale
 * @param startDate - Date de début
 * @param endDate - Date de fin (null si current)
 * @param current - Si l'expérience est actuelle
 * @param locale - La locale actuelle
 */
function formatDateRange(
  startDate: Date | string,
  endDate: Date | string | null | undefined,
  current: boolean,
  locale: string
): string {
  const start = new Date(startDate);
  const langCode = locale === 'fr' ? 'fr-FR' : 'en-US';
  const startFormatted = start.toLocaleDateString(langCode, {
    month: 'short',
    year: 'numeric',
  });

  if (current) {
    const presentText = locale === 'fr' ? 'Présent' : 'Present';
    return `${startFormatted} - ${presentText}`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString(langCode, {
      month: 'short',
      year: 'numeric',
    });
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
}

/**
 * Carte d'affichage d'une expérience professionnelle avec support multilingue
 */
export default function ExperienceCardMultilingual({ experience }: ExperienceCardMultilingualProps) {
  const locale = useLocale();

  // Traductions simples
  const translations = {
    current: locale === 'fr' ? 'Actuel' : 'Current',
    achievements: locale === 'fr' ? 'Réalisations' : 'Achievements'
  };

  // Get the appropriate language content
  const title = locale === 'fr'
    ? (experience.title_fr || experience.title || '')
    : (experience.title_en || experience.title || experience.title_fr || '');

  const description = locale === 'fr'
    ? (experience.description_fr || experience.description || '')
    : (experience.description_en || experience.description || experience.description_fr || '');

  const achievements = locale === 'fr'
    ? (experience.achievements_fr || experience.achievements || [])
    : (experience.achievements_en || experience.achievements || experience.achievements_fr || []);

  const {
    company,
    companyUrl,
    location,
    startDate,
    endDate,
    current,
    technologies,
  } = experience;

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle>{title}</CardTitle>
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-1 inline-flex items-center"
              >
                {company}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ) : (
              <p className="text-gray-600 dark:text-gray-100 font-medium mt-1">{company}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{location}</p>
          </div>
          {current && (
            <span className="px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-500/15 rounded-full">
              {translations.current}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {formatDateRange(startDate, endDate, current, locale)}
        </p>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{description}</p>

        {/* Réalisations / Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {translations.achievements}:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}