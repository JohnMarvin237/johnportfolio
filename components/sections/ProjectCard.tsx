'use client'

import Card from '../ui/Card'
import Button from '../ui/Button'
import T from '../ui/T'
import Link from 'next/link'
import { getLocalized } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import type { Project } from '@prisma/client'

export default function ProjectCard({ project }: { project: Project }) {
  const { locale } = useTranslation()
  if (!project) return null

  const { id, technologies = [], imageUrl, demoUrl, githubUrl, featured } = project
  const title = getLocalized(project, 'title', locale)
  const description = getLocalized(project, 'description', locale)

  return (
    <Card hover className="h-full flex flex-col">
      {/* Project image */}
      {imageUrl && (
        <div className="relative -m-6 mb-4 h-48 overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <T k="projects.featuredBadge" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              <T k="projects.viewDemo" />
            </Button>
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <T k="projects.sourceCode" />
            </Button>
          </a>
        )}
        {!demoUrl && !githubUrl && (
          <Link href={`/projects/${id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              <T k="projects.learnMore" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
