import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { locales } from '@/i18n/config';

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

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased bg-gray-50">
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
