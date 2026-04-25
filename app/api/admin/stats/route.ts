import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      projectsCount,
      experiencesCount,
      educationCount,
      certificationsCount,
      volunteerCount,
      messagesCount,
      unreadMessagesCount,
      featuredProjectsCount,
      totalVisitors,
      totalPageViews,
      todayVisitors,
      todayPageViews,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.certification.count(),
      prisma.volunteer.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.visitor.count(),
      prisma.pageView.count(),
      prisma.visitor.count({
        where: {
          firstVisit: { gte: today },
        },
      }),
      prisma.pageView.count({
        where: {
          createdAt: { gte: today },
        },
      }),
    ]);

    return NextResponse.json({
      projectsCount,
      experiencesCount,
      educationCount,
      certificationsCount,
      volunteerCount,
      messagesCount,
      unreadMessagesCount,
      featuredProjectsCount,
      totalVisitors,
      totalPageViews,
      todayVisitors,
      todayPageViews,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques' },
      { status: 500 }
    );
  }
}
