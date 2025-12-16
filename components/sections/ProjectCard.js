import Card from '../ui/Card'
import Button from '../ui/Button'
import Link from 'next/link'

/**
 * Carte d'affichage d'un projet
 * @param {Object} props
 * @param {Object} props.project - Données du projet
 * @param {string} props.project.id
 * @param {string} props.project.title
 * @param {string} props.project.description
 * @param {string[]} props.project.technologies
 * @param {string} props.project.imageUrl
 * @param {string} props.project.demoUrl
 * @param {string} props.project.githubUrl
 * @param {boolean} props.project.featured
 */
export default function ProjectCard({ project }) {
  if (!project) return null

  const {
    id,
    title,
    description,
    technologies = [],
    imageUrl,
    demoUrl,
    githubUrl,
    featured
  } = project

  return (
    <Card hover className="h-full flex flex-col">
      {/* Image du projet */}
      {imageUrl && (
        <div className="relative -m-6 mb-4 h-48 overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>
      )}

      {/* Contenu */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
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
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="primary" size="sm" className="w-full">
              Voir la démo
            </Button>
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              Code source
            </Button>
          </a>
        )}
        {!demoUrl && !githubUrl && (
          <Link href={`/projects/${id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              En savoir plus
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}