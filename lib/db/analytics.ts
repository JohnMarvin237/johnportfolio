import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@/app/generated/prisma';

type BucketRow = { bucket: Date; count: bigint };

function toISOBucket(rows: BucketRow[]): { bucket: string; count: number }[] {
  return rows.map((row) => ({
    bucket: row.bucket.toISOString(),
    count: Number(row.count),
  }));
}

export async function getDailyCounts(
  days = 7
): Promise<{ bucket: string; count: number }[]> {
  const rows = await prisma.$queryRaw<BucketRow[]>(Prisma.sql`
    SELECT
      date_trunc('day', "visited_at" AT TIME ZONE 'UTC') AS bucket,
      COUNT(*)::bigint AS count
    FROM page_views
    WHERE "visited_at" >= NOW() - (${days} || ' days')::INTERVAL
    GROUP BY 1
    ORDER BY 1 ASC
  `);
  return toISOBucket(rows);
}

export async function getWeeklyCounts(
  weeks = 4
): Promise<{ bucket: string; count: number }[]> {
  const rows = await prisma.$queryRaw<BucketRow[]>(Prisma.sql`
    SELECT
      date_trunc('week', "visited_at" AT TIME ZONE 'UTC') AS bucket,
      COUNT(*)::bigint AS count
    FROM page_views
    WHERE "visited_at" >= NOW() - (${weeks} || ' weeks')::INTERVAL
    GROUP BY 1
    ORDER BY 1 ASC
  `);
  return toISOBucket(rows);
}

export async function getMonthlyCounts(
  months = 6
): Promise<{ bucket: string; count: number }[]> {
  const rows = await prisma.$queryRaw<BucketRow[]>(Prisma.sql`
    SELECT
      date_trunc('month', "visited_at" AT TIME ZONE 'UTC') AS bucket,
      COUNT(*)::bigint AS count
    FROM page_views
    WHERE "visited_at" >= NOW() - (${months} || ' months')::INTERVAL
    GROUP BY 1
    ORDER BY 1 ASC
  `);
  return toISOBucket(rows);
}
