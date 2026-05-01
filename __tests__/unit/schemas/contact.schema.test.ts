import { describe, it, expect } from 'vitest'
import { contactMessageSchema } from '@/lib/schemas/contact.schema'

describe('contactMessageSchema', () => {
  const validInput = {
    name: 'Alice Dupont',
    email: 'alice@example.com',
    message: 'Bonjour, je souhaite vous contacter.',
  }

  it('should accept a valid payload without subject', () => {
    const result = contactMessageSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should accept a valid payload with subject', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, subject: 'Collaboration' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.subject).toBe('Collaboration')
  })

  it('should accept subject as null', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, subject: null })
    expect(result.success).toBe(true)
  })

  it('should accept subject when omitted entirely', () => {
    const { subject: _s, ...withoutSubject } = { ...validInput, subject: undefined }
    const result = contactMessageSchema.safeParse(withoutSubject)
    expect(result.success).toBe(true)
  })

  it('should reject name shorter than 2 characters', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid email', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true)
    }
  })

  it('should reject message shorter than 10 characters', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, message: 'Court' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('message'))).toBe(true)
    }
  })

  it('should reject message longer than 5000 characters', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, message: 'a'.repeat(5001) })
    expect(result.success).toBe(false)
  })

  it('should reject subject shorter than 3 characters when provided', () => {
    const result = contactMessageSchema.safeParse({ ...validInput, subject: 'AB' })
    expect(result.success).toBe(false)
  })
})
