import { after } from 'next/server';
import { headers, cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

interface TrackPageViewProps {
  path: string;
}

const BOT_RE = /bot|crawler|spider|preview|lighthouse|pagespeed|headless/i;

export default async function TrackPageView({ path }: TrackPageViewProps) {
  const headersList = await headers();
  const cookieStore = await cookies();

  const userAgent = headersList.get('user-agent') ?? '';
  const referer = headersList.get('referer') ?? null;
  const hasAuthCookie = cookieStore.has('auth_token');

  if (BOT_RE.test(userAgent) || hasAuthCookie) return null;

  const ua = userAgent || null;
  const ref = referer || null;

  after(async () => {
    try {
      await prisma.pageView.create({ data: { path, userAgent: ua, referer: ref } });
    } catch {
      // swallow — never block rendering
    }
  });

  return null;
}
