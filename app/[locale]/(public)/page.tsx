// app/[locale]/page.tsx - Version simple sans next-intl
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const isFrench = locale === 'fr';

  // Textes multilingues simples
  const content = {
    greeting: isFrench ? "Bonjour, je suis" : "Hello, I'm",
    title: isFrench ? "Développeur Full-Stack" : "Full-Stack Developer",
    description: isFrench
      ? "Passionné par les technologies web modernes et l'intelligence artificielle"
      : "Passionate about modern web technologies and artificial intelligence",
    viewProjects: isFrench ? "Voir mes projets" : "View my projects",
    contactMe: isFrench ? "Me contacter" : "Contact me",
    projectsTitle: isFrench ? "Projets en vedette" : "Featured Projects",
    projectsDescription: isFrench ? "Découvrez mes réalisations récentes" : "Discover my recent work",
    experienceTitle: isFrench ? "Expérience Actuelle" : "Current Experience",
    ctaTitle: isFrench ? "Travaillons ensemble !" : "Let's work together!",
    ctaDescription: isFrench
      ? "Vous avez un projet en tête ? N'hésitez pas à me contacter pour en discuter."
      : "Have a project in mind? Feel free to contact me to discuss it."
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isFrench ? "Disponible pour de nouvelles opportunités" : "Available for opportunities"}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              {content.greeting} John Marvin
            </h1>

            <p className="text-2xl md:text-3xl mb-4 text-gray-800 dark:text-gray-200 font-semibold">
              {content.title}
            </p>

            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/projects`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {content.viewProjects}
                </Button>
              </Link>

              <Link href={`/${locale}/contact`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  {content.contactMe}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.projectsTitle}
            </h2>
            <p className="text-lg text-gray-600">
              {content.projectsDescription}
            </p>
          </div>

          <div className="text-center">
            <Link href={`/${locale}/projects`}>
              <Button variant="outline" size="lg">
                {isFrench ? "Voir tous les projets" : "View all projects"} →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.ctaTitle}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {content.ctaDescription}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button
              variant="secondary"
              size="lg"
              className="!bg-white !text-blue-600 hover:!bg-blue-50 !shadow-lg hover:!shadow-xl"
            >
              {content.contactMe}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}