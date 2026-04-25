'use client'

import T from '../ui/T'
import { formatDate, getLocalized } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import type { Volunteer } from '@prisma/client'

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const { locale } = useTranslation()
  if (!volunteer) return null

  const { organization, startDate, endDate, current, location } = volunteer
  const title = getLocalized(volunteer, 'title', locale)
  const description = getLocalized(volunteer, 'description', locale)

  return (
    <div className="bg-gradient-to-r from-accent-50 to-white dark:from-accent-900/20 dark:to-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-accent-700 dark:text-accent-400 font-medium">
            {organization}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
            {location && (
              <>
                <span>{location}</span>
                <span className="text-gray-400">•</span>
              </>
            )}
            <span>
              {formatDate(startDate, 'fr-CA', 'short')} -{' '}
              {current ? <T k="experience.present" /> : formatDate(endDate, 'fr-CA', 'short')}
            </span>
            {current && (
              <>
                <span className="text-gray-400">•</span>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-400 rounded">
                  <T k="experience.active" />
                </span>
              </>
            )}
          </div>

          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
