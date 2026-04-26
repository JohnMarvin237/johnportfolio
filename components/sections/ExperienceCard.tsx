// components/sections/ExperienceCard.tsx
// 'use client' required: calls useTranslation() hook
'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export interface Experience {
  id: string;
  title: string;
  company: string;
  companyUrl?: string | null;
  location: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' });
}

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const { t } = useTranslation();

  if (!experience) return null;

  const {
    title,
    company,
    companyUrl,
    location,
    startDate,
    endDate,
    current,
    description,
    achievements = [],
    technologies = [],
  } = experience;

  const dateRange = `${formatDate(startDate)} - ${current ? t('experience.present') : formatDate(endDate)}`;

  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-800" />

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                {company}
              </a>
            ) : (
              <span className="font-medium">{company}</span>
            )}
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>{location}</span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Description */}
        {description && <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('experience.achievements')}
            </h4>
            <ul className="space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{achievement}</span>
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
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
