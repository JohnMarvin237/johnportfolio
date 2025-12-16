import ExperienceCard from '@/components/sections/ExperienceCard'
import EducationCard from '@/components/sections/EducationCard'
import CertificationCard from '@/components/sections/CertificationCard'
import VolunteerCard from '@/components/sections/VolunteerCard'
import { prisma } from '@/lib/db/prisma'

async function getExperienceData() {
  try {
    const [experiences, education, certifications, volunteer] = await Promise.all([
      prisma.experience.findMany({
        orderBy: [
          { current: 'desc' },
          { startDate: 'desc' }
        ],
      }),
      prisma.education.findMany({
        orderBy: [
          { current: 'desc' },
          { startDate: 'desc' }
        ],
      }),
      prisma.certification.findMany({
        orderBy: { issueDate: 'desc' },
      }),
      prisma.volunteer.findMany({
        orderBy: [
          { current: 'desc' },
          { startDate: 'desc' }
        ],
      }),
    ])

    return { experiences, education, certifications, volunteer }
  } catch (error) {
    console.error('Error fetching experience data:', error)
    return {
      experiences: [],
      education: [],
      certifications: [],
      volunteer: []
    }
  }
}

export const metadata = {
  title: 'Expérience - John Portfolio',
  description: 'Mon parcours professionnel, formations et certifications',
}

export default async function ExperiencePage() {
  const { experiences, education, certifications, volunteer } = await getExperienceData()

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Mon Parcours
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez mon parcours professionnel, mes formations et mes certifications.
            Chaque étape a contribué à façonner mes compétences actuelles.
          </p>
        </div>

        {/* Expériences professionnelles */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Expérience professionnelle
          </h2>
          {experiences.length > 0 ? (
            <div className="max-w-3xl">
              {experiences.map((experience, index) => (
                <div key={experience.id} className={index === experiences.length - 1 ? '' : 'mb-8'}>
                  <ExperienceCard experience={experience} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune expérience professionnelle ajoutée.</p>
          )}
        </section>

        {/* Formation */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Formation
          </h2>
          {education.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {education.map((edu) => (
                <EducationCard key={edu.id} education={edu} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune formation ajoutée.</p>
          )}
        </section>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              Certifications
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <CertificationCard key={cert.id} certification={cert} />
              ))}
            </div>
          </section>
        )}

        {/* Bénévolat */}
        {volunteer.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              Engagement bénévole
            </h2>
            <div className="space-y-6 max-w-3xl">
              {volunteer.map((vol) => (
                <VolunteerCard key={vol.id} volunteer={vol} />
              ))}
            </div>
          </section>
        )}

        {/* Section Compétences techniques */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Compétences techniques
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Frontend */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Frontend
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">React.js / Next.js</p>
                <p className="text-gray-600">Angular</p>
                <p className="text-gray-600">TypeScript / JavaScript</p>
                <p className="text-gray-600">HTML5 / CSS3 / Tailwind CSS</p>
                <p className="text-gray-600">Redux / Context API</p>
              </div>
            </div>

            {/* Backend */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Backend
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">Node.js / Express.js</p>
                <p className="text-gray-600">Python / Django / FastAPI</p>
                <p className="text-gray-600">PostgreSQL / MySQL / MongoDB</p>
                <p className="text-gray-600">GraphQL / REST APIs</p>
                <p className="text-gray-600">Prisma ORM</p>
              </div>
            </div>

            {/* DevOps & IA */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                DevOps & IA
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">Docker / Kubernetes</p>
                <p className="text-gray-600">AWS / Azure / GCP</p>
                <p className="text-gray-600">CI/CD / GitHub Actions</p>
                <p className="text-gray-600">TensorFlow / PyTorch</p>
                <p className="text-gray-600">Computer Vision / NLP</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}