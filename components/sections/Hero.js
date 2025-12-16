import Button from '../ui/Button'
import Link from 'next/link'

/**
 * Section Hero pour la page d'accueil
 * @param {Object} props
 * @param {string} props.name - Nom à afficher
 * @param {string} props.title - Titre professionnel
 * @param {string} props.description - Description courte
 * @param {string} props.imageUrl - URL de l'image de profil
 */
export default function Hero({
  name = 'John Doe',
  title = 'Développeur Full-Stack',
  description = 'Passionné par la création d\'applications web modernes et performantes',
  imageUrl
}) {
  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Contenu texte */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Bonjour, je suis{' '}
              <span className="text-primary-600">{name}</span>
            </h1>
            <p className="mt-4 text-2xl text-gray-600">
              {title}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {description}
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link href="/projects">
                <Button size="lg">
                  Voir mes projets
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Me contacter
                </Button>
              </Link>
            </div>

            {/* Liens sociaux */}
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="mt-10 lg:mt-0">
              <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 lg:w-full lg:h-full max-w-md">
                <div className="absolute inset-0 bg-primary-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <img
                  src={imageUrl}
                  alt={name}
                  className="relative rounded-full object-cover w-full h-full shadow-2xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}