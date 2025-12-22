// app/api/education/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { educationSchema } from '@/lib/schemas/education.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';

/**
 * GET /api/education
 * Récupère toutes les formations (route publique)
 * Query params:
 *   - current: boolean (optionnel) - filtrer les formations en cours
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

    const education = await prisma.education.findMany({
      where,
      take,
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ],
    });

    return NextResponse.json(education, { status: 200 });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des formations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/education
 * Créer une nouvelle formation (admin seulement)
 * Body: EducationSchema (validé par Zod)
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
    const validatedData = educationSchema.parse(body);

    // 3. Créer en base de données
    const education = await prisma.education.create({
      data: validatedData,
    });

    return NextResponse.json(education, { status: 201 });
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

    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la formation' },
      { status: 500 }
    );
  }
}
