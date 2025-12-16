/**
 * Carte d'affichage d'une expérience de bénévolat
 * @param {Object} props
 * @param {Object} props.volunteer - Données du bénévolat
 * @param {string} props.volunteer.id
 * @param {string} props.volunteer.title
 * @param {string} props.volunteer.organization
 * @param {Date} props.volunteer.startDate
 * @param {Date} props.volunteer.endDate
 * @param {boolean} props.volunteer.current
 * @param {string} props.volunteer.description
 * @param {string} props.volunteer.location
 */
export default function VolunteerCard({ volunteer }) {
  if (!volunteer) return null

  const {
    title,
    organization,
    startDate,
    endDate,
    current,
    description,
    location
  } = volunteer

  // Formatter les dates
  const formatDate = (date) => {
    if (!date) return ''
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' })
  }

  const dateRange = `${formatDate(startDate)} - ${current ? 'Présent' : formatDate(endDate)}`

  return (
    <div className="bg-gradient-to-r from-accent-50 to-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Icône de bénévolat */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-grow">
          {/* Titre et organisation */}
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-accent-700 font-medium">
            {organization}
          </p>

          {/* Localisation et dates */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
            {location && (
              <>
                <span>{location}</span>
                <span className="text-gray-400">•</span>
              </>
            )}
            <span>{dateRange}</span>
            {current && (
              <>
                <span className="text-gray-400">•</span>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-accent-100 text-accent-800 rounded">
                  Actif
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}