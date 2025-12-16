/**
 * Carte d'affichage d'une expérience professionnelle
 * @param {Object} props
 * @param {Object} props.experience - Données de l'expérience
 * @param {string} props.experience.id
 * @param {string} props.experience.title
 * @param {string} props.experience.company
 * @param {string} props.experience.companyUrl
 * @param {string} props.experience.location
 * @param {Date} props.experience.startDate
 * @param {Date} props.experience.endDate
 * @param {boolean} props.experience.current
 * @param {string} props.experience.description
 * @param {string[]} props.experience.achievements
 * @param {string[]} props.experience.technologies
 */
export default function ExperienceCard({ experience }) {
  if (!experience) return null

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
    technologies = []
  } = experience

  // Formatter les dates
  const formatDate = (date) => {
    if (!date) return ''
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' })
  }

  const dateRange = `${formatDate(startDate)} - ${current ? 'Présent' : formatDate(endDate)}`

  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>

      {/* Timeline dot */}
      <div className="absolute left-0 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary-500 ring-4 ring-white"></div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
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
            <span className="text-gray-400">•</span>
            <span>{location}</span>
            <span className="text-gray-400">•</span>
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-4">
            {description}
          </p>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Réalisations principales :
            </h4>
            <ul className="space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">{achievement}</span>
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
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
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