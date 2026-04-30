// lib/auth/middleware.ts
// Accepts token from Authorization: Bearer header OR the auth_token HttpOnly cookie.
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import type { JWTPayload } from './jwt';
import { SESSION_COOKIE_NAME } from './session';

function extractToken(request: NextRequest): string | null {
  return (
    request.headers.get('authorization')?.replace('Bearer ', '') ??
    request.cookies.get(SESSION_COOKIE_NAME)?.value ??
    null
  );
}

export async function requireAuth(request: NextRequest): Promise<JWTPayload | NextResponse> {
  const token = extractToken(request);

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Token invalide ou expiré' },
      { status: 401 }
    );
  }

  return payload;
}

export async function requireAdmin(request: NextRequest): Promise<JWTPayload | NextResponse> {
  const payload = await requireAuth(request);

  if (payload instanceof NextResponse) return payload;

  if (payload.role !== 'admin') {
    return NextResponse.json(
      { error: 'Accès refusé - Admin requis' },
      { status: 403 }
    );
  }

  return payload;
}
