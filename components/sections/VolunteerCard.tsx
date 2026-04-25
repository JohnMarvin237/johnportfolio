// components/sections/VolunteerCard.tsx
import React from 'react';

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
  const { title, organization, startDate, endDate, current, description, location } = volunteer;

  const dateRange = `${formatDate(startDate)} — ${current ? 'Présent' : formatDate(endDate)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Icône */}
        <div className="shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>

        <div className="flex-grow">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-purple-700 dark:text-purple-400 font-medium">{organization}</p>
            </div>
            {current && (
              <span className="shrink-0 px-2 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                Actif
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
            {location && (
              <>
                <span>{location}</span>
                <span>•</span>
              </>
            )}
            <span>{dateRange}</span>
          </div>

          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
