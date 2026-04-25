// lib/hooks/useApiData.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '@/lib/utils';

interface UseApiDataOptions {
  immediate?: boolean; // Whether to fetch immediately on mount
  cache?: RequestCache;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching data from API endpoints
 * Handles loading, error states, and refetching
 */
export function useApiData<T = any>(
  endpoint: string,
  options: UseApiDataOptions = {}
): UseApiDataReturn<T> {
  const { immediate = true, cache = 'no-store' } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl(endpoint), {
        cache,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint, cache]);

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}