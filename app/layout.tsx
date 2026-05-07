import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import ScrollProgress from '@/components/ui/ScrollProgress';
import PageTransition from '@/components/ui/PageTransition';

const inter = Inter({ subsets: ['latin'] });

const rawUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
const BASE_URL = rawUrl.startsWith('http') ? rawUrl : 'http://localhost:3000';

const DESCRIPTION = 'Portfolio professionnel de John, développeur Full-Stack spécialisé en React, Next.js et Node.js';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'John Portfolio - Développeur Full-Stack',
  description: DESCRIPTION,
  keywords: ['développeur', 'full-stack', 'react', 'next.js', 'portfolio', 'john'],
  authors: [{ name: 'John' }],
  openGraph: {
    title: 'John Portfolio - Développeur Full-Stack',
    description: DESCRIPTION,
    type: 'website',
    locale: 'fr_CA',
    url: BASE_URL,
    images: [{ url: '/opengraph-image.png', width: 752, height: 1408, alt: 'John Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Portfolio - Développeur Full-Stack',
    description: DESCRIPTION,
    images: ['/opengraph-image.png'],
  },
};

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
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ScrollProgress />
        <ThemeProvider>
          <LanguageProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
