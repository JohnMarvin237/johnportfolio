'use client'

import T from '../ui/T'
import { formatDate, getLocalized, getLocalizedArray } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import type { Experience } from '@prisma/client'

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const { locale } = useTranslation()
  if (!experience) return null

  const title = getLocalized(experience, 'title', locale)
  const description = getLocalized(experience, 'description', locale)
  const achievements = getLocalizedArray(experience, 'achievements', locale)
  const { company, companyUrl, location, startDate, endDate, current, technologies = [] } = experience

  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

      {/* Timeline dot */}
      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-900"></div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {companyUrl ? (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                {company}
              </a>
            ) : (
              <span className="font-medium">{company}</span>
            )}
            <span className="text-gray-400">•</span>
            <span>{location}</span>
            <span className="text-gray-400">•</span>
            <span>
              {formatDate(startDate, 'fr-CA', 'short')} -{' '}
              {current ? <T k="experience.present" /> : formatDate(endDate, 'fr-CA', 'short')}
            </span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <T k="experience.achievements" />
            </h4>
            <ul className="space-y-1">
              {achievements.map((achievement, i) => (
                <li key={i} className="flex items-start">
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
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
