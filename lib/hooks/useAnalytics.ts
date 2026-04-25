'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPath = normalizePath(pathname);

    // Ne pas tracker les pages admin
    if (normalizedPath.startsWith('/admin') || normalizedPath.startsWith('/auth')) {
      return;
    }

    // Envoyer la page vue
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: normalizedPath,
          }),
        });
      } catch (error) {
        // Ignorer les erreurs de tracking
        console.error('Analytics tracking failed:', error);
      }
    };

    trackPageView();
  }, [pathname]);
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/';

  const localeMatch = pathname.match(/^\/(fr|en)(\/|$)/);
  if (localeMatch) {
    const stripped = pathname.replace(/^\/(fr|en)/, '');
    return stripped === '' ? '/' : stripped;
  }

  return pathname;
}

// Hook pour récupérer les analytics
import { useState, useCallback } from 'react';

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: Array<{ path: string; views: number }>;
  dailyStats: Array<{
    date: string;
    page_views: number;
    unique_visitors: number;
  }>;
}

export function useAnalyticsData(period: string = '30d') {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/analytics/track?period=${period}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}