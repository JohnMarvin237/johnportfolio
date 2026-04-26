import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/theme/ThemeContext'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

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

// Inline script to prevent flash of wrong theme and set lang attribute
const initScript = `
(function() {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  var l = localStorage.getItem('locale');
  if (l === 'en') document.documentElement.lang = 'en';
})();
`

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
