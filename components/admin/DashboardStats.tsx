'use client';

import { useEffect, useState, useCallback } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';

interface AdminStats {
  projectsCount: number;
  experiencesCount: number;
  educationCount: number;
  certificationsCount: number;
  volunteerCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
  featuredProjectsCount: number;
  totalVisitors: number;
  totalPageViews: number;
  todayVisitors: number;
  todayPageViews: number;
}

const EMPTY_STATS: AdminStats = {
  projectsCount: 0,
  experiencesCount: 0,
  educationCount: 0,
  certificationsCount: 0,
  volunteerCount: 0,
  messagesCount: 0,
  unreadMessagesCount: 0,
  featuredProjectsCount: 0,
  totalVisitors: 0,
  totalPageViews: 0,
  todayVisitors: 0,
  todayPageViews: 0,
};

export default function DashboardStats() {
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const getAuthHeaders = useAuthHeaders();

  const fetchStats = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      setLoading(false);
      return;
    }

    try {
      setError('');
      const response = await fetch(getApiUrl('/admin/stats'), {
        headers,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recuperation des statistiques');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <>
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Analytics Stats - Primary Row */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Statistiques de visite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Visiteurs totaux</p>
            <p className="text-3xl font-bold">{loading ? '...' : stats.totalVisitors}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Pages vues</p>
            <p className="text-3xl font-bold">{loading ? '...' : stats.totalPageViews}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Visiteurs aujourd'hui</p>
            <p className="text-3xl font-bold">{loading ? '...' : stats.todayVisitors}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-white/80 text-sm mb-1">Pages vues aujourd'hui</p>
            <p className="text-3xl font-bold">{loading ? '...' : stats.todayPageViews}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Projets"
          value={loading ? '...' : stats.projectsCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatsCard
          title="Experiences"
          value={loading ? '...' : stats.experiencesCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatsCard
          title="Messages"
          value={loading ? '...' : stats.messagesCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          trend={
            stats.unreadMessagesCount > 0
              ? { value: `${stats.unreadMessagesCount} non lu${stats.unreadMessagesCount > 1 ? 's' : ''}`, isPositive: true }
              : undefined
          }
        />

        <StatsCard
          title="Certifications"
          value={loading ? '...' : stats.certificationsCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Formations"
          value={loading ? '...' : stats.educationCount}
          className="md:col-span-1"
        />
        <StatsCard
          title="Benevolat"
          value={loading ? '...' : stats.volunteerCount}
          className="md:col-span-1"
        />
        <StatsCard
          title="Projets Featured"
          value={loading ? '...' : stats.featuredProjectsCount}
          className="md:col-span-1"
        />
      </div>
    </>
  );
}
