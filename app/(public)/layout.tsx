import Navbar from '@/components/ui/Navbar';
import T from '@/components/ui/T';
import { getSettings } from '@/lib/db/settings';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <Navbar logo="John Portfolio" />
      <main className="min-h-screen">
        {children}
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} John Portfolio. <T k="footer.rights" />
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a
                href={settings.github_url ?? 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                GitHub
              </a>
              <a
                href={settings.linkedin_url ?? 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
