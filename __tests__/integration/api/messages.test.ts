import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/db/prisma')
vi.mock('@/lib/auth/middleware')

import { prisma, resetMocks } from '@/lib/db/__mocks__/prisma'
import { requireAdmin } from '@/lib/auth/middleware'
import { GET } from '@/app/api/messages/route'

const mockRequireAdmin = vi.mocked(requireAdmin)
const adminPayload = { userId: 'user-1', email: 'admin@example.com', name: 'Admin', role: 'admin' }

function buildRequest(url = 'http://localhost/api/messages'): NextRequest {
  return new NextRequest(url, { method: 'GET' })
}

beforeEach(() => {
  resetMocks()
})

describe('GET /api/messages', () => {
  it('should return 401 when no auth token is present', async () => {
    // Arrange
    mockRequireAdmin.mockResolvedValue(
      NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    )

    // Act
    const res = await GET(buildRequest())

    // Assert
    expect(res.status).toBe(401)
    expect(prisma.contactMessage.findMany).not.toHaveBeenCalled()
  })

  it('should return 200 with the full messages list when admin is authenticated', async () => {
    // Arrange
    mockRequireAdmin.mockResolvedValue(adminPayload)
    const mockMessages = [
      { id: 'm-1', name: 'Alice', email: 'alice@example.com', subject: null, message: 'Bonjour', read: false, createdAt: new Date() },
      { id: 'm-2', name: 'Bob', email: 'bob@example.com', subject: 'Job', message: 'Salut', read: true, createdAt: new Date() },
    ]
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue(mockMessages as never)

    // Act
    const res = await GET(buildRequest())
    const data = await res.json() as unknown[]

    // Assert
    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(2)
    expect(prisma.contactMessage.findMany).toHaveBeenCalledOnce()
  })

  it('should filter unread messages when ?unread=true is passed', async () => {
    // Arrange
    mockRequireAdmin.mockResolvedValue(adminPayload)
    const unreadOnly = [
      { id: 'm-1', name: 'Alice', email: 'alice@example.com', subject: null, message: 'Bonjour', read: false, createdAt: new Date() },
    ]
    vi.mocked(prisma.contactMessage.findMany).mockResolvedValue(unreadOnly as never)

    // Act
    const res = await GET(buildRequest('http://localhost/api/messages?unread=true'))
    const data = await res.json() as unknown[]

    // Assert
    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(prisma.contactMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { read: false } })
    )
  })
})
