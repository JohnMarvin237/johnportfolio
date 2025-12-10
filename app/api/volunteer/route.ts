// app/api/volunteer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { volunteerSchema } from '@/lib/schemas/volunteer.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';

/**
 * GET /api/volunteer
 * Récupère toutes les expériences de bénévolat (route publique)
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

    const volunteer = await prisma.volunteer.findMany({
      where,
      take,
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ],
    });

    return NextResponse.json(volunteer, { status: 200 });
  } catch (error) {
    console.error('Error fetching volunteer experiences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des expériences de bénévolat' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/volunteer
 * Créer une nouvelle expérience de bénévolat (admin seulement)
 * Body: VolunteerSchema (validé par Zod)
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
    const validatedData = volunteerSchema.parse(body);

    // 3. Créer en base de données
    const volunteer = await prisma.volunteer.create({
      data: validatedData,
    });

    return NextResponse.json(volunteer, { status: 201 });
  } catch (error) {
    // 4. Gérer les erreurs
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error creating volunteer experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'expérience de bénévolat' },
      { status: 500 }
    );
  }
}
