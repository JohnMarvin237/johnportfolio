import Card from '../ui/Card'

/**
 * Carte d'affichage d'une certification
 * @param {Object} props
 * @param {Object} props.certification - Données de la certification
 * @param {string} props.certification.id
 * @param {string} props.certification.title
 * @param {string} props.certification.issuer
 * @param {Date} props.certification.issueDate
 * @param {Date} props.certification.expiryDate
 * @param {string} props.certification.credentialId
 * @param {string} props.certification.credentialUrl
 * @param {string} props.certification.description
 * @param {string[]} props.certification.skills
 */
export default function CertificationCard({ certification }) {
  if (!certification) return null

  const {
    title,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    description,
    skills = []
  } = certification

  // Formatter les dates
  const formatDate = (date) => {
    if (!date) return ''
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('fr-CA', { year: 'numeric', month: 'short' })
  }

  // Vérifier si la certification est expirée
  const isExpired = expiryDate && new Date(expiryDate) < new Date()

  return (
    <Card className={`h-full ${isExpired ? 'opacity-75' : ''}`}>
      {/* Badge d'expiration */}
      {isExpired && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
            Expirée
          </span>
        </div>
      )}

      {/* Icône de certification */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Titre et émetteur */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 mt-1">
          {issuer}
        </p>
      </div>

      {/* Dates */}
      <div className="text-sm text-gray-500 mb-3">
        <p>Délivrée le {formatDate(issueDate)}</p>
        {expiryDate && (
          <p>
            {isExpired ? 'Expirée le' : 'Expire le'} {formatDate(expiryDate)}
          </p>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3">
          {description}
        </p>
      )}

      {/* Compétences */}
      {skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Compétences validées :</p>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Liens */}
      <div className="mt-auto pt-4">
        {credentialUrl && (
          <a
            href={credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Voir la certification
            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {credentialId && !credentialUrl && (
          <p className="text-xs text-gray-500">
            ID: {credentialId}
          </p>
        )}
      </div>
    </Card>
  )
}