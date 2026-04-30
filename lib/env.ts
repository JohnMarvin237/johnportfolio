// lib/env.ts
// Validates required environment variables at module-load time.
// Import this module early (e.g., lib/auth/jwt.ts) so a missing var fails fast.
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('30d'),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().min(1).optional(), // may be "Name <email>" format
  EMAIL_TO: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_NAME: z.string().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map(
      (i) => `  ${i.path.join('.')}: ${i.message}`
    );
    throw new Error(
      `Missing or invalid environment variables:\n${missing.join('\n')}`
    );
  }
  return result.data;
}

export const env = validateEnv();
