// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { projectApiSchema, normalizeProjectData } from '@/lib/schemas/project-api.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { withAutoBackup } from '@/lib/utils/auto-backup';

/**
 * GET /api/projects
 * Récupère tous les projets (route publique)
 * Query params:
 *   - featured: boolean (optionnel) - filtrer les projets featured
 *   - limit: number (optionnel) - limiter le nombre de résultats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredParam = searchParams.get('featured');
    const limitParam = searchParams.get('limit');

    // Build where clause
    const where: any = {};
    if (featuredParam !== null) {
      where.featured = featuredParam === 'true';
    }

    // Parse limit
    const take = limitParam ? parseInt(limitParam, 10) : undefined;

    const projects = await prisma.project.findMany({
      where,
      take,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Créer un nouveau projet (admin seulement)
 * Body: ProjectSchema (validé par Zod)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    // 2. Parser et valider le body
    const body = await request.json();
    const validatedData = projectApiSchema.parse(body);

    // 3. Normalize data for consistency
    const normalizedData = normalizeProjectData(validatedData);

    // 4. Créer en base de données avec auto-backup
    const project = await withAutoBackup(
      async () => await prisma.project.create({
        data: normalizedData,
      }),
      'create project'
    );

    return NextResponse.json(project, { status: 201 });
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

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet' },
      { status: 500 }
    );
  }
}
