import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/middleware';
import { getDailyCounts, getWeeklyCounts, getMonthlyCounts } from '@/lib/db/analytics';
import type { AnalyticsResponse } from '@/lib/schemas/analytics.schema';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const [daily, weekly, monthly] = await Promise.all([
    getDailyCounts(7),
    getWeeklyCounts(4),
    getMonthlyCounts(6),
  ]);

  const body: AnalyticsResponse = { daily, weekly, monthly };
  return NextResponse.json(body);
}
