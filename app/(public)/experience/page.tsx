import type { Metadata } from 'next';
import ExperienceCard from '@/components/sections/ExperienceCard';
import EducationCard from '@/components/sections/EducationCard';
import CertificationCard from '@/components/sections/CertificationCard';
import VolunteerCard from '@/components/sections/VolunteerCard';
import AnimateIn from '@/components/ui/AnimateIn';
import T from '@/components/ui/T';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import {
  resolveExperience,
  resolveEducation,
  resolveCertification,
  resolveVolunteer,
} from '@/lib/i18n/resolveLocale';

async function getExperienceData() {
  try {
    const [experiences, education, certifications, volunteer] = await Promise.all([
      prisma.experience.findMany({ orderBy: [{ current: 'desc' }, { startDate: 'desc' }] }),
      prisma.education.findMany({ orderBy: [{ current: 'desc' }, { startDate: 'desc' }] }),
      prisma.certification.findMany({ orderBy: { issueDate: 'desc' } }),
      prisma.volunteer.findMany({ orderBy: [{ current: 'desc' }, { startDate: 'desc' }] }),
    ]);
    return { experiences, education, certifications, volunteer };
  } catch (error) {
    console.error('Error fetching experience data:', error);
    return { experiences: [], education: [], certifications: [], volunteer: [] };
  }
}

export const metadata: Metadata = {
  title: 'Expérience - John Portfolio',
  description: 'Mon parcours professionnel, formations et certifications',
};

export default async function ExperiencePage() {
  const { experiences, education, certifications, volunteer } = await getExperienceData();
  const locale = (await cookies()).get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'fr';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedExp: any[] = experiences.map((e) => resolveExperience(e, locale));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedEdu: any[] = education.map((e) => resolveEducation(e, locale));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedCert: any[] = certifications.map((c) => resolveCertification(c, locale));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedVol: any[] = volunteer.map((v) => resolveVolunteer(v, locale));

  return (
    <div className="py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <T k="experience.title" />
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            <T k="experience.subtitle" />
          </p>
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
            <T k="experience.workTitle" />
          </h2>
          {resolvedExp.length > 0 ? (
            <div className="max-w-3xl">
              {resolvedExp.map((experience, index) => (
                <AnimateIn
                  key={experience.id}
                  variant="slide-left"
                  delay={Math.min(index * 0.05, 0.3)}
                  className={index === resolvedExp.length - 1 ? '' : 'mb-8'}
                >
                  <ExperienceCard experience={experience} />
                </AnimateIn>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400"><T k="experience.noWork" /></p>
          )}
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
            <T k="experience.educationTitle" />
          </h2>
          {resolvedEdu.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resolvedEdu.map((edu) => (
                <AnimateIn key={edu.id} variant="fade-up">
                  <EducationCard education={edu} />
                </AnimateIn>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400"><T k="experience.noEducation" /></p>
          )}
        </section>

        {resolvedCert.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
              <T k="experience.certTitle" />
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resolvedCert.map((cert) => (
                <AnimateIn key={cert.id} variant="fade-up">
                  <CertificationCard certification={cert} />
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        {resolvedVol.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
              <T k="experience.volunteerTitle" />
            </h2>
            <div className="space-y-6 max-w-3xl">
              {resolvedVol.map((vol) => (
                <AnimateIn key={vol.id} variant="fade-up">
                  <VolunteerCard volunteer={vol} />
                </AnimateIn>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
            <T k="experience.skillsTitle" />
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'experience.frontend', skills: ['React.js / Next.js', 'Angular', 'TypeScript / JavaScript', 'HTML5 / CSS3 / Tailwind CSS', 'Redux / Context API'] },
              { title: 'experience.backend', skills: ['Node.js / Express.js', 'Python / Django / FastAPI', 'PostgreSQL / MySQL / MongoDB', 'GraphQL / REST APIs', 'Prisma ORM'] },
              { title: 'experience.devopsAi', skills: ['Docker / Kubernetes', 'AWS / Azure / GCP', 'CI/CD / GitHub Actions', 'TensorFlow / PyTorch', 'Computer Vision / NLP'] },
            ].map(({ title, skills }) => (
              <div key={title} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  <T k={title} />
                </h3>
                <div className="space-y-2">
                  {skills.map((s) => <p key={s} className="text-gray-600 dark:text-gray-300">{s}</p>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
