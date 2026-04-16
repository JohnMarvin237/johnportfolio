import ExperienceCard from '@/components/sections/ExperienceCard'
import EducationCard from '@/components/sections/EducationCard'
import CertificationCard from '@/components/sections/CertificationCard'
import VolunteerCard from '@/components/sections/VolunteerCard'
import T from '@/components/ui/T'
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
  title: 'Experience - John Portfolio',
  description: 'My professional journey, education, and certifications',
}

export default async function ExperiencePage() {
  const { experiences, education, certifications, volunteer } = await getExperienceData()

  return (
    <div className="py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <T k="experience.title" />
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            <T k="experience.subtitle" />
          </p>
        </div>

        {/* Work Experience */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
            <T k="experience.workTitle" />
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
            <p className="text-gray-500 dark:text-gray-400"><T k="experience.noWork" /></p>
          )}
        </section>

        {/* Education */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
            <T k="experience.educationTitle" />
          </h2>
          {education.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {education.map((edu) => (
                <EducationCard key={edu.id} education={edu} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400"><T k="experience.noEducation" /></p>
          )}
        </section>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
              <T k="experience.certTitle" />
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <CertificationCard key={cert.id} certification={cert} />
              ))}
            </div>
          </section>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
              <T k="experience.volunteerTitle" />
            </h2>
            <div className="space-y-6 max-w-3xl">
              {volunteer.map((vol) => (
                <VolunteerCard key={vol.id} volunteer={vol} />
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
            <T k="experience.skillsTitle" />
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <T k="experience.frontend" />
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">React.js / Next.js</p>
                <p className="text-gray-600 dark:text-gray-400">Angular</p>
                <p className="text-gray-600 dark:text-gray-400">TypeScript / JavaScript</p>
                <p className="text-gray-600 dark:text-gray-400">HTML5 / CSS3 / Tailwind CSS</p>
                <p className="text-gray-600 dark:text-gray-400">Redux / Context API</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <T k="experience.backend" />
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Node.js / Express.js</p>
                <p className="text-gray-600 dark:text-gray-400">Python / Django / FastAPI</p>
                <p className="text-gray-600 dark:text-gray-400">PostgreSQL / MySQL / MongoDB</p>
                <p className="text-gray-600 dark:text-gray-400">GraphQL / REST APIs</p>
                <p className="text-gray-600 dark:text-gray-400">Prisma ORM</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <T k="experience.devopsAi" />
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Docker / Kubernetes</p>
                <p className="text-gray-600 dark:text-gray-400">AWS / Azure / GCP</p>
                <p className="text-gray-600 dark:text-gray-400">CI/CD / GitHub Actions</p>
                <p className="text-gray-600 dark:text-gray-400">TensorFlow / PyTorch</p>
                <p className="text-gray-600 dark:text-gray-400">Computer Vision / NLP</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
