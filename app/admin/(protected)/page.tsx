'use client';
// app/admin/page.tsx — Dashboard with stats cards
import { useEffect, useState } from 'react';
import apiClient from '@/lib/admin/api-client';
import type { AdminStats } from '@/lib/admin/types';
import StatCard from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<AdminStats>('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Impossible de charger les statistiques.'));
  }, []);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tableau de bord</h1>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const cards = stats
    ? [
        { title: 'Projets', value: stats.projects, href: '/admin/projects' },
        { title: 'Expériences', value: stats.experiences, href: '/admin/experiences' },
        { title: 'Formation', value: stats.education, href: '/admin/education' },
        { title: 'Certifications', value: stats.certifications, href: '/admin/certifications' },
        { title: 'Bénévolat', value: stats.volunteer, href: '/admin/volunteer' },
        { title: 'Messages', value: stats.messages, href: '/admin/messages' },
        { title: 'Messages non lus', value: stats.unreadMessages, href: '/admin/messages?unread=true' },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tableau de bord</h1>

      {!stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
              <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <StatCard key={card.title} title={card.title} value={card.value} href={card.href} />
          ))}
        </div>
      )}
    </div>
  );
}
