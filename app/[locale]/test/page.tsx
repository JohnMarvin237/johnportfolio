// Simple test page to check routing
export default function TestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Test Page - Route fonctionne!</h1>
      <p className="text-xl">Cette page utilise le routing Next.js avec [locale]</p>
      <div className="mt-8 space-y-4">
        <p>Langue détectée depuis l'URL: Route dynamique [locale]</p>
        <nav className="flex gap-4">
          <a href="/fr/test" className="text-blue-600 hover:underline">FR</a>
          <a href="/en/test" className="text-blue-600 hover:underline">EN</a>
        </nav>
      </div>
    </div>
  );
}