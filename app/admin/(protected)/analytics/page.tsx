import dynamic from 'next/dynamic';
import { getDailyCounts, getWeeklyCounts, getMonthlyCounts } from '@/lib/db/analytics';
import type { AnalyticsResponse } from '@/lib/schemas/analytics.schema';

// Defer Recharts bundle — it's large and uses browser APIs; not needed during SSR
const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'), { ssr: false });

export default async function AnalyticsPage() {
  const [daily, weekly, monthly] = await Promise.all([
    getDailyCounts(7),
    getWeeklyCounts(4),
    getMonthlyCounts(6),
  ]);

  const data: AnalyticsResponse = { daily, weekly, monthly };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Visites des pages publiques (hors robots et admin)
        </p>
      </div>
      <AnalyticsCharts data={data} />
    </div>
  );
}
