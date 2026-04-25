// Exemple de page projets complètement optimisée pour le SEO
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { generateMetadata as generateSEOMetadata, pageMetadata, SITE_CONFIG } from '@/lib/seo/metadata';
import { generatePageSchema, generateBreadcrumbSchema, generateProjectSchema } from '@/lib/seo/structured-data';
import StructuredData from '@/components/seo/StructuredData';
import OptimizedImage from '@/components/ui/OptimizedImage';
import ProjectCardMultilingual from '@/components/sections/ProjectCardMultilingual';

// Génération des métadonnées dynamiques pour le SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = pageMetadata.projects[locale as 'fr' | 'en'];

  // Récupérer le nombre de projets pour enrichir la description
  const projectCount = await prisma.project.count();

  return generateSEOMetadata({
    title: metadata.title,
    description: `${metadata.description} ${locale === 'fr' ? `Découvrez mes ${projectCount} projets.` : `Explore my ${projectCount} projects.`}`,
    keywords: metadata.keywords,
    ogImage: '/images/og-projects.jpg', // Image OG spécifique pour cette page
    locale,
    canonical: `${SITE_CONFIG.url}/${locale}/projects`,
    alternates: {
      fr: `${SITE_CONFIG.url}/fr/projects`,
      en: `${SITE_CONFIG.url}/en/projects`,
    },
  });
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const isFrench = locale === 'fr';

  // Récupérer les projets depuis la base de données
  const projects = await prisma.project.findMany({
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' }
    ],
  });

  // Textes multilingues
  const content = {
    title: isFrench ? 'Mes Projets & Réalisations' : 'My Projects & Achievements',
    subtitle: isFrench
      ? 'Découvrez mes projets web développés avec les dernières technologies'
      : 'Discover my web projects built with the latest technologies',
    featuredTitle: isFrench ? 'Projets en Vedette' : 'Featured Projects',
    allProjectsTitle: isFrench ? 'Tous les Projets' : 'All Projects',
    techStackTitle: isFrench ? 'Technologies Utilisées' : 'Tech Stack Used',
    viewProject: isFrench ? 'Voir le projet' : 'View project',
    viewCode: isFrench ? 'Code source' : 'Source code',
    noProjects: isFrench ? 'Aucun projet pour le moment.' : 'No projects yet.',
  };

  // Générer les données structurées pour la page
  const pageSchema = generatePageSchema(
    content.title,
    content.subtitle,
    `${SITE_CONFIG.url}/${locale}/projects`,
    locale,
    projects[0]?.updatedAt.toISOString()
  );

  // Générer le fil d'Ariane
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: isFrench ? 'Accueil' : 'Home',
      url: `${SITE_CONFIG.url}/${locale}`
    },
    {
      name: content.title,
      url: `${SITE_CONFIG.url}/${locale}/projects`
    }
  ], locale);

  // Séparer les projets featured et non-featured
  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <>
      {/* Injection des données structurées */}
      <StructuredData data={pageSchema} />
      <StructuredData data={breadcrumbSchema} />

      <div className="min-h-screen">
        {/* Hero Section avec H1 optimisé */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Fil d'Ariane visible */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {isFrench ? 'Accueil' : 'Home'}
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium" aria-current="page">
                  {isFrench ? 'Projets' : 'Projects'}
                </li>
              </ol>
            </nav>

            {/* Titre principal avec mots-clés */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content.title}
            </h1>

            {/* Description avec mots-clés secondaires */}
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
              {content.subtitle}
              {isFrench
                ? ' React, Next.js, Node.js, TypeScript et plus.'
                : ' React, Next.js, Node.js, TypeScript and more.'}
            </p>

            {/* Statistiques pour enrichir le contenu */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Projets réalisés' : 'Projects completed'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {[...new Set(projects.flatMap(p => p.technologies))].length}
                </div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Technologies' : 'Technologies'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {projects.filter(p => p.featured).length}
                </div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Projets vedettes' : 'Featured projects'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Code de qualité' : 'Quality code'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section des projets featured */}
        {featuredProjects.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {content.featuredTitle}
              </h2>

              <div className="grid gap-8 md:grid-cols-2">
                {featuredProjects.map((project) => {
                  // Générer les données structurées pour chaque projet
                  const projectSchema = generateProjectSchema(project, locale);

                  return (
                    <article key={project.id} className="relative">
                      <StructuredData data={projectSchema} />
                      <ProjectCardMultilingual
                        project={project}
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Section tous les projets */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {content.allProjectsTitle}
            </h2>

            {regularProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularProjects.map((project) => {
                  const projectSchema = generateProjectSchema(project, locale);

                  return (
                    <article key={project.id} className="relative">
                      <StructuredData data={projectSchema} />
                      <ProjectCardMultilingual project={project} />
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-12">
                {content.noProjects}
              </p>
            )}
          </div>
        </section>

        {/* Section technologies (contenu additionnel pour le SEO) */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {content.techStackTitle}
            </h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700">
                {isFrench
                  ? "En tant que développeur Full-Stack basé à Ottawa, j'utilise un large éventail de technologies modernes pour créer des applications web performantes et scalables. Mon expertise couvre le développement frontend avec React et Next.js, le backend avec Node.js et Express, ainsi que les bases de données SQL et NoSQL."
                  : "As a Full-Stack developer based in Ottawa, I use a wide range of modern technologies to create performant and scalable web applications. My expertise covers frontend development with React and Next.js, backend with Node.js and Express, as well as SQL and NoSQL databases."}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'].map((tech) => (
                  <div key={tech} className="bg-white p-4 rounded-lg shadow-sm text-center">
                    <span className="font-semibold text-gray-900">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isFrench
                ? "Vous avez un projet en tête ?"
                : "Have a project in mind?"}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {isFrench
                ? "Je suis disponible pour discuter de vos besoins et créer ensemble des solutions innovantes."
                : "I'm available to discuss your needs and create innovative solutions together."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {isFrench ? "Contactez-moi" : "Contact me"}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}