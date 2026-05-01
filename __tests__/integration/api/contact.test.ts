import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db/prisma')
vi.mock('@/lib/email/mailer')
vi.mock('@/lib/server/rate-limit')

import { prisma, resetMocks } from '@/lib/db/__mocks__/prisma'
import { rateLimit } from '@/lib/server/rate-limit'
import { POST } from '@/app/api/contact/route'

const mockRateLimit = vi.mocked(rateLimit)

const ALLOWED_RATE = { allowed: true, remaining: 4, resetAt: Date.now() + 600_000 }
const BLOCKED_RATE = { allowed: false, remaining: 0, resetAt: Date.now() + 300_000 }

function buildRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validBody = {
  name: 'Alice Dupont',
  email: 'alice@example.com',
  message: 'Bonjour, je souhaite vous contacter directement.',
}

beforeEach(() => {
  resetMocks()
  mockRateLimit.mockReturnValue(ALLOWED_RATE)
})

describe('POST /api/contact', () => {
  it('should return 201 and save the message when the body is valid', async () => {
    // Arrange
    const createdMessage = { id: 'msg-1', ...validBody, subject: null, read: false, createdAt: new Date() }
    vi.mocked(prisma.contactMessage.create).mockResolvedValue(createdMessage as never)

    // Act
    const res = await POST(buildRequest(validBody))
    const data = await res.json() as { message: string; id: string }

    // Assert
    expect(res.status).toBe(201)
    expect(data.message).toBe('Message envoyé avec succès')
    expect(data.id).toBe('msg-1')
    expect(prisma.contactMessage.create).toHaveBeenCalledOnce()
    expect(prisma.contactMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: validBody.email }),
      })
    )
  })

  it('should return 400 with details when the email is invalid', async () => {
    // Act
    const res = await POST(buildRequest({ ...validBody, email: 'not-an-email' }))
    const data = await res.json() as { error: string; details: unknown[] }

    // Assert
    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(Array.isArray(data.details)).toBe(true)
    expect(prisma.contactMessage.create).not.toHaveBeenCalled()
  })

  it('should return 429 with Retry-After header when rate limit is exceeded', async () => {
    // Arrange
    mockRateLimit.mockReturnValue(BLOCKED_RATE)

    // Act
    const res = await POST(buildRequest(validBody))

    // Assert
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).not.toBeNull()
    expect(prisma.contactMessage.create).not.toHaveBeenCalled()
  })

  it('should still return 201 when the mailer throws (resilient design)', async () => {
    // Arrange
    const { sendContactNotification } = await import('@/lib/email/mailer')
    vi.mocked(sendContactNotification).mockRejectedValue(new Error('SMTP unavailable'))

    const createdMessage = { id: 'msg-2', ...validBody, subject: null, read: false, createdAt: new Date() }
    vi.mocked(prisma.contactMessage.create).mockResolvedValue(createdMessage as never)

    // Act
    const res = await POST(buildRequest(validBody))

    // Assert — email failure must not surface as a 500
    expect(res.status).toBe(201)
    expect(prisma.contactMessage.create).toHaveBeenCalledOnce()
  })

  it('should return 500 when prisma.contactMessage.create throws', async () => {
    // Arrange
    vi.mocked(prisma.contactMessage.create).mockRejectedValue(new Error('DB connection lost'))

    // Act
    const res = await POST(buildRequest(validBody))
    const data = await res.json() as { error: string }

    // Assert
    expect(res.status).toBe(500)
    expect(data.error).toBeDefined()
  })
})
