import { describe, it, expect } from 'vitest'
import { educationSchema } from '@/lib/schemas/education.schema'

describe('educationSchema', () => {
  const validInput = {
    degree: 'Baccalauréat en informatique',
    institution: 'Université de Montréal',
    location: 'Montréal, QC',
    startDate: '2018-09-01',
  }

  it('should accept a minimal valid education entry', () => {
    const result = educationSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should default current to false and order to 0', () => {
    const result = educationSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.current).toBe(false)
      expect(result.data.order).toBe(0)
    }
  })

  it('should accept optional nullable fields as null', () => {
    const result = educationSchema.safeParse({
      ...validInput,
      field: null,
      endDate: null,
      description: null,
      note: null,
    })
    expect(result.success).toBe(true)
  })

  it('should reject degree shorter than 2 characters', () => {
    const result = educationSchema.safeParse({ ...validInput, degree: 'B' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('degree'))).toBe(true)
    }
  })

  it('should reject institution shorter than 2 characters', () => {
    const result = educationSchema.safeParse({ ...validInput, institution: 'U' })
    expect(result.success).toBe(false)
  })

  it('should reject location shorter than 2 characters', () => {
    const result = educationSchema.safeParse({ ...validInput, location: 'X' })
    expect(result.success).toBe(false)
  })

  it('should coerce startDate string to a Date', () => {
    const result = educationSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
    }
  })
})
