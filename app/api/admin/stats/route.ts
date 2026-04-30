// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/middleware';

/**
 * GET /api/admin/stats
 * Récupère les statistiques du tableau de bord (admin seulement)
 * Retourne le nombre d'entrées pour chaque entité du portfolio.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // 2. Récupérer tous les compteurs en une seule transaction
    const [
      projects,
      experiences,
      education,
      certifications,
      volunteer,
      messages,
      unreadMessages,
    ] = await prisma.$transaction([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.certification.count(),
      prisma.volunteer.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

    return NextResponse.json(
      {
        projects,
        experiences,
        education,
        certifications,
        volunteer,
        messages,
        unreadMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
