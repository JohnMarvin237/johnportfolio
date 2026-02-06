// app/experience/page.tsx
import ExperienceCard from '@/components/sections/ExperienceCard';
import EducationCard from '@/components/sections/EducationCard';
import CertificationCard from '@/components/sections/CertificationCard';
import { getApiUrl } from '@/lib/utils';

/**
 * Page affichant l'expérience, la formation et les certifications
 */
export default async function ExperiencePage() {
  // Récupérer les données depuis les APIs
  const [experiencesRes, educationRes, certificationsRes] = await Promise.all([
    fetch(getApiUrl('/experiences'), { cache: 'no-store' }),
    fetch(getApiUrl('/education'), { cache: 'no-store' }),
    fetch(getApiUrl('/certifications'), { cache: 'no-store' }),
  ]);

  const experiences = experiencesRes.ok ? await experiencesRes.json() : [];
  const education = educationRes.ok ? await educationRes.json() : [];
  const certifications = certificationsRes.ok ? await certificationsRes.json() : [];

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Mon Parcours
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez mon expérience professionnelle, ma formation et mes certifications.
          </p>
        </div>

        {/* Section Expériences */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Expérience Professionnelle
          </h2>
          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {experiences.map((exp: any) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucune expérience pour le moment.</p>
          )}
        </section>

        {/* Section Formation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Formation Académique
          </h2>
          {education.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {education.map((edu: any) => (
                <EducationCard key={edu.id} education={edu} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucune formation pour le moment.</p>
          )}
        </section>

        {/* Section Certifications */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Certifications
          </h2>
          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert: any) => (
                <CertificationCard key={cert.id} certification={cert} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucune certification pour le moment.</p>
          )}
        </section>
      </div>
    </div>
  );
}
