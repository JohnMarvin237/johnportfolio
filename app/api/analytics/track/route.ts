import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/generated/prisma';
import { headers } from 'next/headers';
import crypto from 'crypto';

// Générer un ID de session unique basé sur l'IP et l'user agent
function generateSessionId(ip: string, userAgent: string): string {
  const data = `${ip}-${userAgent}-${new Date().toISOString().split('T')[0]}`;
  return crypto.createHash('md5').update(data).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Récupérer les headers
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';

    // Récupérer l'IP (en production, utiliser x-forwarded-for)
    const ip = headersList.get('x-forwarded-for') ||
               headersList.get('x-real-ip') ||
               'unknown';

    // Générer l'ID de session
    const sessionId = generateSessionId(ip, userAgent);

    // Transaction pour mettre à jour visitor et créer page view
    await prisma.$transaction(async (tx) => {
      // Créer ou mettre à jour le visiteur
      const visitor = await tx.visitor.upsert({
        where: { sessionId },
        create: {
          sessionId,
          userAgent,
          ip,
          firstVisit: new Date(),
          lastVisit: new Date(),
          pageCount: 1,
        },
        update: {
          lastVisit: new Date(),
          pageCount: { increment: 1 },
        },
      });

      // Enregistrer la vue de page
      await tx.pageView.create({
        data: {
          path,
          userAgent,
          referer,
          ip,
        },
      });

      // Si c'est une page de projet, enregistrer aussi dans ProjectView
      if (path.startsWith('/projects/') && path.split('/').length === 3) {
        const projectId = path.split('/')[2];
        await tx.projectView.create({
          data: {
            projectId,
            sessionId,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // On retourne toujours un succès pour ne pas bloquer l'utilisateur
    return NextResponse.json({ success: true });
  }
}

// Endpoint GET pour récupérer les statistiques
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Calculer la date de début selon la période
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        startDate = new Date(0); // Depuis le début
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Récupérer les statistiques
    const [totalVisitors, totalPageViews, uniqueVisitors, topPages] = await Promise.all([
      // Nombre total de visiteurs
      prisma.visitor.count({
        where: {
          firstVisit: { gte: startDate },
        },
      }),

      // Nombre total de pages vues
      prisma.pageView.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Visiteurs uniques (depuis le début)
      prisma.visitor.count(),

      // Pages les plus visitées
      prisma.pageView.groupBy({
        by: ['path'],
        where: {
          createdAt: { gte: startDate },
        },
        _count: {
          path: true,
        },
        orderBy: {
          _count: {
            path: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Calculer les statistiques par jour pour le graphique
    const dailyStats = await prisma.$queryRaw`
      SELECT
        DATE(created_at) as date,
        COUNT(DISTINCT CASE WHEN created_at >= ${startDate} THEN id END) as page_views,
        COUNT(DISTINCT CASE WHEN first_visit >= ${startDate} THEN session_id END) as unique_visitors
      FROM (
        SELECT id, created_at, NULL as session_id, NULL as first_visit FROM page_views
        UNION ALL
        SELECT NULL as id, NULL as created_at, session_id, first_visit FROM visitors
      ) combined
      WHERE created_at >= ${startDate} OR first_visit >= ${startDate}
      GROUP BY DATE(COALESCE(created_at, first_visit))
      ORDER BY date DESC
      LIMIT 30
    `;

    return NextResponse.json({
      totalVisitors,
      totalPageViews,
      uniqueVisitors,
      topPages: topPages.map(page => ({
        path: page.path,
        views: page._count.path,
      })),
      dailyStats,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}