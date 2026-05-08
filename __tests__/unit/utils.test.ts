import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  formatDateRange,
  calculateDuration,
  truncate,
  slugify,
  isValidEmail,
  getInitials,
  getErrorMessage,
} from '@/lib/utils'

// ---------------------------------------------------------------------------
// cn — Tailwind class merging
// ---------------------------------------------------------------------------
describe('cn', () => {
  it('should merge two non-conflicting class strings', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('should resolve conflicting Tailwind utilities (last one wins)', () => {
    // tailwind-merge resolves text-sm vs text-lg — last one wins
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('should filter out falsy values', () => {
    expect(cn('p-4', false, undefined, null, 'mt-2')).toBe('p-4 mt-2')
  })

  it('should return an empty string when no valid classes are provided', () => {
    expect(cn()).toBe('')
  })

  it('should handle conditional class objects', () => {
    const isActive = true
    expect(cn('base', { active: isActive, disabled: false })).toBe('base active')
  })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('should format a Date object using the default fr-CA locale', () => {
    const result = formatDate(new Date('2020-01-15'))
    // fr-CA produces "janvier 2020"
    expect(result).toBe('janvier 2020')
  })

  it('should format an ISO string date', () => {
    // Use mid-month (15th) to avoid UTC-midnight timezone-boundary shifts.
    const result = formatDate('2023-06-15')
    expect(result).toBe('juin 2023')
  })

  it('should return "Présent" when the date is null', () => {
    expect(formatDate(null)).toBe('Présent')
  })

  it('should return "Présent" when the date is undefined', () => {
    expect(formatDate(undefined)).toBe('Présent')
  })

  it('should respect an explicit locale override', () => {
    const result = formatDate(new Date('2020-01-15'), 'en-CA')
    expect(result).toBe('January 2020')
  })
})

// ---------------------------------------------------------------------------
// formatDateRange
// ---------------------------------------------------------------------------
describe('formatDateRange', () => {
  it('should format a range with both start and end dates', () => {
    // Use mid-month dates to avoid UTC-midnight timezone-boundary shifts.
    const result = formatDateRange('2020-01-15', '2022-01-15')
    expect(result).toBe('janvier 2020 - janvier 2022')
  })

  it('should display "Présent" when endDate is omitted', () => {
    const result = formatDateRange('2021-03-15')
    expect(result).toBe('mars 2021 - Présent')
  })

  it('should display "Présent" when endDate is explicitly null', () => {
    const result = formatDateRange('2021-03-15', null)
    expect(result).toBe('mars 2021 - Présent')
  })

  it('should respect a locale override for both ends of the range', () => {
    const result = formatDateRange('2020-01-15', '2022-06-15', 'en-CA')
    expect(result).toBe('January 2020 - June 2022')
  })
})

// ---------------------------------------------------------------------------
// calculateDuration
// ---------------------------------------------------------------------------
describe('calculateDuration', () => {
  it('should return years and months when both are non-zero', () => {
    // 2020-01 → 2022-04 = 27 months = 2 ans 3 mois
    expect(calculateDuration('2020-01-01', '2022-04-01')).toBe('2 ans 3 mois')
  })

  it('should return plural "ans" and omit months when they are zero', () => {
    // 2020-01 → 2022-01 = 24 months = 2 ans exactly
    expect(calculateDuration('2020-01-01', '2022-01-01')).toBe('2 ans')
  })

  it('should return singular "an" for exactly 1 year', () => {
    // 2021-01 → 2022-01 = 12 months = 1 an
    expect(calculateDuration('2021-01-01', '2022-01-01')).toBe('1 an')
  })

  it('should return only months when the duration is under a year', () => {
    // 2020-01 → 2020-05 = 4 months
    expect(calculateDuration('2020-01-01', '2020-05-01')).toBe('4 mois')
  })

  it('should accept Date objects in addition to strings', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2021-07-01')
    // 18 months = 1 an 6 mois
    expect(calculateDuration(start, end)).toBe('1 an 6 mois')
  })
})

// ---------------------------------------------------------------------------
// truncate
// ---------------------------------------------------------------------------
describe('truncate', () => {
  it('should truncate text that exceeds maxLength and append ellipsis', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...')
  })

  it('should return the original string when it is at exactly maxLength', () => {
    expect(truncate('Exact', 5)).toBe('Exact')
  })

  it('should return the original string when it is shorter than maxLength', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })

  it('should return an empty string unchanged when maxLength is positive', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('should handle a maxLength of 0 by returning only the ellipsis', () => {
    expect(truncate('anything', 0)).toBe('...')
  })
})

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------
describe('slugify', () => {
  it('should lowercase and replace spaces with hyphens', () => {
    expect(slugify('Mon Titre')).toBe('mon-titre')
  })

  it('should strip punctuation and special characters', () => {
    expect(slugify('Mon Titre!')).toBe('mon-titre')
  })

  it('should remove accents', () => {
    expect(slugify('héllo wörld')).toBe('hello-world')
  })

  it('should collapse multiple spaces and separators into a single hyphen', () => {
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
  })

  it('should strip leading and trailing hyphens', () => {
    expect(slugify('  spaces  ')).toBe('spaces')
  })

  it('should leave an already-slugified string unchanged', () => {
    expect(slugify('already-slugified')).toBe('already-slugified')
  })

  it('should return an empty string for an empty input', () => {
    expect(slugify('')).toBe('')
  })

  it('should preserve digits', () => {
    expect(slugify('Next.js 15')).toBe('next-js-15')
  })
})

// ---------------------------------------------------------------------------
// isValidEmail
// ---------------------------------------------------------------------------
describe('isValidEmail', () => {
  it('should return true for a standard email address', () => {
    expect(isValidEmail('john@example.com')).toBe(true)
  })

  it('should return true for a minimal valid email', () => {
    expect(isValidEmail('a@b.c')).toBe(true)
  })

  it('should return true for an email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })

  it('should return false for a string without @ symbol', () => {
    expect(isValidEmail('notanemail')).toBe(false)
  })

  it('should return false for a string missing the local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('should return false for a string with spaces', () => {
    expect(isValidEmail('with spaces@test.com')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// getInitials
// ---------------------------------------------------------------------------
describe('getInitials', () => {
  it('should return two uppercase initials for a first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should return a single initial for a single word name', () => {
    expect(getInitials('Alice')).toBe('A')
  })

  it('should return at most two initials even for a three-word name', () => {
    // slice(0, 2) caps output at 2 chars
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('should uppercase initials regardless of input casing', () => {
    expect(getInitials('john doe')).toBe('JD')
  })
})

// ---------------------------------------------------------------------------
// getErrorMessage
// ---------------------------------------------------------------------------
describe('getErrorMessage', () => {
  it('should return the message property of an Error instance', () => {
    expect(getErrorMessage(new Error('something went wrong'))).toBe('something went wrong')
  })

  it('should return a raw string error unchanged', () => {
    expect(getErrorMessage('plain string error')).toBe('plain string error')
  })

  it('should return the fallback message for null', () => {
    expect(getErrorMessage(null)).toBe('Une erreur est survenue')
  })

  it('should return the fallback message for a number', () => {
    expect(getErrorMessage(42)).toBe('Une erreur est survenue')
  })

  it('should return the fallback message for a plain object (even with a message key)', () => {
    // Plain objects are not Error instances and not strings — fallback applies
    expect(getErrorMessage({ message: 'from object' })).toBe('Une erreur est survenue')
  })

  it('should return the fallback message for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('Une erreur est survenue')
  })
})
