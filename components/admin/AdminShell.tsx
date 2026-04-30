'use client';
// components/admin/AdminShell.tsx
// Main shell for all admin pages: fixed sidebar on desktop, toggle on mobile.
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';
import type { AdminUser } from '@/lib/admin/types';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Tableau de bord' },
  { href: '/admin/projects', label: 'Projets' },
  { href: '/admin/experiences', label: 'Expériences' },
  { href: '/admin/education', label: 'Formation' },
  { href: '/admin/certifications', label: 'Certifications' },
  { href: '/admin/volunteer', label: 'Bénévolat' },
  { href: '/admin/messages', label: 'Messages' },
];

interface AdminShellProps {
  children: React.ReactNode;
  user?: AdminUser | null;
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg
          transform transition-transform duration-200
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Admin Portfolio
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
                      ${
                        isActive(item.href)
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:pl-0 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 shadow-sm">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Ouvrir le menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:block" />

          {/* User + logout */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
            )}
            <LogoutButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
