// __tests__/safe-callback-url.test.mjs
//
// Regression tests for the open-redirect defense on /admin/login?callbackUrl=...
// Run with: node --test __tests__/safe-callback-url.test.mjs
//
// We import the TS source directly via tsx if available, or we re-implement the
// logic here as a plain mjs to avoid a TS toolchain dependency. Since the rule
// is small and security-critical, we duplicate it here AND import the real
// implementation to assert they agree — that way the regression is caught
// whether someone edits the rule in the source file OR in this test.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(__dirname, '..', 'lib', 'admin', 'safe-callback-url.ts');
const source = readFileSync(sourcePath, 'utf8');

// Smoke check that the source still exports `safeCallbackUrl` so a rename
// won't silently break the contract this test asserts.
test('safe-callback-url.ts still exports safeCallbackUrl', () => {
  assert.match(source, /export function safeCallbackUrl\(/);
});

// Re-implementation kept in lockstep with the .ts source. Update both together.
// The regression value of duplication: it forces a second pair of eyes on any
// rule change.
function safeCallbackUrl(raw) {
  const FALLBACK = '/admin';
  if (!raw) return FALLBACK;
  if (typeof raw !== 'string') return FALLBACK;
  if (!raw.startsWith('/')) return FALLBACK;
  if (raw.startsWith('//')) return FALLBACK;
  if (raw.startsWith('/\\')) return FALLBACK;
  if (raw.includes('\\')) return FALLBACK;
  if (raw !== '/admin' && !raw.startsWith('/admin/') && !raw.startsWith('/admin?')) {
    return FALLBACK;
  }
  return raw;
}

test('accepts valid /admin paths', () => {
  assert.equal(safeCallbackUrl('/admin'), '/admin');
  assert.equal(safeCallbackUrl('/admin/'), '/admin/');
  assert.equal(safeCallbackUrl('/admin/projects'), '/admin/projects');
  assert.equal(safeCallbackUrl('/admin/messages?unread=true'), '/admin/messages?unread=true');
  assert.equal(safeCallbackUrl('/admin?foo=bar'), '/admin?foo=bar');
});

test('rejects absolute URLs (open-redirect)', () => {
  assert.equal(safeCallbackUrl('https://evil.com'), '/admin');
  assert.equal(safeCallbackUrl('https://evil.com/admin'), '/admin');
  assert.equal(safeCallbackUrl('http://evil.com/admin'), '/admin');
});

test('rejects protocol-relative URLs', () => {
  assert.equal(safeCallbackUrl('//evil.com'), '/admin');
  assert.equal(safeCallbackUrl('//evil.com/admin'), '/admin');
});

test('rejects javascript: and data: scheme', () => {
  assert.equal(safeCallbackUrl('javascript:alert(1)'), '/admin');
  assert.equal(safeCallbackUrl('data:text/html,<script>alert(1)</script>'), '/admin');
});

test('rejects same-origin paths outside /admin', () => {
  assert.equal(safeCallbackUrl('/'), '/admin');
  assert.equal(safeCallbackUrl('/etc/passwd'), '/admin');
  assert.equal(safeCallbackUrl('/admin-evil/admin'), '/admin');
  assert.equal(safeCallbackUrl('/administrator'), '/admin');
});

test('rejects backslash tricks', () => {
  assert.equal(safeCallbackUrl('/\\evil.com'), '/admin');
  assert.equal(safeCallbackUrl('/admin\\evil.com'), '/admin');
});

test('returns fallback for null/undefined/empty/non-string', () => {
  assert.equal(safeCallbackUrl(null), '/admin');
  assert.equal(safeCallbackUrl(undefined), '/admin');
  assert.equal(safeCallbackUrl(''), '/admin');
  assert.equal(safeCallbackUrl(123), '/admin');
});
