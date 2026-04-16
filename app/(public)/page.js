import Hero from '@/components/sections/Hero'
import ProjectCard from '@/components/sections/ProjectCard'
import ExperienceCard from '@/components/sections/ExperienceCard'
import Button from '@/components/ui/Button'
import T from '@/components/ui/T'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'

async function getFeaturedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      take: 3,
    })
    return projects
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

async function getRecentExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
      take: 2,
    })
    return experiences
  } catch (error) {
    console.error('Error fetching recent experiences:', error)
    return []
  }
}

export default async function HomePage() {
  const [featuredProjects, recentExperiences] = await Promise.all([
    getFeaturedProjects(),
    getRecentExperiences(),
  ])

  return (
    <>
      {/* Section Hero */}
      <Hero
        name="John"
        imageUrl="/images/profile/john.jpg"
      />

      {/* Section Projets Featured */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
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
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400"><T k="home.noFeatured" /></p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline">
                <T k="home.viewAllProjects" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Experiences recentes */}
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
            {recentExperiences.length > 0 ? (
              recentExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400"><T k="home.noExperience" /></p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/experience">
              <Button size="lg" variant="outline">
                <T k="home.viewAllExperience" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section CTA Contact */}
      <section className="py-20 bg-primary-600">
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
                <Button size="lg" variant="secondary">
                  <T k="home.ctaButton" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
