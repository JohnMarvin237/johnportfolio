import { describe, it, expect } from 'vitest'
import { projectSchema } from '@/lib/schemas/project.schema'

describe('projectSchema', () => {
  const validInput = {
    title: 'Mon Portfolio',
    description: 'Un portfolio Next.js complet avec admin.',
    technologies: ['Next.js', 'TypeScript'],
  }

  it('should accept a minimal valid project', () => {
    const result = projectSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should default featured to false and order to 0', () => {
    const result = projectSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.featured).toBe(false)
      expect(result.data.order).toBe(0)
    }
  })

  it('should accept optional nullable URL fields as null', () => {
    const result = projectSchema.safeParse({ ...validInput, imageUrl: null, demoUrl: null, githubUrl: null })
    expect(result.success).toBe(true)
  })

  it('should reject title shorter than 3 characters', () => {
    const result = projectSchema.safeParse({ ...validInput, title: 'AB' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true)
    }
  })

  it('should reject description shorter than 10 characters', () => {
    const result = projectSchema.safeParse({ ...validInput, description: 'Trop court' })
    // exactly 10 chars — should pass; 9 chars should fail
    const failing = projectSchema.safeParse({ ...validInput, description: 'Trop cour' })
    expect(failing.success).toBe(false)
  })

  it('should reject an empty technologies array', () => {
    const result = projectSchema.safeParse({ ...validInput, technologies: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('technologies'))).toBe(true)
    }
  })

  it('should reject an invalid imageUrl', () => {
    const result = projectSchema.safeParse({ ...validInput, imageUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('should coerce string dates to Date objects', () => {
    const result = projectSchema.safeParse({ ...validInput, startDate: '2024-01-01' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
    }
  })
})
