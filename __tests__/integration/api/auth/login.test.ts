import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db/prisma')
vi.mock('@/lib/auth/jwt', async (importOriginal) => {
  // Keep hashPassword and comparePassword real; mock only authenticateUser.
  const original = await importOriginal<typeof import('@/lib/auth/jwt')>()
  return {
    ...original,
    authenticateUser: vi.fn(),
  }
})

import { resetMocks } from '@/lib/db/__mocks__/prisma'
import { authenticateUser } from '@/lib/auth/jwt'
import { POST } from '@/app/api/auth/login/route'
import { SESSION_COOKIE_NAME } from '@/lib/auth/session'

const mockAuthenticateUser = vi.mocked(authenticateUser)

function buildRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  resetMocks()
  mockAuthenticateUser.mockReset()
})

describe('POST /api/auth/login', () => {
  it('should return 200 with user (no password) and set the session cookie on valid credentials', async () => {
    // Arrange
    const publicUser = { id: 'user-1', email: 'admin@example.com', name: 'Admin', role: 'admin' }
    mockAuthenticateUser.mockResolvedValue({ user: publicUser, token: 'signed-jwt-token' })

    // Act
    const res = await POST(buildRequest({ email: 'admin@example.com', password: 'secret123' }))
    const data = await res.json() as { user: typeof publicUser & { password?: string } }

    // Assert
    expect(res.status).toBe(200)
    expect(data.user.id).toBe('user-1')
    expect(data.user.email).toBe('admin@example.com')
    // password must never appear in the response
    expect('password' in data.user).toBe(false)

    // Cookie must be set
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).not.toBeNull()
    expect(setCookie).toContain(SESSION_COOKIE_NAME)
  })

  it('should return 401 when credentials are incorrect', async () => {
    // Arrange
    mockAuthenticateUser.mockResolvedValue(null)

    // Act
    const res = await POST(buildRequest({ email: 'admin@example.com', password: 'wrong-password' }))
    const data = await res.json() as { error: string }

    // Assert
    expect(res.status).toBe(401)
    expect(data.error).toBeDefined()
  })

  it('should return 400 when required fields are missing', async () => {
    // Act — no password field
    const res = await POST(buildRequest({ email: 'admin@example.com' }))
    const data = await res.json() as { error: string; details: unknown[] }

    // Assert
    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(Array.isArray(data.details)).toBe(true)
    expect(mockAuthenticateUser).not.toHaveBeenCalled()
  })

  it('should return 400 when the email is malformed', async () => {
    // Act
    const res = await POST(buildRequest({ email: 'not-valid', password: 'secret123' }))
    const data = await res.json() as { error: string; details: unknown[] }

    // Assert
    expect(res.status).toBe(400)
    expect(Array.isArray(data.details)).toBe(true)
    expect(mockAuthenticateUser).not.toHaveBeenCalled()
  })
})
