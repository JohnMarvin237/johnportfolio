import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'John Portfolio - Développeur Full-Stack',
  description: 'Portfolio professionnel de John, développeur Full-Stack spécialisé en React, Next.js et Node.js',
  keywords: ['développeur', 'full-stack', 'react', 'next.js', 'portfolio', 'john'],
  authors: [{ name: 'John' }],
  openGraph: {
    title: 'John Portfolio - Développeur Full-Stack',
    description: 'Portfolio professionnel de John, développeur Full-Stack spécialisé en React, Next.js et Node.js',
    type: 'website',
    locale: 'fr_CA',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}