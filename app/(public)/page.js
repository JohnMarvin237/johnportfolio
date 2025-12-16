import Hero from '@/components/sections/Hero'
import ProjectCard from '@/components/sections/ProjectCard'
import ExperienceCard from '@/components/sections/ExperienceCard'
import Button from '@/components/ui/Button'
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
        title="Développeur Full-Stack & Expert IA"
        description="Passionné par la création d'applications web modernes et l'intégration de solutions d'intelligence artificielle pour résoudre des problèmes complexes."
        imageUrl="/images/profile/john.jpg"
      />

      {/* Section Projets Featured */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Projets en vedette
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez quelques-uns de mes projets les plus récents et innovants
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Aucun projet en vedette pour le moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline">
                Voir tous les projets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Expériences récentes */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Expérience professionnelle
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Mon parcours professionnel et mes réalisations récentes
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            {recentExperiences.length > 0 ? (
              recentExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune expérience disponible pour le moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/experience">
              <Button size="lg" variant="outline">
                Voir toute l'expérience
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
              Prêt à travailler ensemble ?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Je suis toujours ouvert aux nouvelles opportunités et collaborations
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Me contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}