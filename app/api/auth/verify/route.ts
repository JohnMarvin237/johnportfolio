// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Token invalide ou expiré' },
      { status: 401 }
    );
  }

  // Fetch fresh user data from database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Utilisateur introuvable' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}
