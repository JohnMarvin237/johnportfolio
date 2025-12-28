// app/api/education/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { educationApiUpdateSchema, normalizeEducationData } from '@/lib/schemas/education-api.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@/app/generated/prisma';
import { withAutoBackup } from '@/lib/utils/auto-backup';

/**
 * GET /api/education/[id]
 * Récupère une formation spécifique (route publique)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const education = await prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(education, { status: 200 });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la formation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/education/[id]
 * Modifier une formation (admin seulement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;

    // 2. Parser et valider le body
    const body = await request.json();
    const validatedData = educationApiUpdateSchema.parse(body);

    // 3. Normalize data for consistency
    const normalizedData = normalizeEducationData(validatedData as any);

    // 4. Mettre à jour en base de données avec auto-backup
    const education = await withAutoBackup(
      async () => await prisma.education.update({
        where: { id },
        data: normalizedData,
      }),
      `update education ${id}`
    );

    return NextResponse.json(education, { status: 200 });
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error updating education:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la formation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/education/[id]
 * Supprimer une formation (admin seulement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;

    // 2. Supprimer de la base de données avec auto-backup
    await withAutoBackup(
      async () => await prisma.education.delete({
        where: { id },
      }),
      `delete education ${id}`
    );

    return NextResponse.json(
      { message: 'Formation supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error deleting education:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la formation' },
      { status: 500 }
    );
  }
}
