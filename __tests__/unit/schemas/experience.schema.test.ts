import { describe, it, expect } from 'vitest'
import { experienceSchema } from '@/lib/schemas/experience.schema'

describe('experienceSchema', () => {
  const validInput = {
    title: 'Développeur Full-Stack',
    company: 'Acme Corp',
    location: 'Ottawa, ON',
    startDate: '2022-01-01',
    description: 'Développement de fonctionnalités web complètes.',
    achievements: ['Livré un produit en 3 mois'],
    technologies: ['React', 'Node.js'],
  }

  it('should accept a valid experience entry', () => {
    const result = experienceSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should default current to false and order to 0', () => {
    const result = experienceSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.current).toBe(false)
      expect(result.data.order).toBe(0)
    }
  })

  it('should accept endDate as null (ongoing role)', () => {
    const result = experienceSchema.safeParse({ ...validInput, endDate: null, current: true })
    expect(result.success).toBe(true)
  })

  it('should reject title shorter than 2 characters', () => {
    const result = experienceSchema.safeParse({ ...validInput, title: 'A' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true)
    }
  })

  it('should reject empty achievements array', () => {
    const result = experienceSchema.safeParse({ ...validInput, achievements: [] })
    expect(result.success).toBe(false)
  })

  it('should reject empty technologies array', () => {
    const result = experienceSchema.safeParse({ ...validInput, technologies: [] })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid companyUrl', () => {
    const result = experienceSchema.safeParse({ ...validInput, companyUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('should coerce startDate string to a Date', () => {
    const result = experienceSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
    }
  })
})
