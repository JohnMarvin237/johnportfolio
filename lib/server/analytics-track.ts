import { prisma } from '@/lib/db/prisma';

const BOT_PATTERN = /bot|crawler|spider|preview|lighthouse|pagespeed|headless/i;

interface HeadersLike {
  get: (name: string) => string | null;
}

export async function trackPageView(opts: {
  path: string;
  headers: HeadersLike;
}): Promise<void> {
  const { path, headers } = opts;

  const userAgent = headers.get('user-agent');
  if (userAgent && BOT_PATTERN.test(userAgent)) return;

  const cookie = headers.get('cookie');
  if (cookie && cookie.includes('auth_token=')) return;

  const referer = headers.get('referer');

  try {
    await prisma.pageView.create({
      data: {
        path,
        userAgent,
        referer,
      },
    });
  } catch {
    // Tracking must never surface errors to the caller.
  }
}
