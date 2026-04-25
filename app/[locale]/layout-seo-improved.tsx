import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import NavbarMultilingual from "@/components/layout/NavbarMultilingual";
import FooterMultilingual from "@/components/layout/FooterMultilingual";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { loadTranslations } from "@/lib/i18n";
import { generateMetadata as generateSEOMetadata, SITE_CONFIG } from "@/lib/seo/metadata";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Améliore le chargement des polices
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Métadonnées par défaut améliorées
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: locale === 'fr'
      ? 'John Portfolio - Développeur Full-Stack & IA Ottawa'
      : 'John Portfolio - Full-Stack & AI Developer Ottawa',
    description: locale === 'fr'
      ? 'Portfolio professionnel de John Marvin, développeur Full-Stack spécialisé en React, Next.js, Node.js et intelligence artificielle. Disponible pour projets à Ottawa-Gatineau.'
      : 'Professional portfolio of John Marvin, Full-Stack developer specialized in React, Next.js, Node.js and artificial intelligence. Available for projects in Ottawa-Gatineau.',
    keywords: locale === 'fr'
      ? ['développeur full-stack', 'développeur ottawa', 'react', 'next.js', 'portfolio', 'john marvin']
      : ['full-stack developer', 'ottawa developer', 'react', 'next.js', 'portfolio', 'john marvin'],
    locale,
  });
}

// Configuration du viewport pour mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await loadTranslations(locale as 'fr' | 'en');

  // Google Analytics ID (remplacez par le vôtre)
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Préconnexion aux domaines externes pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon et icônes */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Couleur de thème pour mobile */}
        <meta name="theme-color" content="#3b82f6" />

        {/* Vérification propriété (remplacez par vos propres codes) */}
        <meta name="google-site-verification" content="votre-code-google" />
        <meta name="msvalidate.01" content="votre-code-bing" />
      </head>

      <body className="antialiased bg-gray-50 text-gray-900">
        {/* Skip to content link pour l'accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          {locale === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}
        </a>

        <LocaleProvider locale={locale} messages={messages}>
          <AnalyticsProvider>
            {/* Navigation */}
            <NavbarMultilingual />

            {/* Contenu principal avec landmark ARIA */}
            <main id="main-content" role="main">
              {children}
            </main>

            {/* Footer */}
            <FooterMultilingual />
          </AnalyticsProvider>
        </LocaleProvider>

        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `}
            </Script>
          </>
        )}

        {/* Scripts pour améliorer les performances */}
        <Script id="performance-observer" strategy="afterInteractive">
          {`
            // Observer pour les images lazy-loaded
            if ('IntersectionObserver' in window) {
              const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                  }
                });
              });

              document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}