// lib/utils/fetch-wrapper.ts
import { getApiUrl } from '@/lib/utils';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface FetchResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * Wrapper around fetch with error handling and timeout support
 * For use in Server Components
 */
export async function fetchWithErrorHandling<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const { timeout = 10000, ...fetchOptions } = options;

  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(getApiUrl(endpoint), {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        data: null,
        error: `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data, error: null };

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { data: null, error: 'La requête a expiré' };
      }
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Une erreur inconnue est survenue' };
  }
}

/**
 * Fetch multiple endpoints in parallel with error handling
 */
export async function fetchMultiple<T extends Record<string, any>>(
  endpoints: Record<keyof T, string>,
  options?: FetchOptions
): Promise<Record<keyof T, FetchResult<any>>> {
  const entries = Object.entries(endpoints) as [keyof T, string][];

  const results = await Promise.all(
    entries.map(async ([key, endpoint]) => {
      const result = await fetchWithErrorHandling(endpoint, options);
      return [key, result] as [keyof T, FetchResult<any>];
    })
  );

  return Object.fromEntries(results) as Record<keyof T, FetchResult<any>>;
}