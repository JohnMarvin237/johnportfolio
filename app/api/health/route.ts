import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    // Test simple de connexion à la BD
    await prisma.user.count();

    // Vérifier que les tables principales existent
    const [projects, experiences] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count()
    ]);

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      tables: {
        projects,
        experiences
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}