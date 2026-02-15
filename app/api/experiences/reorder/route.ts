// app/api/experiences/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

// Schema pour valider les données de réorganisation
const reorderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number().int().positive(),
  })
);

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Parser et valider les données
    const body = await request.json();
    const updates = reorderSchema.parse(body);

    // Mettre à jour l'ordre de chaque expérience dans une transaction
    await prisma.$transaction(
      updates.map((update) =>
        prisma.experience.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );

    return NextResponse.json({ message: 'Ordre mis à jour avec succès' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la réorganisation des expériences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'ordre' },
      { status: 500 }
    );
  }
}