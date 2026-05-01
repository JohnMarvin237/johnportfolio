import { describe, it, expect } from 'vitest'
import { safeCallbackUrl } from '@/lib/admin/safe-callback-url'

describe('safeCallbackUrl', () => {
  describe('valid /admin paths — should be returned as-is', () => {
    it('should return /admin exactly', () => {
      expect(safeCallbackUrl('/admin')).toBe('/admin')
    })

    it('should return /admin/ with trailing slash', () => {
      expect(safeCallbackUrl('/admin/')).toBe('/admin/')
    })

    it('should return a deep /admin/ subpath', () => {
      expect(safeCallbackUrl('/admin/projects')).toBe('/admin/projects')
    })

    it('should return /admin with query string', () => {
      expect(safeCallbackUrl('/admin?foo=bar')).toBe('/admin?foo=bar')
    })

    it('should return a subpath with query string', () => {
      expect(safeCallbackUrl('/admin/messages?unread=true')).toBe('/admin/messages?unread=true')
    })
  })

  describe('open-redirect attacks — must return /admin', () => {
    it('should reject absolute https URL', () => {
      expect(safeCallbackUrl('https://evil.com')).toBe('/admin')
    })

    it('should reject absolute https URL that starts with /admin in the path', () => {
      expect(safeCallbackUrl('https://evil.com/admin')).toBe('/admin')
    })

    it('should reject absolute http URL', () => {
      expect(safeCallbackUrl('http://evil.com/admin')).toBe('/admin')
    })

    it('should reject protocol-relative URL //evil.com', () => {
      expect(safeCallbackUrl('//evil.com')).toBe('/admin')
    })

    it('should reject protocol-relative URL //evil.com/admin', () => {
      expect(safeCallbackUrl('//evil.com/admin')).toBe('/admin')
    })

    it('should reject javascript: scheme', () => {
      expect(safeCallbackUrl('javascript:alert(1)')).toBe('/admin')
    })

    it('should reject data: scheme', () => {
      expect(safeCallbackUrl('data:text/html,<script>alert(1)</script>')).toBe('/admin')
    })
  })

  describe('paths outside /admin — must return /admin', () => {
    it('should reject root /', () => {
      expect(safeCallbackUrl('/')).toBe('/admin')
    })

    it('should reject arbitrary same-origin path', () => {
      expect(safeCallbackUrl('/etc/passwd')).toBe('/admin')
    })

    it('should reject /admin-evil prefix (not the same as /admin)', () => {
      expect(safeCallbackUrl('/admin-evil/admin')).toBe('/admin')
    })

    it('should reject /administrator', () => {
      expect(safeCallbackUrl('/administrator')).toBe('/admin')
    })
  })

  describe('backslash normalisation tricks — must return /admin', () => {
    it('should reject /\\evil.com', () => {
      expect(safeCallbackUrl('/\\evil.com')).toBe('/admin')
    })

    it('should reject /admin\\evil.com', () => {
      expect(safeCallbackUrl('/admin\\evil.com')).toBe('/admin')
    })
  })

  describe('null / undefined / empty / non-string — must return /admin', () => {
    it('should return /admin for null', () => {
      expect(safeCallbackUrl(null)).toBe('/admin')
    })

    it('should return /admin for undefined', () => {
      expect(safeCallbackUrl(undefined)).toBe('/admin')
    })

    it('should return /admin for empty string', () => {
      expect(safeCallbackUrl('')).toBe('/admin')
    })
  })
})
