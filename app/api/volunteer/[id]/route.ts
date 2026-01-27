// app/api/volunteer/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { volunteerApiUpdateSchema, normalizeVolunteerData } from '@/lib/schemas/volunteer-api.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { withAutoBackup } from '@/lib/utils/auto-backup';

/**
 * GET /api/volunteer/[id]
 * Récupère une expérience de bénévolat spécifique (route publique)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
    });

    if (!volunteer) {
      return NextResponse.json(
        { error: 'Expérience de bénévolat non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(volunteer, { status: 200 });
  } catch (error) {
    console.error('Error fetching volunteer experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'expérience de bénévolat' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/volunteer/[id]
 * Modifier une expérience de bénévolat (admin seulement)
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
    const validatedData = volunteerApiUpdateSchema.parse(body);

    // 3. Normalize data for consistency
    const normalizedData = normalizeVolunteerData(validatedData as any);

    // 4. Mettre à jour en base de données avec auto-backup
    const volunteer = await withAutoBackup(
      async () => await prisma.volunteer.update({
        where: { id },
        data: normalizedData,
      }),
      `update volunteer ${id}`
    );

    return NextResponse.json(volunteer, { status: 200 });
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
          { error: 'Expérience de bénévolat non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error updating volunteer experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'expérience de bénévolat' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/volunteer/[id]
 * Supprimer une expérience de bénévolat (admin seulement)
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
      async () => await prisma.volunteer.delete({
        where: { id },
      }),
      `delete volunteer ${id}`
    );

    return NextResponse.json(
      { message: 'Expérience de bénévolat supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Expérience de bénévolat non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error deleting volunteer experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'expérience de bénévolat' },
      { status: 500 }
    );
  }
}
