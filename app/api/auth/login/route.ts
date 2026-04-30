// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/jwt';
import { loginSchema } from '@/lib/schemas/login.schema';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const result = await authenticateUser(email, password);

    if (!result) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'authentification" },
      { status: 500 }
    );
  }
}
