// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearAuthToken } from '@/lib/auth/auth-helpers';

/**
 * POST /api/auth/logout
 * Logout user by clearing auth token
 */
export async function POST() {
  try {
    // Clear the auth cookie
    await clearAuthToken();

    return NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}