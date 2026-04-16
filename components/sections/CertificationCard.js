import Card from '../ui/Card'
import T from '../ui/T'
import { formatDate } from '@/lib/utils'

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

  const isExpired = expiryDate && new Date(expiryDate) < new Date()

  return (
    <Card className={`h-full relative ${isExpired ? 'opacity-75' : ''}`}>
      {/* Expiry badge */}
      {isExpired && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
            <T k="experience.expired" />
          </span>
        </div>
      )}

      {/* Certification icon */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Title and issuer */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {issuer}
        </p>
      </div>

      {/* Dates */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        <p><T k="experience.issuedOn" /> {formatDate(issueDate, 'fr-CA', 'short')}</p>
        {expiryDate && (
          <p>
            {isExpired ? <T k="experience.expiredOn" /> : <T k="experience.expiresOn" />} {formatDate(expiryDate, 'fr-CA', 'short')}
          </p>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2"><T k="experience.validatedSkills" /></p>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="mt-auto pt-4">
        {credentialUrl && (
          <a
            href={credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            <T k="experience.viewCert" />
            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {credentialId && !credentialUrl && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ID: {credentialId}
          </p>
        )}
      </div>
    </Card>
  )
}
