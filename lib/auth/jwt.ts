// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { env } from '@/lib/env';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

type PublicUser = { id: string; email: string; name: string; role: string };

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: PublicUser; token: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) return null;

  const isValid = await comparePassword(password, user.password);
  if (!isValid) return null;

  const token = generateToken({
    userId: user.id,
    email: user.email,
    name: user.name ?? '',
    role: user.role,
  });

  return {
    user: { id: user.id, email: user.email, name: user.name ?? '', role: user.role },
    token,
  };
}
