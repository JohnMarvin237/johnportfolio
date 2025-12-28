// lib/utils/fetch-wrapper-with-fallback.ts
import { getApiUrl } from '@/lib/utils';
import { JsonBackupService } from '@/lib/backup/json-backup';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  source?: 'api' | 'backup';
}

// Type mapping for API endpoints to backup data keys
const endpointToBackupMap: Record<string, keyof NonNullable<Awaited<ReturnType<typeof JsonBackupService.loadFromJson>>>> = {
  '/projects': 'projects',
  '/experiences': 'experiences',
  '/education': 'education',
  '/certifications': 'certifications',
  '/volunteer': 'volunteer',
};

/**
 * Extract the base endpoint from a URL with query params
 */
function getBaseEndpoint(endpoint: string): string {
  return endpoint.split('?')[0];
}

/**
 * Apply query filters to backup data
 */
function applyFilters<T extends any[]>(data: T, endpoint: string): T {
  const url = new URL(endpoint, 'http://localhost');
  const params = url.searchParams;

  let filtered = [...data] as T;

  // Apply common filters
  const limit = params.get('limit');
  const featured = params.get('featured');
  const current = params.get('current');

  // Filter by featured
  if (featured !== null && 'featured' in filtered[0]) {
    filtered = filtered.filter((item: any) =>
      item.featured === (featured === 'true')
    ) as T;
  }

  // Filter by current
  if (current !== null && 'current' in filtered[0]) {
    filtered = filtered.filter((item: any) =>
      item.current === (current === 'true')
    ) as T;
  }

  // Apply limit
  if (limit) {
    filtered = filtered.slice(0, parseInt(limit, 10)) as T;
  }

  return filtered;
}

/**
 * Wrapper around fetch with error handling, timeout support, and JSON backup fallback
 * For use in Server Components
 */
export async function fetchWithFallback<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const { timeout = 10000, ...fetchOptions } = options;

  // First, try to fetch from the API
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
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null, source: 'api' };

  } catch (apiError) {
    console.warn(`API fetch failed for ${endpoint}, trying JSON backup...`, apiError);

    // Try to load from JSON backup
    try {
      const baseEndpoint = getBaseEndpoint(endpoint);
      const backupKey = endpointToBackupMap[baseEndpoint];

      if (!backupKey) {
        return {
          data: null,
          error: `No backup available for endpoint: ${endpoint}`,
          source: 'backup'
        };
      }

      const backupData = await JsonBackupService.loadFromJson();

      if (!backupData) {
        return {
          data: null,
          error: 'Failed to load backup data',
          source: 'backup'
        };
      }

      // Get the data for this endpoint
      let data = backupData[backupKey];

      // Apply any query filters
      if (endpoint.includes('?') && Array.isArray(data)) {
        data = applyFilters(data, endpoint);
      }

      console.log(`✅ Loaded ${backupKey} from JSON backup (${Array.isArray(data) ? data.length : 1} items)`);

      return {
        data: data as T,
        error: null,
        source: 'backup'
      };

    } catch (backupError) {
      console.error('Failed to load from backup:', backupError);

      return {
        data: null,
        error: apiError instanceof Error ? apiError.message : 'Failed to fetch data',
        source: 'backup'
      };
    }
  }
}

/**
 * Fetch multiple endpoints in parallel with error handling and fallback
 */
export async function fetchMultipleWithFallback<T extends Record<string, any>>(
  endpoints: Record<keyof T, string>,
  options?: FetchOptions
): Promise<Record<keyof T, FetchResult<any>>> {
  const entries = Object.entries(endpoints) as [keyof T, string][];

  const results = await Promise.all(
    entries.map(async ([key, endpoint]) => {
      const result = await fetchWithFallback(endpoint, options);
      return [key, result] as [keyof T, FetchResult<any>];
    })
  );

  return Object.fromEntries(results) as Record<keyof T, FetchResult<any>>;
}