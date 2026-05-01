import { describe, it, expect } from 'vitest'
import { certificationSchema } from '@/lib/schemas/certification.schema'

describe('certificationSchema', () => {
  const validInput = {
    title: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
  }

  it('should accept a minimal valid certification', () => {
    const result = certificationSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should default skills to empty array and order to 0', () => {
    const result = certificationSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.skills).toEqual([])
      expect(result.data.order).toBe(0)
    }
  })

  it('should accept optional nullable date fields', () => {
    const result = certificationSchema.safeParse({
      ...validInput,
      issueDate: null,
      expiryDate: null,
      credentialId: null,
      credentialUrl: null,
      description: null,
    })
    expect(result.success).toBe(true)
  })

  it('should reject title shorter than 2 characters', () => {
    const result = certificationSchema.safeParse({ ...validInput, title: 'A' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true)
    }
  })

  it('should reject issuer shorter than 2 characters', () => {
    const result = certificationSchema.safeParse({ ...validInput, issuer: 'X' })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid credentialUrl', () => {
    const result = certificationSchema.safeParse({ ...validInput, credentialUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('should reject skills array exceeding 15 items', () => {
    const result = certificationSchema.safeParse({
      ...validInput,
      skills: Array.from({ length: 16 }, (_, i) => `skill-${i}`),
    })
    expect(result.success).toBe(false)
  })

  it('should coerce issueDate string to a Date', () => {
    const result = certificationSchema.safeParse({ ...validInput, issueDate: '2023-06-01' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.issueDate).toBeInstanceOf(Date)
    }
  })
})
