import { prisma } from '@/lib/db/prisma'
import T from './T'

async function getSocialLinks(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: ['social_github', 'social_linkedin', 'social_twitter'] } },
    })
    const result: Record<string, string> = {}
    rows.forEach((row) => { result[row.key] = row.value })
    return result
  } catch {
    return {}
  }
}

export default async function Footer() {
  const links = await getSocialLinks()

  const github = links.social_github || null
  const linkedin = links.social_linkedin || null
  const twitter = links.social_twitter || null

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} John Portfolio. <T k="footer.rights" />
          </p>
          {(github || linkedin || twitter) && (
            <div className="mt-4 flex justify-center space-x-6">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  LinkedIn
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Twitter / X
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
