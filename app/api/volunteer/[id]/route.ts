// app/api/volunteer/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { volunteerUpdateSchema } from '@/lib/schemas/volunteer.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@/app/generated/prisma';

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
    const validatedData = volunteerUpdateSchema.parse(body);

    // 3. Mettre à jour en base de données
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(volunteer, { status: 200 });
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

    // 2. Supprimer de la base de données
    await prisma.volunteer.delete({
      where: { id },
    });

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
