import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/lib/schemas/login.schema'

describe('loginSchema', () => {
  it('should accept valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'admin@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('should reject a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-valid', password: 'secret123' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true)
    }
  })

  it('should reject a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'admin@example.com', password: 'abc' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('password'))).toBe(true)
    }
  })

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({ password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({ email: 'admin@example.com' })
    expect(result.success).toBe(false)
  })
})
