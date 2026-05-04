'use client';
// Client Component — Recharts requires browser APIs (SVG rendering, ResizeObserver)

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { AnalyticsResponse } from '@/lib/schemas/analytics.schema';

interface AnalyticsChartsProps {
  data: AnalyticsResponse;
}

function formatBucket(iso: string, granularity: 'day' | 'week' | 'month'): string {
  const d = new Date(iso);
  if (granularity === 'day') {
    return d.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' });
  }
  if (granularity === 'week') {
    return `Sem. ${d.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })}`;
  }
  return d.toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' });
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const sections = [
    { title: '7 derniers jours', items: data.daily, granularity: 'day' as const },
    { title: '4 dernières semaines', items: data.weekly, granularity: 'week' as const },
    { title: '6 derniers mois', items: data.monthly, granularity: 'month' as const },
  ];

  return (
    <div className="space-y-8">
      {sections.map(({ title, items, granularity }) => (
        <div key={title} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={items.map((r) => ({ ...r, label: formatBucket(r.bucket, granularity) }))}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Visites" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
