import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/prisma';
import { SITE_CONFIG } from '@/lib/seo/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const languages = SITE_CONFIG.languages;
  const lastModified = new Date();

  // Pages statiques principales
  const staticPages = [
    '',         // Home
    '/projects',
    '/experience',
    '/contact',
  ];

  // Générer les URLs pour chaque page statique et chaque langue
  const staticUrls: MetadataRoute.Sitemap = staticPages.flatMap(page =>
    languages.map(lang => ({
      url: `${baseUrl}/${lang}${page}`,
      lastModified,
      changeFrequency: page === '' ? 'weekly' : 'monthly' as const,
      priority: page === '' ? 1 : page === '/projects' || page === '/experience' ? 0.9 : 0.8,
      alternates: {
        languages: languages.reduce((acc, l) => {
          if (l !== SITE_CONFIG.defaultLocale) {
            acc[l] = `${baseUrl}/${l}${page}`;
          }
          return acc;
        }, {} as Record<string, string>),
      },
    }))
  );

  // Récupérer les projets dynamiques depuis la base de données
  let projectUrls: MetadataRoute.Sitemap = [];

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        updatedAt: true,
        featured: true,
      },
      orderBy: {
        featured: 'desc',
      },
    });

    projectUrls = projects.flatMap(project =>
      languages.map(lang => ({
        url: `${baseUrl}/${lang}/projects/${project.id}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: project.featured ? 0.8 : 0.6,
      }))
    );
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  // Récupérer les certifications
  let certificationUrls: MetadataRoute.Sitemap = [];

  try {
    const certifications = await prisma.certification.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });

    certificationUrls = certifications.flatMap(cert =>
      languages.map(lang => ({
        url: `${baseUrl}/${lang}/certifications/${cert.id}`,
        lastModified: cert.updatedAt,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      }))
    );
  } catch (error) {
    console.error('Error fetching certifications for sitemap:', error);
  }

  // Combiner toutes les URLs
  return [...staticUrls, ...projectUrls, ...certificationUrls];
}