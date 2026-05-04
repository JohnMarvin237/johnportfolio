import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/db/prisma')
vi.mock('@/lib/auth/middleware')

import { prisma, resetMocks } from '@/lib/db/__mocks__/prisma'
import { requireAdmin } from '@/lib/auth/middleware'
import { GET, POST } from '@/app/api/projects/route'

const mockRequireAdmin = vi.mocked(requireAdmin)

const adminPayload = { userId: 'user-1', email: 'admin@example.com', name: 'Admin', role: 'admin' }

const validProjectBody = {
  title: 'Mon Portfolio',
  description: 'Un portfolio Next.js complet avec un panneau admin.',
  technologies: ['Next.js', 'TypeScript', 'Prisma'],
}

function buildRequest(method: string, body?: unknown, headers?: Record<string, string>): NextRequest {
  return new NextRequest('http://localhost/api/projects', {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

beforeEach(() => {
  resetMocks()
})

describe('GET /api/projects', () => {
  it('should return 200 with the projects array', async () => {
    // Arrange
    const mockProjects = [
      { id: 'p-1', title: 'Project A', technologies: ['React'], order: 0 },
      { id: 'p-2', title: 'Project B', technologies: ['Vue'], order: 1 },
    ]
    vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects as never)

    // Act
    const res = await GET(buildRequest('GET'))
    const data = await res.json() as unknown[]

    // Assert
    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(2)
    expect(prisma.project.findMany).toHaveBeenCalledOnce()
  })
})

describe('POST /api/projects', () => {
  it('should return 401 when no auth token is provided', async () => {
    // Arrange — requireAdmin returns a 401 NextResponse
    mockRequireAdmin.mockResolvedValue(
      NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    )

    // Act
    const res = await POST(buildRequest('POST', validProjectBody))

    // Assert
    expect(res.status).toBe(401)
    expect(prisma.project.create).not.toHaveBeenCalled()
  })

  it('should return 201 and create the project when the admin token is valid', async () => {
    // Arrange
    mockRequireAdmin.mockResolvedValue(adminPayload)
    const createdProject = { id: 'p-new', ...validProjectBody, order: 0, featured: false }
    vi.mocked(prisma.project.create).mockResolvedValue(createdProject as never)

    // Act
    const res = await POST(buildRequest('POST', validProjectBody))
    const data = await res.json() as { id: string }

    // Assert
    expect(res.status).toBe(201)
    expect(data.id).toBe('p-new')
    expect(prisma.project.create).toHaveBeenCalledOnce()
  })

  it('should return 400 when the request body fails schema validation', async () => {
    // Arrange — admin is authorised but body is invalid
    mockRequireAdmin.mockResolvedValue(adminPayload)

    // Act — missing required `description`
    const res = await POST(buildRequest('POST', { title: 'AB', technologies: [] }))
    const data = await res.json() as { error: string; details: unknown[] }

    // Assert
    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(Array.isArray(data.details)).toBe(true)
    expect(prisma.project.create).not.toHaveBeenCalled()
  })
})
