// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { projectApiUpdateSchema, normalizeProjectData } from '@/lib/schemas/project-api.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { withAutoBackup } from '@/lib/utils/auto-backup';

/**
 * GET /api/projects/[id]
 * Récupère un projet spécifique (route publique)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du projet' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Modifier un projet (admin seulement)
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
    const validatedData = projectApiUpdateSchema.parse(body);

    // 3. Normalize data for consistency
    const normalizedData = normalizeProjectData(validatedData as any);

    // 4. Mettre à jour en base de données avec auto-backup
    const project = await withAutoBackup(
      async () => await prisma.project.update({
        where: { id },
        data: normalizedData,
      }),
      `update project ${id}`
    );

    return NextResponse.json(project, { status: 200 });
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
          { error: 'Projet non trouvé' },
          { status: 404 }
        );
      }
    }

    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Supprimer un projet (admin seulement)
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
      async () => await prisma.project.delete({
        where: { id },
      }),
      `delete project ${id}`
    );

    return NextResponse.json(
      { message: 'Projet supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Projet non trouvé' },
          { status: 404 }
        );
      }
    }

    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}
