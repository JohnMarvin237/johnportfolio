import { describe, it, expect } from 'vitest'
import { volunteerSchema } from '@/lib/schemas/volunteer.schema'

describe('volunteerSchema', () => {
  const validInput = {
    title: 'Bénévole enseignant',
    organization: 'Code Club Ottawa',
    startDate: '2021-09-01',
    description: 'Enseignement de la programmation aux jeunes de 10-14 ans.',
  }

  it('should accept a valid volunteer entry', () => {
    const result = volunteerSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should default current to false and order to 0', () => {
    const result = volunteerSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.current).toBe(false)
      expect(result.data.order).toBe(0)
    }
  })

  it('should accept location as null', () => {
    const result = volunteerSchema.safeParse({ ...validInput, location: null })
    expect(result.success).toBe(true)
  })

  it('should accept endDate as null', () => {
    const result = volunteerSchema.safeParse({ ...validInput, endDate: null })
    expect(result.success).toBe(true)
  })

  it('should reject title shorter than 2 characters', () => {
    const result = volunteerSchema.safeParse({ ...validInput, title: 'A' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true)
    }
  })

  it('should reject organization shorter than 2 characters', () => {
    const result = volunteerSchema.safeParse({ ...validInput, organization: 'X' })
    expect(result.success).toBe(false)
  })

  it('should reject description shorter than 10 characters', () => {
    const result = volunteerSchema.safeParse({ ...validInput, description: 'Trop court' })
    // exactly 10 chars should pass; 9 should fail
    const failing = volunteerSchema.safeParse({ ...validInput, description: 'Trop cour' })
    expect(failing.success).toBe(false)
  })

  it('should coerce startDate string to a Date', () => {
    const result = volunteerSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
    }
  })
})
