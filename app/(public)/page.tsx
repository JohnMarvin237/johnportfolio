import Hero from '@/components/sections/Hero';
import ProjectCard from '@/components/sections/ProjectCard';
import ExperienceCard from '@/components/sections/ExperienceCard';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import T from '@/components/ui/T';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import { resolveProject, resolveExperience } from '@/lib/i18n/resolveLocale';
import { getSettings } from '@/lib/db/settings';
import TrackPageView from '@/components/analytics/TrackPageView';

async function getFeaturedProjects() {
  try {
    return await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      take: 3,
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

async function getRecentExperiences() {
  try {
    return await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
      take: 2,
    });
  } catch (error) {
    console.error('Error fetching recent experiences:', error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProjects, recentExperiences, settings] = await Promise.all([
    getFeaturedProjects(),
    getRecentExperiences(),
    getSettings(),
  ]);
  const locale = (await cookies()).get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'fr';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedProjects: any[] = featuredProjects.map((p) => resolveProject(p, locale));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedExperiences: any[] = recentExperiences.map((e) => resolveExperience(e, locale));

  return (
    <>
      <TrackPageView path="/" />
      <Hero
        name="John"
        imageUrl="/images/profile/john.jpg"
        githubUrl={settings.github_url}
        linkedinUrl={settings.linkedin_url}
      />

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              <T k="home.featuredTitle" />
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              <T k="home.featuredDesc" />
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resolvedProjects.length > 0 ? (
              resolvedProjects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400"><T k="home.noFeatured" /></p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline"><T k="home.viewAllProjects" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              <T k="home.experienceTitle" />
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              <T k="home.experienceDesc" />
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            {resolvedExperiences.length > 0 ? (
              resolvedExperiences.map((experience) => <ExperienceCard key={experience.id} experience={experience} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400"><T k="home.noExperience" /></p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/experience">
              <Button size="lg" variant="outline"><T k="home.viewAllExperience" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              <T k="home.ctaTitle" />
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              <T k="home.ctaDesc" />
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg" variant="secondary"><T k="home.ctaButton" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
