import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
  locale: string;
  alternates?: { [key: string]: string };
}

export const SITE_CONFIG = {
  name: 'John Portfolio',
  author: 'John Marvin',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://johnportfolio.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@johnmarvin', // Remplacez par votre handle Twitter
  languages: ['fr', 'en'],
  defaultLocale: 'fr',
};

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  noindex = false,
  canonical,
  locale,
  alternates,
}: SEOConfig): Metadata {
  const isDefaultLocale = locale === SITE_CONFIG.defaultLocale;
  const fullTitle = isDefaultLocale
    ? `${title} | ${SITE_CONFIG.name}`
    : `${title} | ${SITE_CONFIG.name} - ${locale.toUpperCase()}`;

  const canonicalUrl = canonical || `${SITE_CONFIG.url}${!isDefaultLocale ? `/${locale}` : ''}`;

  // Générer les liens alternates pour chaque langue
  const languageAlternates = SITE_CONFIG.languages.reduce((acc, lang) => {
    if (alternates?.[lang]) {
      acc[lang] = alternates[lang];
    } else {
      acc[lang] = `${SITE_CONFIG.url}/${lang}`;
    }
    return acc;
  }, {} as { [key: string]: string });

  const metadata: Metadata = {
    title: {
      default: fullTitle,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description,
    keywords: keywords?.join(', '),
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.author,
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage || SITE_CONFIG.defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: SITE_CONFIG.twitterHandle,
      images: [ogImage || SITE_CONFIG.defaultImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    metadataBase: new URL(SITE_CONFIG.url),
  };

  return metadata;
}

// Métadonnées spécifiques pour chaque type de page
export const pageMetadata = {
  home: {
    fr: {
      title: 'Développeur Full-Stack & IA - Ottawa',
      description: 'Portfolio de John Marvin, développeur Full-Stack spécialisé en React, Next.js, Node.js et IA. Disponible pour des projets à Ottawa-Gatineau.',
      keywords: ['développeur full-stack', 'développeur react', 'développeur next.js', 'développeur ottawa', 'développeur IA', 'portfolio développeur', 'john marvin'],
    },
    en: {
      title: 'Full-Stack & AI Developer - Ottawa',
      description: 'Portfolio of John Marvin, Full-Stack developer specialized in React, Next.js, Node.js and AI. Available for projects in Ottawa-Gatineau.',
      keywords: ['full-stack developer', 'react developer', 'next.js developer', 'ottawa developer', 'AI developer', 'developer portfolio', 'john marvin'],
    },
  },
  projects: {
    fr: {
      title: 'Projets & Réalisations',
      description: 'Découvrez mes projets web et applications développés avec React, Next.js, Node.js et les dernières technologies.',
      keywords: ['projets web', 'portfolio projets', 'réalisations développeur', 'applications react', 'projets next.js'],
    },
    en: {
      title: 'Projects & Achievements',
      description: 'Discover my web projects and applications developed with React, Next.js, Node.js and the latest technologies.',
      keywords: ['web projects', 'portfolio projects', 'developer achievements', 'react applications', 'next.js projects'],
    },
  },
  experience: {
    fr: {
      title: 'Expérience Professionnelle',
      description: 'Mon parcours professionnel en développement Full-Stack, IA et mes expériences en entreprise.',
      keywords: ['expérience développeur', 'parcours professionnel', 'cv développeur', 'expérience full-stack'],
    },
    en: {
      title: 'Professional Experience',
      description: 'My professional journey in Full-Stack development, AI and my corporate experiences.',
      keywords: ['developer experience', 'professional journey', 'developer cv', 'full-stack experience'],
    },
  },
  contact: {
    fr: {
      title: 'Contact',
      description: 'Contactez-moi pour discuter de votre projet. Je suis disponible pour des missions freelance et des opportunités à Ottawa-Gatineau.',
      keywords: ['contact développeur', 'freelance ottawa', 'embaucher développeur', 'contact john marvin'],
    },
    en: {
      title: 'Contact',
      description: 'Contact me to discuss your project. I am available for freelance missions and opportunities in Ottawa-Gatineau.',
      keywords: ['developer contact', 'freelance ottawa', 'hire developer', 'contact john marvin'],
    },
  },
};