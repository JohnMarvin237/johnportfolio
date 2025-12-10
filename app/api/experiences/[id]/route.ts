// app/api/experiences/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { experienceUpdateSchema } from '@/lib/schemas/experience.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@/app/generated/prisma';

/**
 * GET /api/experiences/[id]
 * Récupère une expérience spécifique (route publique)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return NextResponse.json(
        { error: 'Expérience non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(experience, { status: 200 });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'expérience' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/experiences/[id]
 * Modifier une expérience (admin seulement)
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
    const validatedData = experienceUpdateSchema.parse(body);

    // 3. Mettre à jour en base de données
    const experience = await prisma.experience.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(experience, { status: 200 });
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
          { error: 'Expérience non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'expérience' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/experiences/[id]
 * Supprimer une expérience (admin seulement)
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
    await prisma.experience.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Expérience supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Expérience non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'expérience' },
      { status: 500 }
    );
  }
}
