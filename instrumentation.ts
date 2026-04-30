export async function register() {
  // Only runs in the Node.js runtime (not Edge). Wakes the Neon DB so the
  // first user request hits a live connection instead of a cold-start delay.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { prisma } = await import('@/lib/db/prisma');
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // Non-fatal — the page-level error handling will surface any real failure.
    }
  }
}
