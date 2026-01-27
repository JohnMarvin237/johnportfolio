export interface Person {
  '@type': 'Person';
  name: string;
  jobTitle: string;
  email?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
  address?: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  knowsLanguage?: string[];
}

export interface WebPage {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  author?: Person;
  dateModified?: string;
}

export interface Article {
  '@type': 'Article';
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: Person;
}

export interface Project {
  '@type': 'CreativeWork';
  name: string;
  description: string;
  url?: string;
  image?: string;
  creator: Person;
  dateCreated?: string;
  keywords?: string[];
  programmingLanguage?: string[];
}

export interface BreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// Données personnelles de John
export const personSchema: Person = {
  '@type': 'Person',
  name: 'John Marvin',
  jobTitle: 'Développeur Full-Stack & IA',
  email: 'contact@johnportfolio.com', // Remplacez par votre email
  url: 'https://johnportfolio.com',
  image: 'https://johnportfolio.com/images/john-profile.jpg',
  sameAs: [
    'https://www.linkedin.com/in/john-marvin/', // Remplacez par vos vrais liens
    'https://github.com/johnmarvin',
    'https://twitter.com/johnmarvin',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ottawa',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  knowsLanguage: ['fr-CA', 'en-CA'],
};

// Fonction pour générer les données structurées du site web
export function generateWebSiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Portfolio John Marvin',
    description:
      locale === 'fr'
        ? 'Portfolio professionnel de John Marvin, développeur Full-Stack et IA'
        : 'Professional portfolio of John Marvin, Full-Stack and AI developer',
    url: 'https://johnportfolio.com',
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    author: personSchema,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://johnportfolio.com/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Fonction pour générer les données structurées d'une page
export function generatePageSchema(
  name: string,
  description: string,
  url: string,
  locale: string,
  dateModified?: string
): WebPage {
  return {
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Portfolio John Marvin',
      url: 'https://johnportfolio.com',
    },
    author: personSchema,
    dateModified: dateModified || new Date().toISOString(),
  };
}

// Fonction pour générer les données structurées d'un projet
export function generateProjectSchema(
  project: {
    title?: string | null;
    description?: string | null;
    technologies: string[];
    imageUrl?: string | null;
    demoUrl?: string | null;
    githubUrl?: string | null;
    startDate?: Date | null;
  },
  locale: string
): Project {
  return {
    '@type': 'CreativeWork',
    name: project.title || 'Untitled Project',
    description: project.description || '',
    url: (project.demoUrl ?? project.githubUrl) || undefined,
    image: project.imageUrl || undefined,
    creator: personSchema,
    dateCreated: project.startDate?.toISOString(),
    keywords: project.technologies,
    programmingLanguage: project.technologies,
  };
}

// Fonction pour générer un fil d'Ariane
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  locale: string
): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Fonction pour générer le schéma d'expérience professionnelle
export function generateEmploymentSchema(
  experience: {
    title: string;
    company: string;
    companyUrl?: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EmployeeRole',
    roleName: experience.title,
    startDate: experience.startDate.toISOString(),
    endDate: experience.current ? undefined : experience.endDate?.toISOString(),
    worksFor: {
      '@type': 'Organization',
      name: experience.company,
      url: experience.companyUrl,
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: experience.location,
        },
      },
    },
    description: experience.description,
    employee: personSchema,
  };
}

// Fonction pour générer le schéma d'éducation
export function generateEducationSchema(
  education: {
    degree: string;
    institution: string;
    field?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: education.degree,
    educationalLevel: education.degree,
    competencyRequired: education.field,
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: education.institution,
    },
    dateCreated: education.startDate.toISOString(),
  };
}