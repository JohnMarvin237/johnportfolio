// app/[locale]/test-contrast/page.tsx
export default function TestContrastPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Test de Contraste</h1>

      {/* Test des différentes combinaisons de couleurs */}
      <div className="space-y-4">
        <div className="p-4 bg-white">
          <p className="text-white">❌ Texte blanc sur fond blanc</p>
        </div>

        <div className="p-4 bg-gray-100">
          <p className="text-gray-200">❌ Texte gris clair sur fond gris clair</p>
        </div>

        <div className="p-4 bg-blue-50">
          <p className="text-blue-100">❌ Texte bleu clair sur fond bleu très clair</p>
        </div>

        <div className="p-4 bg-white">
          <p className="text-black">✅ Texte noir sur fond blanc (bon contraste)</p>
        </div>

        <div className="p-4 bg-blue-600">
          <p className="text-white">✅ Texte blanc sur fond bleu (bon contraste)</p>
        </div>
      </div>

      {/* Test des boutons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test des boutons</h2>

        {/* Hero section simulation */}
        <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Disponible pour de nouvelles opportunités
            </span>
          </div>
          <p className="text-gray-600">Texte sur fond dégradé clair</p>
        </div>

        {/* Language switcher test */}
        <div className="p-4 bg-white">
          <h3>Language Switcher sur fond blanc:</h3>
          <div className="flex items-center space-x-1 mt-2">
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white shadow-sm">
              FR
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}