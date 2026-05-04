import Navbar from '@/components/ui/Navbar';
import T from '@/components/ui/T';
import AdminBar from '@/components/ui/AdminBar';
import { getSettings } from '@/lib/db/settings';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/jwt';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;
  const adminName = payload?.role === 'admin' ? (payload.name || payload.email) : null;

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
      {adminName && <AdminBar name={adminName} />}
    </>
  );
}
