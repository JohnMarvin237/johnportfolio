import Button from '@/components/ui/Button'
import T from '@/components/ui/T'
import Link from 'next/link'

export const metadata = {
  title: 'About - John Portfolio',
  description: 'Learn more about John, a Full-Stack developer passionate about innovation',
}

export default function AboutPage() {
  return (
    <div className="py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <T k="about.title" />
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <T k="about.subtitle" />
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-900 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                <T k="about.hello" />
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <T k="about.intro1" />
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <T k="about.intro2" />
              </p>
            </div>
          </section>

          {/* Journey */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              <T k="about.journeyTitle" />
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><T k="about.journey1" /></p>
              <p><T k="about.journey2" /></p>
              <p><T k="about.journey3" /></p>
            </div>
          </section>

          {/* What I do */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              <T k="about.whatIDoTitle" />
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <T k="about.webDev" />
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <T k="about.webDevDesc" />
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <T k="about.ai" />
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <T k="about.aiDesc" />
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <T k="about.cloud" />
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <T k="about.cloudDesc" />
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <T k="about.mentoring" />
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <T k="about.mentoringDesc" />
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              <T k="about.valuesTitle" />
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white"><T k="about.quality" /></h3>
                  <p className="text-gray-700 dark:text-gray-400 mt-1">
                    <T k="about.qualityDesc" />
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white"><T k="about.innovation" /></h3>
                  <p className="text-gray-700 dark:text-gray-400 mt-1">
                    <T k="about.innovationDesc" />
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white"><T k="about.collaboration" /></h3>
                  <p className="text-gray-700 dark:text-gray-400 mt-1">
                    <T k="about.collaborationDesc" />
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              <T k="about.ctaTitle" />
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <T k="about.ctaDesc" />
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">
                  <T k="about.ctaContact" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  <T k="about.ctaProjects" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
