import { vi } from 'vitest'

const project = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}

const experience = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}

const education = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}

const certification = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}

const volunteer = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}

const contactMessage = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}

const user = {
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}

export const prisma = {
  project,
  experience,
  education,
  certification,
  volunteer,
  contactMessage,
  user,
}

type ModelWithFns = Record<string, ReturnType<typeof vi.fn>>

export function resetMocks(): void {
  for (const model of Object.values(prisma) as ModelWithFns[]) {
    for (const fn of Object.values(model)) {
      fn.mockReset()
    }
  }
}
