// Simple test page without next-intl
export default async function TestSimplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Test Simple - {locale}</h1>

      <div className="bg-green-100 p-4 rounded mb-6">
        <p className="text-green-800 font-semibold">✅ La route fonctionne!</p>
        <p>Locale détectée: <strong>{locale}</strong></p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Test des langues</h2>
        <nav className="flex gap-4">
          <a href="/fr/test-simple" className={`px-4 py-2 rounded ${locale === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            Français
          </a>
          <a href="/en/test-simple" className={`px-4 py-2 rounded ${locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            English
          </a>
        </nav>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Contenu dynamique selon la langue:</h2>
          {locale === 'fr' ? (
            <div>
              <p>Bonjour! Ceci est la version française.</p>
              <p>Le système de routing Next.js détecte automatiquement la langue depuis l'URL.</p>
            </div>
          ) : (
            <div>
              <p>Hello! This is the English version.</p>
              <p>Next.js routing system automatically detects the language from the URL.</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Navigation vers d'autres pages:</h3>
          <nav className="flex flex-col gap-2">
            <a href={`/${locale}`} className="text-blue-600 hover:underline">Accueil</a>
            <a href={`/${locale}/projects`} className="text-blue-600 hover:underline">Projets</a>
            <a href={`/${locale}/contact`} className="text-blue-600 hover:underline">Contact</a>
          </nav>
        </div>
      </div>
    </div>
  );
}