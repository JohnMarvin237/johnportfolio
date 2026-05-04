import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import T from '@/components/ui/T';
import TrackPageView from '@/components/analytics/TrackPageView';

export const metadata: Metadata = {
  title: 'À propos - John Portfolio',
  description: "En savoir plus sur John, développeur Full-Stack passionné par l'innovation",
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-white dark:bg-gray-900 min-h-screen">
      <TrackPageView path="/about" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <T k="about.title" />
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <T k="about.subtitle" />
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <section className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 rounded-lg p-8 mb-8">
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

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              <T k="about.whatIDoTitle" />
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'about.webDev', desc: 'about.webDevDesc' },
                { title: 'about.ai', desc: 'about.aiDesc' },
                { title: 'about.cloud', desc: 'about.cloudDesc' },
                { title: 'about.mentoring', desc: 'about.mentoringDesc' },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <T k={title} />
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <T k={desc} />
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              <T k="about.valuesTitle" />
            </h2>
            <div className="space-y-6">
              {[
                { num: 1, title: 'about.quality', desc: 'about.qualityDesc' },
                { num: 2, title: 'about.innovation', desc: 'about.innovationDesc' },
                { num: 3, title: 'about.collaboration', desc: 'about.collaborationDesc' },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{num}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white"><T k={title} /></h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-1"><T k={desc} /></p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              <T k="about.ctaTitle" />
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <T k="about.ctaDesc" />
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button size="lg"><T k="about.ctaContact" /></Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg"><T k="about.ctaProjects" /></Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
