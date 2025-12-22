// app/page.tsx
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/sections/ProjectCard';
import ExperienceCard from '@/components/sections/ExperienceCard';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { fetchMultiple } from '@/lib/utils/fetch-wrapper';

/**
 * Page d'accueil du portfolio
 * Affiche Hero, projets featured, et expérience actuelle
 */
export default async function HomePage() {
  // Récupérer les données depuis les APIs avec gestion d'erreurs
  const results = await fetchMultiple({
    projects: '/projects?featured=true&limit=3',
    experiences: '/experiences?current=true&limit=1',
  }, { cache: 'no-store' });

  const featuredProjects = results.projects.data || [];
  const currentExperience = results.experiences.data || [];

  return (
    <div className="w-full">
      {/* Hero Section - Modern with Gradient Mesh */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

          {/* Animated gradient blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center animate-fadeInUp">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-lg mb-6 hover:scale-105 transition-transform duration-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Available for opportunities
              </span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
              Bonjour, je suis John Marvin
            </h1>

            <p className="text-2xl md:text-3xl mb-4 text-gray-800 dark:text-gray-200 font-semibold">
              Développeur Full-Stack & IA
            </p>

            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
              Passionné par les technologies web modernes et l'intelligence artificielle.
              Je crée des applications performantes et innovantes.
            </p>

            {/* CTA Buttons with Enhanced Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button
                  variant="primary"
                  size="lg"
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                >
                  Voir mes projets
                  <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 backdrop-blur-sm transition-all duration-300"
                >
                  Me contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Projets Featured Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Projets Featured
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez mes projets les plus récents et innovants
            </p>
          </div>

          {results.projects.error ? (
            <ErrorDisplay error={results.projects.error} />
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucun projet featured pour le moment.</p>
          )}

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button variant="outline" size="lg">
                Voir tous les projets →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Expérience Actuelle Section */}
      {currentExperience.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Expérience Actuelle
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <ExperienceCard experience={currentExperience[0]} />
            </div>

            <div className="text-center mt-12">
              <Link href="/experience">
                <Button variant="outline" size="lg">
                  Voir toute mon expérience →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Travaillons ensemble !
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Vous avez un projet en tête ? N'hésitez pas à me contacter pour en discuter.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Me contacter
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
