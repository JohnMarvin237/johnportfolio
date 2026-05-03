import { MetadataRoute } from 'next'

const rawUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
const BASE_URL = rawUrl.startsWith('http')
  ? rawUrl
  : 'https://johnportfolio-git-main-johnmarvin237s-projects.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
