// lib/config/env.ts
/**
 * Environment variables configuration and validation
 * Ensures all required environment variables are present
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // Authentication
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;

  // Email
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
  EMAIL_TO: string;

  // App
  NEXT_PUBLIC_APP_URL?: string;
  NODE_ENV: 'development' | 'test' | 'production';
}

class EnvValidator {
  private config: Partial<EnvConfig> = {};

  constructor() {
    this.loadConfig();
    this.validate();
  }

  private loadConfig() {
    this.config = {
      // Database
      DATABASE_URL: process.env.DATABASE_URL,

      // Authentication
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

      // Email
      SMTP_HOST: process.env.SMTP_HOST || '',
      SMTP_PORT: process.env.SMTP_PORT || '587',
      SMTP_USER: process.env.SMTP_USER || '',
      SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
      EMAIL_FROM: process.env.EMAIL_FROM || '',
      EMAIL_TO: process.env.EMAIL_TO || '',

      // App
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    };
  }

  private validate() {
    const required: (keyof EnvConfig)[] = [
      'DATABASE_URL',
      'JWT_SECRET',
    ];

    // In production, more variables are required
    if (process.env.NODE_ENV === 'production') {
      required.push(
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASSWORD',
        'EMAIL_FROM',
        'EMAIL_TO'
      );
    }

    const missing = required.filter(key => !this.config[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      );
    }

    // Validate JWT_SECRET strength in production
    if (process.env.NODE_ENV === 'production' && this.config.JWT_SECRET) {
      if (this.config.JWT_SECRET.length < 32) {
        throw new Error(
          'JWT_SECRET must be at least 32 characters long in production. ' +
          'Generate a secure secret with: openssl rand -base64 32'
        );
      }

      if (this.config.JWT_SECRET.includes('CHANGE-ME') || this.config.JWT_SECRET.includes('fallback')) {
        throw new Error(
          'JWT_SECRET contains unsafe default value. ' +
          'Please generate a secure secret with: openssl rand -base64 32'
        );
      }
    }
  }

  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key] as EnvConfig[K];
  }

  getAll(): EnvConfig {
    return this.config as EnvConfig;
  }
}

// Create singleton instance
const env = new EnvValidator();

export default env;

// Type-safe environment variable access
export const getEnv = <K extends keyof EnvConfig>(key: K): EnvConfig[K] => {
  return env.get(key);
};