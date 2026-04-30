import type { Metadata } from 'next';
import ContactForm from '@/components/sections/ContactForm';
import T from '@/components/ui/T';
import { getSettings } from '@/lib/db/settings';

export const metadata: Metadata = {
  title: 'Contact - John Portfolio',
  description: 'Contactez-moi pour discuter de vos projets ou opportunités de collaboration',
};

export default async function ContactPage() {
  const settings = await getSettings();
  const githubUrl = settings.github_url ?? 'https://github.com';
  const linkedinUrl = settings.linkedin_url ?? 'https://linkedin.com';

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <T k="contact.title" />
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <T k="contact.subtitle" />
          </p>
        </div>

        <div className="mt-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <T k="contact.infoTitle" />
                </h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200"><T k="contact.email" /></h3>
                    </div>
                    <a href={`mailto:${settings.contact_email}`} className="text-gray-600 dark:text-gray-400 ml-7 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {settings.contact_email}
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200"><T k="contact.location" /></h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-7"><T k="contact.locationValue" /></p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200"><T k="contact.availability" /></h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-7"><T k="contact.availabilityValue" /></p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-4">
                    <T k="contact.findMe" />
                  </h3>
                  <div className="flex space-x-4">
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="GitHub">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="LinkedIn">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-4">
                    <T k="contact.faq" />
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300"><T k="contact.responseTime" /></p>
                      <p className="text-sm text-gray-600 dark:text-gray-400"><T k="contact.responseTimeValue" /></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300"><T k="contact.projectTypes" /></p>
                      <p className="text-sm text-gray-600 dark:text-gray-400"><T k="contact.projectTypesValue" /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  <T k="contact.sendMessage" />
                </h2>
                <ContactForm contactEmail={settings.contact_email ?? ''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
