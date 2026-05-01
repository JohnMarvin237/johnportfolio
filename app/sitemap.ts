import { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://johnportfolio-git-main-johnmarvin237s-projects.vercel.app'

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',           priority: 1.0, changeFrequency: 'monthly' },
  { path: '/about',     priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects',  priority: 0.9, changeFrequency: 'weekly'  },
  { path: '/experience',priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact',   priority: 0.6, changeFrequency: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
