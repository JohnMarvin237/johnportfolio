/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest'

// Stub the two required env vars from lib/env.ts before any module imports run.
// All other vars in envSchema are optional, so they need no stub.
vi.stubEnv('DATABASE_URL', 'postgresql://localhost/test')
vi.stubEnv('JWT_SECRET', 'test-secret-at-least-32-characters-long!!')
vi.stubEnv('JWT_EXPIRES_IN', '30d')
