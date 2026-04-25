// app/api/messages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/api-auth';

/**
 * PATCH /api/messages/[id]
 * Toggle read/unread status (admin seulement)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: body.read },
    });

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }
    throw error;
  }
}

/**
 * DELETE /api/messages/[id]
 * Supprimer un message (admin seulement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.contactMessage.delete({ where: { id } });

    return NextResponse.json({ message: 'Message supprime' }, { status: 200 });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }
    throw error;
  }
}
