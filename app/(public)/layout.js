import Navbar from '@/components/ui/Navbar'

export default function PublicLayout({ children }) {
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/about' },
    { name: 'Projets', href: '/projects' },
    { name: 'Expérience', href: '/experience' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <>
      <Navbar navigation={navigation} logo="John Portfolio" />
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} John Portfolio. Tous droits réservés.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}