// app/api/experiences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { experienceApiSchema, normalizeExperienceData } from '@/lib/schemas/experience-api.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { withAutoBackup } from '@/lib/utils/auto-backup';

/**
 * GET /api/experiences
 * Récupère toutes les expériences (route publique)
 * Query params:
 *   - current: boolean (optionnel) - filtrer les expériences en cours
 *   - limit: number (optionnel) - limiter le nombre de résultats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentParam = searchParams.get('current');
    const limitParam = searchParams.get('limit');

    // Build where clause
    const where: any = {};
    if (currentParam !== null) {
      where.current = currentParam === 'true';
    }

    // Parse limit
    const take = limitParam ? parseInt(limitParam, 10) : undefined;

    const experiences = await prisma.experience.findMany({
      where,
      take,
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ],
    });

    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des expériences' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experiences
 * Créer une nouvelle expérience (admin seulement)
 * Body: ExperienceApiSchema (validé par Zod)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // 2. Parser et valider le body
    const body = await request.json();
    const validatedData = experienceApiSchema.parse(body);

    // 3. Normalize data for consistency
    const normalizedData = normalizeExperienceData(validatedData);

    // 4. Créer en base de données avec auto-backup
    const experience = await withAutoBackup(
      async () => await prisma.experience.create({
        data: normalizedData,
      }),
      'create experience'
    );

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    // 5. Gérer les erreurs
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'expérience' },
      { status: 500 }
    );
  }
}
