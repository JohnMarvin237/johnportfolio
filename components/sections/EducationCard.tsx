'use client'

import Card from '../ui/Card'
import T from '../ui/T'
import { formatDate, getLocalized } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import type { Education } from '@prisma/client'

export default function EducationCard({ education }: { education: Education }) {
  const { locale } = useTranslation()
  if (!education) return null

  const { institution, location, startDate, endDate, current, gpa } = education
  const degree = getLocalized(education, 'degree', locale)
  const description = getLocalized(education, 'description', locale)
  const field = getLocalized(education, 'field', locale)
  const note = getLocalized(education, 'note', locale)

  return (
    <Card className="h-full">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {degree}
        </h3>
        {field && (
          <p className="text-sm text-primary-600 font-medium mt-1">
            {field}
          </p>
        )}
      </div>

      {/* Institution and location */}
      <div className="mb-3">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {institution}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>{location}</span>
          <span className="text-gray-400">•</span>
          <span>
            {formatDate(startDate, 'fr-CA', 'year')} -{' '}
            {current ? <T k="experience.current" /> : formatDate(endDate, 'fr-CA', 'year')}
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </p>
      )}

      {/* GPA */}
      {gpa && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          GPA : {gpa}
        </p>
      )}

      {/* Note */}
      {note && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium"><T k="experience.note" /></span> {note}
          </p>
        </div>
      )}

      {/* In progress indicator */}
      {current && (
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            <span className="mr-1.5 h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
            <T k="experience.current" />
          </span>
        </div>
      )}
    </Card>
  )
}
