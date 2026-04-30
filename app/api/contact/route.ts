// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { contactMessageSchema } from '@/lib/schemas/contact.schema';
import { sendContactNotification } from '@/lib/email/mailer';
import { rateLimit } from '@/lib/server/rate-limit';
import { ZodError } from 'zod';

/**
 * POST /api/contact
 * Envoyer un message de contact (route publique)
 * Body: ContactMessageSchema (validé par Zod)
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 5 messages per IP per 10 minutes
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const limit = rateLimit(ip, { limit: 5, windowSec: 600 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      }
    );
  }

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
