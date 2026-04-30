// app/api/messages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { messageUpdateSchema } from '@/lib/schemas/message.schema';
import { requireAdmin } from '@/lib/auth/middleware';
import { ZodError } from 'zod';
import { Prisma } from '@/app/generated/prisma';

/**
 * PATCH /api/messages/[id]
 * Modifier un message de contact (admin seulement)
 * Body: { read: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Vérifier authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // 2. Attendre les params (Next.js 15 async params)
    const { id } = await params;

    // 3. Parser et valider le body
    const body = await request.json();
    const validatedData = messageUpdateSchema.parse(body);

    // 4. Mettre à jour en base de données
    const message = await prisma.contactMessage.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du message' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/[id]
 * Supprimer un message de contact (admin seulement)
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

    // 2. Attendre les params (Next.js 15 async params)
    const { id } = await params;

    // 3. Supprimer de la base de données
    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Message supprimé' },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du message' },
      { status: 500 }
    );
  }
}
