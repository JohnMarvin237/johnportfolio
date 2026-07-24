import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',           priority: 1.0, changeFrequency: 'monthly' },
  { path: '/about',     priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects',  priority: 0.9, changeFrequency: 'weekly'  },
  { path: '/experience',priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact',   priority: 0.6, changeFrequency: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
