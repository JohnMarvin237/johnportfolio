// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/middleware';

/**
 * GET /api/messages
 * Récupère tous les messages de contact (admin seulement)
 * Query params:
 *   - unread: boolean (optionnel) - filtrer les messages non lus
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const unreadParam = searchParams.get('unread');

    // 2. Construire le filtre
    const where = unreadParam === 'true' ? { read: false } : {};

    // 3. Récupérer les messages
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}
