// app/api/settings/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/api-auth';
import { z } from 'zod';

/**
 * GET /api/settings
 * Returns all site settings as a flat { key: value } object (public route).
 */
const PUBLIC_KEY_PREFIXES = ['contact_', 'social_', 'profile_', 'site_']

export async function GET() {
  try {
    const rows = await prisma.siteSettings.findMany();
    const publicRows = rows.filter((r: { key: string; value: string }) =>
      PUBLIC_KEY_PREFIXES.some(p => r.key.startsWith(p))
    )
    const result: Record<string, string> = {};
    publicRows.forEach((row) => {
      result[row.key] = row.value;
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

const settingsBodySchema = z.record(z.string(), z.string());

/**
 * PUT /api/settings
 * Admin only. Upserts multiple settings at once.
 * Body: { key: value, key2: value2, ... }
 */
export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = settingsBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      );
    }

    await Promise.all(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    // Invalidate any cached pages that consume settings
    revalidatePath('/contact');
    revalidatePath('/', 'layout'); // refreshes the footer on all public pages

    return NextResponse.json({ message: 'Paramètres enregistrés' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
