// Page affichant toutes les routes disponibles
export default async function AllRoutesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const publicRoutes = [
    { path: `/${locale}`, label: 'Accueil' },
    { path: `/${locale}/projects`, label: 'Projets' },
    { path: `/${locale}/experience`, label: 'Expérience' },
    { path: `/${locale}/contact`, label: 'Contact' },
  ];

  const adminRoutes = [
    { path: `/${locale}/admin/dashboard`, label: 'Dashboard Admin' },
    { path: `/${locale}/admin/projects`, label: 'Gestion Projets' },
    { path: `/${locale}/admin/experiences`, label: 'Gestion Expériences' },
    { path: `/${locale}/admin/education`, label: 'Gestion Formation' },
    { path: `/${locale}/admin/certifications`, label: 'Gestion Certifications' },
    { path: `/${locale}/admin/volunteer`, label: 'Gestion Bénévolat' },
    { path: `/${locale}/admin/messages`, label: 'Messages' },
  ];

  const testRoutes = [
    { path: `/${locale}/test-simple`, label: 'Test Simple' },
    { path: `/${locale}/demo-multilingual`, label: 'Démo Multilingue' },
    { path: `/${locale}/multilingual-summary`, label: 'Résumé Multilingue' },
    { path: `/${locale}/all-routes`, label: 'Cette page' },
  ];

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        {locale === 'fr' ? '🗺️ Toutes les Routes' : '🗺️ All Routes'}
      </h1>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
        <p className="text-green-800 font-semibold">
          ✅ {locale === 'fr' ? 'Toutes les pages sont accessibles!' : 'All pages are accessible!'}
        </p>
      </div>

      {/* Public Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'fr' ? 'Pages Publiques' : 'Public Pages'}
        </h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ul className="space-y-2">
            {publicRoutes.map(route => (
              <li key={route.path}>
                <a
                  href={route.path}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {route.label} - <code className="text-sm bg-gray-100 px-1 rounded">{route.path}</code>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Admin Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'fr' ? 'Pages Administration' : 'Admin Pages'}
        </h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ul className="space-y-2">
            {adminRoutes.map(route => (
              <li key={route.path}>
                <a
                  href={route.path}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {route.label} - <code className="text-sm bg-gray-100 px-1 rounded">{route.path}</code>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Test Routes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'fr' ? 'Pages de Test' : 'Test Pages'}
        </h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ul className="space-y-2">
            {testRoutes.map(route => (
              <li key={route.path}>
                <a
                  href={route.path}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {route.label} - <code className="text-sm bg-gray-100 px-1 rounded">{route.path}</code>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Routing Info */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'fr' ? 'Informations de Routing' : 'Routing Information'}
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p>
            <strong>{locale === 'fr' ? 'URL de base:' : 'Base URL:'}</strong> {' '}
            <code className="bg-gray-200 px-2 py-1 rounded">http://votre-domaine.com/{locale}</code>
          </p>
          <p>
            <strong>{locale === 'fr' ? 'Redirection automatique:' : 'Automatic redirect:'}</strong> {' '}
            <code className="bg-gray-200 px-2 py-1 rounded">/</code> → <code className="bg-gray-200 px-2 py-1 rounded">/{locale}</code>
          </p>
          <p>
            <strong>{locale === 'fr' ? 'Sans locale:' : 'Without locale:'}</strong> {' '}
            <code className="bg-gray-200 px-2 py-1 rounded">/projects</code> → <code className="bg-gray-200 px-2 py-1 rounded">/{locale}/projects</code>
          </p>
        </div>
      </section>
    </div>
  );
}