import { describe, it, expect, vi, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  type JWTPayload,
} from '@/lib/auth/jwt'

// lib/auth/jwt.ts reads env.JWT_SECRET and env.JWT_EXPIRES_IN at module load.
// test/setup.ts stubs those env vars, so the module initialises correctly.

const samplePayload: JWTPayload = {
  userId: 'user-abc-123',
  email: 'john@example.com',
  role: 'admin',
}

describe('generateToken / verifyToken', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should round-trip a valid token and return the correct payload', () => {
    const token = generateToken(samplePayload)
    const decoded = verifyToken(token)

    expect(decoded).not.toBeNull()
    expect(decoded?.userId).toBe(samplePayload.userId)
    expect(decoded?.email).toBe(samplePayload.email)
    expect(decoded?.role).toBe(samplePayload.role)
  })

  it('should return null for a malformed token string', () => {
    const result = verifyToken('this.is.not.a.jwt')
    expect(result).toBeNull()
  })

  it('should return null for a token signed with a different secret', () => {
    const wrongToken = jwt.sign(samplePayload, 'a-completely-different-secret-key-xx')
    const result = verifyToken(wrongToken)
    expect(result).toBeNull()
  })

  it('should return null for an expired token', () => {
    // Sign a token that expires in 1 second, then advance time past it.
    const shortToken = jwt.sign(samplePayload, process.env.JWT_SECRET as string, {
      algorithm: 'HS256',
      expiresIn: 1,
    })

    vi.useFakeTimers()
    vi.advanceTimersByTime(2000)

    // jwt.verify uses real clock even with fake timers for the "nbf"/"exp" check,
    // but we can use Date.now() manipulation via the clockTimestamp option.
    // Instead, test with a token that's already expired using a past timestamp.
    const alreadyExpired = jwt.sign(
      { ...samplePayload, iat: Math.floor(Date.now() / 1000) - 3600, exp: Math.floor(Date.now() / 1000) - 1800 },
      process.env.JWT_SECRET as string,
    )

    const result = verifyToken(alreadyExpired)
    expect(result).toBeNull()
  })

  it('should return null for an empty string', () => {
    expect(verifyToken('')).toBeNull()
  })
})

describe('hashPassword / comparePassword', () => {
  it('should hash and successfully compare the correct password', async () => {
    const password = 'MySecureP@ssw0rd!'
    const hash = await hashPassword(password)

    expect(hash).not.toBe(password)
    expect(hash.startsWith('$2')).toBe(true)

    const match = await comparePassword(password, hash)
    expect(match).toBe(true)
  })

  it('should return false when comparing the wrong password', async () => {
    const hash = await hashPassword('correct-password')
    const match = await comparePassword('wrong-password', hash)
    expect(match).toBe(false)
  })
})
