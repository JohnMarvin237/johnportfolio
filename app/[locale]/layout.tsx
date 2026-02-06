import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import NavbarMultilingual from "@/components/layout/NavbarMultilingual";
import FooterMultilingual from "@/components/layout/FooterMultilingual";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { loadTranslations } from "@/lib/i18n";
import ThemeScript from "../theme-script";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "John Portfolio - Développeur Full-Stack",
  description: "Portfolio professionnel de John, développeur Full-Stack passionné par les technologies web modernes et l'intelligence artificielle.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Load translations for the locale
  const messages = await loadTranslations(locale as 'fr' | 'en');

  return (
    <html lang={locale}>
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <LocaleProvider locale={locale} messages={messages}>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}