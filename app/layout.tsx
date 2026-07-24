import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import ScrollProgress from '@/components/ui/ScrollProgress';
import PageTransition from '@/components/ui/PageTransition';
import { SITE_URL } from '@/lib/site-url';

const inter = Inter({ subsets: ['latin'] });

const DESCRIPTION = 'Portfolio professionnel de John, développeur Full-Stack spécialisé en React, Next.js et Node.js';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'John Portfolio - Développeur Full-Stack',
  description: DESCRIPTION,
  keywords: ['développeur', 'full-stack', 'react', 'next.js', 'portfolio', 'john'],
  authors: [{ name: 'John' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'John Portfolio - Développeur Full-Stack',
    description: DESCRIPTION,
    type: 'website',
    locale: 'fr_CA',
    url: SITE_URL,
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'John Portfolio' }],
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
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 64x64" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
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
