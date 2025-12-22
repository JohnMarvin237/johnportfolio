// app/api/certifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { certificationUpdateSchema } from '@/lib/schemas/certification.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@/app/generated/prisma';

/**
 * GET /api/certifications/[id]
 * Récupère une certification spécifique (route publique)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const certification = await prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(certification, { status: 200 });
  } catch (error) {
    console.error('Error fetching certification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la certification' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/certifications/[id]
 * Modifier une certification (admin seulement)
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
    const validatedData = certificationUpdateSchema.parse(body);

    // 3. Mettre à jour en base de données
    const certification = await prisma.certification.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(certification, { status: 200 });
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
          { error: 'Certification non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error updating certification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la certification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/certifications/[id]
 * Supprimer une certification (admin seulement)
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
    await prisma.certification.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Certification supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Certification non trouvée' },
          { status: 404 }
        );
      }
    }

    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la certification' },
      { status: 500 }
    );
  }
}
