'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/providers/LocaleProvider';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * Barre de navigation multilingue
 */
export default function NavbarMultilingual() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const locale = useLocale() as 'fr' | 'en';

  // Navigation items based on locale
  const navItems = locale === 'fr'
    ? {
        home: 'Accueil',
        projects: 'Projets',
        experience: 'Expérience',
        contact: 'Contact'
      }
    : {
        home: 'Home',
        projects: 'Projects',
        experience: 'Experience',
        contact: 'Contact'
      };

  const navLinks = [
    { href: `/${locale}`, label: navItems.home },
    { href: `/${locale}/projects`, label: navItems.projects },
    { href: `/${locale}/experience`, label: navItems.experience },
    { href: `/${locale}/contact`, label: navItems.contact },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-bold text-xl text-gray-900 dark:text-white">
            John Portfolio
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">
              {locale === 'fr' ? 'Ouvrir le menu' : 'Open main menu'}
            </span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Theme and Language Controls */}
            <div className="px-3 py-2 border-t dark:border-gray-700 mt-2 pt-2 flex items-center justify-between">
              <ThemeToggle />
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}