import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Import is deferred inside each test suite using a unique key — the module-level
// store is persistent within a test run, so we isolate by key, not by re-import.
import { rateLimit } from '@/lib/server/rate-limit'

describe('rateLimit', () => {
  // Use fake timers so the sliding window can be advanced deterministically.
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow requests up to the limit', () => {
    const key = 'test-allow-up-to-limit'
    const opts = { limit: 3, windowSec: 60 }

    for (let i = 1; i <= 3; i++) {
      const result = rateLimit(key, opts)
      expect(result.allowed).toBe(true)
    }
  })

  it('should block the request at limit + 1', () => {
    const key = 'test-block-at-limit-plus-one'
    const opts = { limit: 3, windowSec: 60 }

    rateLimit(key, opts)
    rateLimit(key, opts)
    rateLimit(key, opts)

    const result = rateLimit(key, opts)
    expect(result.allowed).toBe(false)
  })

  it('should decrement remaining correctly', () => {
    const key = 'test-remaining-decrements'
    const opts = { limit: 5, windowSec: 60 }

    const first = rateLimit(key, opts)
    expect(first.remaining).toBe(4)

    const second = rateLimit(key, opts)
    expect(second.remaining).toBe(3)
  })

  it('should return remaining of 0 when the limit is exceeded', () => {
    const key = 'test-remaining-floors-at-zero'
    const opts = { limit: 2, windowSec: 60 }

    rateLimit(key, opts)
    rateLimit(key, opts)
    const over = rateLimit(key, opts)

    expect(over.remaining).toBe(0)
    expect(over.allowed).toBe(false)
  })

  it('should reset the window after windowSec seconds', () => {
    const key = 'test-window-resets'
    const opts = { limit: 2, windowSec: 60 }

    rateLimit(key, opts)
    rateLimit(key, opts)

    // Exhaust the limit
    const blocked = rateLimit(key, opts)
    expect(blocked.allowed).toBe(false)

    // Advance past the window
    vi.advanceTimersByTime(61 * 1000)

    // First request in the new window should be allowed again
    const fresh = rateLimit(key, opts)
    expect(fresh.allowed).toBe(true)
    expect(fresh.remaining).toBe(1)
  })

  it('should track separate keys independently', () => {
    const opts = { limit: 1, windowSec: 60 }

    const a = rateLimit('test-key-a', opts)
    const b = rateLimit('test-key-b', opts)

    expect(a.allowed).toBe(true)
    expect(b.allowed).toBe(true)

    // Second call for key-a should be blocked, key-b is untouched
    const a2 = rateLimit('test-key-a', opts)
    expect(a2.allowed).toBe(false)
  })
})
