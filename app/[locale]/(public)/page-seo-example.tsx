// Exemple d'utilisation des métadonnées SEO améliorées
import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/seo/metadata';
import { generateWebSiteSchema, generatePageSchema } from '@/lib/seo/structured-data';
import StructuredData from '@/components/seo/StructuredData';

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = pageMetadata.home[locale as 'fr' | 'en'];

  return generateSEOMetadata({
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    locale,
    alternates: {
      fr: 'https://johnportfolio.com/fr',
      en: 'https://johnportfolio.com/en',
    },
  });
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  // Générer les données structurées
  const websiteSchema = generateWebSiteSchema(locale);
  const pageSchema = generatePageSchema(
    pageMetadata.home[locale as 'fr' | 'en'].title,
    pageMetadata.home[locale as 'fr' | 'en'].description,
    `https://johnportfolio.com/${locale}`,
    locale
  );

  // Contenu existant...

  return (
    <>
      {/* Injection des données structurées */}
      <StructuredData data={websiteSchema} />
      <StructuredData data={pageSchema} />

      {/* Votre contenu de page existant... */}
      <div className="w-full">
        {/* ... */}
      </div>
    </>
  );
}