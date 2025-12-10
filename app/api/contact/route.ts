// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { contactMessageSchema } from '@/lib/schemas/contact.schema';
import { sendContactNotification } from '@/lib/email/mailer';
import { ZodError } from 'zod';

/**
 * POST /api/contact
 * Envoyer un message de contact (route publique)
 * Body: ContactMessageSchema (validé par Zod)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parser et valider le body
    const body = await request.json();
    const validatedData = contactMessageSchema.parse(body);

    // 2. Sauvegarder en base de données
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        read: false,
      },
    });

    // 3. Envoyer notification email à l'admin
    try {
      await sendContactNotification({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject || undefined,
        message: validatedData.message,
      });
    } catch (emailError) {
      // Log l'erreur mais ne fait pas échouer la requête
      console.error('Failed to send email notification:', emailError);
      // Le message est quand même sauvegardé en BD
    }

    // 4. Retourner succès
    return NextResponse.json(
      {
        message: 'Message envoyé avec succès',
        id: contactMessage.id,
      },
      { status: 201 }
    );
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

    console.error('Error processing contact message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
