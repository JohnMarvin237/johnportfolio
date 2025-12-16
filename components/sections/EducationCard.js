import Card from '../ui/Card'

/**
 * Carte d'affichage d'une formation
 * @param {Object} props
 * @param {Object} props.education - Données de la formation
 * @param {string} props.education.id
 * @param {string} props.education.degree
 * @param {string} props.education.institution
 * @param {string} props.education.location
 * @param {Date} props.education.startDate
 * @param {Date} props.education.endDate
 * @param {boolean} props.education.current
 * @param {string} props.education.description
 * @param {string} props.education.field
 * @param {string} props.education.note
 */
export default function EducationCard({ education }) {
  if (!education) return null

  const {
    degree,
    institution,
    location,
    startDate,
    endDate,
    current,
    description,
    field,
    note
  } = education

  // Formatter les dates
  const formatDate = (date) => {
    if (!date) return ''
    const dateObj = new Date(date)
    return dateObj.getFullYear()
  }

  const dateRange = `${formatDate(startDate)} - ${current ? 'En cours' : formatDate(endDate)}`

  return (
    <Card className="h-full">
      {/* En-tête */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {degree}
        </h3>
        {field && (
          <p className="text-sm text-primary-600 font-medium mt-1">
            {field}
          </p>
        )}
      </div>

      {/* Institution et localisation */}
      <div className="mb-3">
        <p className="text-gray-700 font-medium">
          {institution}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <span>{location}</span>
          <span className="text-gray-400">•</span>
          <span>{dateRange}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3">
          {description}
        </p>
      )}

      {/* Note */}
      {note && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note :</span> {note}
          </p>
        </div>
      )}

      {/* Indicateur de formation en cours */}
      {current && (
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <span className="mr-1.5 h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
            En cours
          </span>
        </div>
      )}
    </Card>
  )
}