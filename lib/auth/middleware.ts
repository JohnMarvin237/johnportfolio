// lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import type { JWTPayload } from './jwt';

/**
 * Require authentication middleware
 * Verifies JWT token from Authorization header
 */
export async function requireAuth(request: NextRequest): Promise<JWTPayload | NextResponse> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Token manquant' },
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

  return payload;
}

/**
 * Require admin role middleware
 * Verifies JWT token and checks for admin role
 */
export async function requireAdmin(request: NextRequest): Promise<JWTPayload | NextResponse> {
  const payload = await requireAuth(request);

  // If already a NextResponse (error), return it
  if (payload instanceof NextResponse) {
    return payload;
  }

  if (payload.role !== 'admin') {
    return NextResponse.json(
      { error: 'Accès refusé - Admin requis' },
      { status: 403 }
    );
  }

  return payload;
}
