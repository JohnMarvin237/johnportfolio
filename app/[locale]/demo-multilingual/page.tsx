// Demo page showing multilingual content from database
import { getLocalizedProjects, getLocalizedExperiences } from '@/lib/utils/multilingual';

// Simulate fetching from database (replace with actual Prisma calls)
async function getProjects() {
  // This would normally be: await prisma.project.findMany()
  return [
    {
      id: '1',
      title_fr: 'Portfolio Next.js',
      title_en: 'Next.js Portfolio',
      description_fr: 'Un portfolio moderne développé avec Next.js et PostgreSQL',
      description_en: 'A modern portfolio built with Next.js and PostgreSQL',
      longDesc_fr: 'Ce projet démontre mes compétences en développement Full-Stack...',
      longDesc_en: 'This project showcases my Full-Stack development skills...',
      technologies: ['Next.js', 'React', 'PostgreSQL', 'Prisma'],
      featured: true
    },
    {
      id: '2',
      title_fr: 'Application de Gestion',
      title_en: 'Management Application',
      description_fr: 'Une application web pour la gestion de projets',
      description_en: 'A web application for project management',
      technologies: ['React', 'Node.js', 'MongoDB'],
      featured: true
    }
  ];
}

async function getExperiences() {
  return [
    {
      id: '1',
      title_fr: 'Développeur Full-Stack',
      title_en: 'Full-Stack Developer',
      company: 'TechCorp',
      description_fr: 'Développement d\'applications web modernes',
      description_en: 'Development of modern web applications',
      achievements_fr: ['Optimisation des performances', 'Migration vers le cloud'],
      achievements_en: ['Performance optimization', 'Cloud migration'],
      current: true
    }
  ];
}

export default async function DemoMultilingualPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as 'fr' | 'en';

  // Fetch data
  const projects = await getProjects();
  const experiences = await getExperiences();

  // Get localized content
  const localizedProjects = getLocalizedProjects(projects, currentLocale);
  const localizedExperiences = getLocalizedExperiences(experiences, currentLocale);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        {currentLocale === 'fr' ? 'Contenu Multilingue' : 'Multilingual Content'}
      </h1>

      {/* Language Switcher */}
      <div className="mb-8 flex gap-4">
        <a
          href="/fr/demo-multilingual"
          className={`px-4 py-2 rounded ${
            currentLocale === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Français
        </a>
        <a
          href="/en/demo-multilingual"
          className={`px-4 py-2 rounded ${
            currentLocale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          English
        </a>
      </div>

      {/* Projects Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          {currentLocale === 'fr' ? 'Projets' : 'Projects'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localizedProjects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 text-sm rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {currentLocale === 'fr' ? 'Expériences' : 'Experiences'}
        </h2>
        <div className="space-y-6">
          {localizedExperiences.map(experience => (
            <div key={experience.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">
                {experience.title} @ {experience.company}
              </h3>
              <p className="text-gray-600 mb-4">{experience.description}</p>
              {experience.achievements && (
                <ul className="list-disc list-inside space-y-1">
                  {experience.achievements.map((achievement: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Info Box */}
      <div className="mt-12 p-6 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">
          {currentLocale === 'fr' ? '✅ Système Multilingue Actif' : '✅ Multilingual System Active'}
        </h3>
        <p className="text-green-700">
          {currentLocale === 'fr'
            ? 'Le contenu s\'adapte automatiquement selon la langue détectée dans l\'URL.'
            : 'Content automatically adapts based on the language detected in the URL.'}
        </p>
      </div>
    </div>
  );
}