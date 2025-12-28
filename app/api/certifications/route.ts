// app/api/certifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { certificationApiSchema, normalizeCertificationData } from '@/lib/schemas/certification-api.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { withAutoBackup } from '@/lib/utils/auto-backup';

/**
 * GET /api/certifications
 * Récupère toutes les certifications (route publique)
 * Query params:
 *   - limit: number (optionnel) - limiter le nombre de résultats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');

    // Parse limit
    const take = limitParam ? parseInt(limitParam, 10) : undefined;

    const certifications = await prisma.certification.findMany({
      take,
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' }
      ],
    });

    return NextResponse.json(certifications, { status: 200 });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des certifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/certifications
 * Créer une nouvelle certification (admin seulement)
 * Body: CertificationApiSchema (validé par Zod)
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
    const validatedData = certificationApiSchema.parse(body);

    // 3. Normalize data for consistency
    const normalizedData = normalizeCertificationData(validatedData);

    // 4. Créer en base de données avec auto-backup
    const certification = await withAutoBackup(
      async () => await prisma.certification.create({
        data: normalizedData,
      }),
      'create certification'
    );

    return NextResponse.json(certification, { status: 201 });
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

    console.error('Error creating certification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la certification' },
      { status: 500 }
    );
  }
}
