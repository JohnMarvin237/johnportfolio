# ADR-0002: Test Strategy & Vitest Toolchain

## Context

The portfolio (Next.js 16.0.8, React 19.2.0, TypeScript strict, Prisma 6, Zod 4) currently has zero test infrastructure. `package.json` declares `"test": "node --test"` and CI runs it, but the only test file is `__tests__/safe-callback-url.test.mjs` (a hand-rolled `.mjs` regression test that re-implements the rule rather than importing the `.ts` source). The codebase already ships features whose correctness is security-critical: the in-memory rate limiter, JWT sign/verify (uses `jsonwebtoken`, not `jose` as the prompt claimed), the `requireAdmin` middleware, the public `POST /api/contact` route, and the public Zod schemas shared with React Hook Form. We need a pragmatic test toolchain that catches regressions in those surfaces without adding ops weight (no Docker, no test DB) appropriate for a single-developer portfolio.

## Decision

Adopt **Vitest** with three concentric test rings, all written in TypeScript (`.test.ts` / `.test.tsx`):

1. **Unit tests** for pure modules: Zod schemas, rate limiter, JWT helpers, `safeCallbackUrl`, mailer template builder. These are the highest-leverage tests and run in milliseconds.
2. **Integration tests** for Route Handlers: import the `POST` / `GET` exports directly, build a fake `NextRequest`, mock Prisma at the **client level** via `vi.mock('@/lib/db/prisma')`, and assert the `Response` shape, status, and side effects (rate-limit headers, Zod 400, 401/403 from `requireAdmin`). No real DB — per the prompt's constraint, we mock at the Prisma client boundary.
3. **Component tests** for a small, hand-picked set of `.tsx` components (`ContactForm`, `Button`, `Input`) using `@testing-library/react` + `jsdom`. We do NOT aim for blanket component coverage on a portfolio; the contract value is low and the maintenance cost is high.

Concrete pieces:

- `vitest.config.ts` with `@vitejs/plugin-react`, `vite-tsconfig-paths` (so `@/...` imports resolve), `environment: 'jsdom'`, and a `test/setup.ts` that loads `@testing-library/jest-dom` matchers and stubs required env vars.
- Tests live under `__tests__/{unit,integration,components}/` mirroring the source layout. The existing `__tests__/safe-callback-url.test.mjs` is rewritten to `__tests__/unit/safe-callback-url.test.ts` that imports the real source.
- A single `lib/db/__mocks__/prisma.ts` provides a `vi.fn()`-shaped Prisma client for integration tests; tests opt-in with `vi.mock('@/lib/db/prisma')`.
- CI: replace `npm test` body — keep the script name `test` (so the workflow line `run: npm test` is unchanged), point it at `vitest run`. No DB service needed in the workflow.

## Alternatives considered

- **Jest + `next/jest`**: rejected. Slower cold start, ESM friction with Next 16 + Zod 4, and the project ships `vitest`-friendly Vite tooling already (`@vitejs/plugin-react` is one install). Vitest is the current Next.js docs-recommended stack.
- **Real Postgres test DB (Testcontainers / Supabase branch)**: rejected for now. Adds a Docker dependency in CI, secrets management, and 30–60 s of cold start for a portfolio whose API surface is mostly thin Prisma calls. Mocking at the Prisma client boundary catches Zod + auth + response-shape bugs, which is 90 % of the regression value. Revisit if a future feature has non-trivial query logic worth integration-testing against a real planner.
- **Playwright e2e**: deferred to a future ADR. E2E tests are most valuable when there are user flows with significant state — the public site is mostly read-only, and the admin is single-user. We will add Playwright only when we have a flow worth the maintenance.
- **`node --test` everywhere**: rejected. It cannot run `.tsx` without a custom loader, has no DOM, no jest-dom matchers, no module mocking. The existing `.mjs` test illustrates the cost: it duplicates the rule rather than testing the source.

## Implementation plan

1. [ ] **Add devDependencies and update `package.json` scripts.** Install `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`. Replace `"test": "node --test"` with `"test": "vitest run"` and add `"test:watch": "vitest"` and `"test:coverage": "vitest run --coverage"`. Add `@vitest/coverage-v8` only if step 6 chooses to enforce coverage. Files: `package.json`. — owner: `@devops-engineer`

2. [ ] **Create `vitest.config.ts` and `test/setup.ts`** at repo root. Config uses `defineConfig` from `vitest/config`, `react()`, `tsconfigPaths()`, `environment: 'jsdom'`, `globals: true`, `setupFiles: ['./test/setup.ts']`, `include: ['__tests__/**/*.test.{ts,tsx}']`, `exclude` defaults plus `node_modules` and `.next`. Setup file imports `@testing-library/jest-dom/vitest` and stubs env vars (`process.env.JWT_SECRET`, `JWT_EXPIRES_IN`, SMTP_*) so `lib/env.ts` parsing succeeds at import time. — owner: `@backend-dev`

3. [ ] **Add the Prisma mock factory** at `lib/db/__mocks__/prisma.ts`. Exports a `prisma` object whose models (`project`, `experience`, `education`, `certification`, `volunteer`, `contactMessage`, `user`) are objects of `vi.fn()`s for the methods we actually use (`findMany`, `findUnique`, `create`, `update`, `delete`, `count`, `$transaction`). Tests call `vi.mock('@/lib/db/prisma')` and then configure return values per case. Document the pattern in a top-of-file JSDoc. — owner: `@backend-dev`

4. [ ] **Write the unit-test ring** under `__tests__/unit/`:
   - `lib/schemas/contact.schema.test.ts` — happy path + each Zod branch (name too short, bad email, message too short/long, optional/null subject).
   - `lib/schemas/login.schema.test.ts`, `project.schema.test.ts`, `experience.schema.test.ts`, `education.schema.test.ts`, `certification.schema.test.ts`, `volunteer.schema.test.ts`, `message.schema.test.ts` — at least one happy + one failing case each.
   - `lib/server/rate-limit.test.ts` — sliding-window correctness: allows up to N, blocks N+1, resets after window using `vi.useFakeTimers()` to advance time. Verify `remaining` and `resetAt`.
   - `lib/auth/jwt.test.ts` — `generateToken` → `verifyToken` round-trip, expired token returns `null`, malformed token returns `null`, wrong secret returns `null`. `hashPassword` + `comparePassword` happy + wrong-password.
   - `lib/admin/safe-callback-url.test.ts` — replaces `__tests__/safe-callback-url.test.mjs`; imports the real source so the duplication note in the old file goes away. Delete the `.mjs` file in the same step.
   — owner: `@test-runner`

5. [ ] **Write the integration-test ring** under `__tests__/integration/` (TypeScript per Language Policy):
   - `api/contact.test.ts` — `vi.mock('@/lib/db/prisma')`, `vi.mock('@/lib/email/mailer')`, `vi.mock('@/lib/server/rate-limit')`. Cases: 201 happy path, 400 on Zod failure, 429 when rate limiter returns `allowed: false` (assert `Retry-After` header), 201 when email throws (resilient), 500 on Prisma throw.
   - `api/projects.test.ts` — GET public list (mocked Prisma returns array), POST 401 without token, POST 403 with non-admin token, POST 201 with admin token (mock `requireAdmin` to return a payload). Use `new NextRequest('http://localhost/api/projects', { method: 'POST', body: JSON.stringify(...) })`.
   - `api/messages.test.ts` — GET 401 unauth, GET 200 admin returns mocked list, GET filters when `?unread=true`.
   - `api/auth/login.test.ts` — happy path returns `{ user, token }` and Set-Cookie, 401 on bad creds, 400 on Zod failure.
   Helper at `test/helpers/request.ts` builds `NextRequest` with optional auth cookie or Bearer token. Helper at `test/helpers/mock-admin.ts` wraps `vi.mock('@/lib/auth/middleware')` to inject a fake admin payload. — owner: `@test-runner` with `@backend-dev` reviewing the auth-mock helper.

6. [ ] **Write the component-test ring** under `__tests__/components/`:
   - `ui/Button.test.tsx` — renders children, fires `onClick`, respects `disabled`, applies variant class.
   - `ui/Input.test.tsx` — renders label + error, forwards `onChange`, marks `required`.
   - `sections/ContactForm.test.tsx` — fills the four fields, mocks `fetch` (`vi.stubGlobal('fetch', vi.fn())`), submits, asserts loading state + success message; asserts client-side email regex validation surfaces an error before fetch is called. Wraps with a minimal `LanguageContext` provider stub since the component uses `useTranslation`.
   No coverage of `Hero`, sidebar, or admin-only forms in v1 — they're stable layout. — owner: `@test-runner` with `@frontend-dev` providing the `LanguageContext` test wrapper.

7. [ ] **Update CI workflow** `.github/workflows/ci.yml`. The line `run: npm test` stays (now invokes Vitest). Add `- name: Coverage report` step running `npm run test:coverage` only on PRs (optional, non-blocking); upload as artifact. No DB service is needed because integration tests mock Prisma. Confirm Node 20 is fine for Vitest 2.x. — owner: `@devops-engineer`

8. [ ] **Document the test conventions** in a short `__tests__/README.md` (one page): folder layout, how to mock Prisma, how to build a `NextRequest`, how to run a single file (`npm run test:watch -- contact`). — owner: `@test-runner`

## Acceptance criteria

- [ ] `npm test` runs Vitest and exits 0 locally and in CI.
- [ ] CI step "Run tests" uses Vitest (no `node --test`); the `__tests__/safe-callback-url.test.mjs` file is removed and the rule is covered by `__tests__/unit/safe-callback-url.test.ts` importing the real source.
- [ ] Every Zod schema in `lib/schemas/` has at least one happy-path and one failing-case test.
- [ ] `lib/server/rate-limit.ts` has a test proving the sliding window resets after `windowSec`.
- [ ] `lib/auth/jwt.ts` has a sign/verify round-trip test and a tampered/expired-token test.
- [ ] `app/api/contact/route.ts` integration test covers: 201 happy, 400 Zod, 429 rate-limited (asserts `Retry-After`), 201 when email throws.
- [ ] At least one admin-protected route (`/api/projects` POST or `/api/messages` GET) has 401, 403, and 200 cases.
- [ ] `ContactForm` component test exercises submit + success.
- [ ] No real DB is required to run tests — `npm test` works on a fresh clone with only `npm ci`.
- [ ] No `.js` / `.jsx` test files in `__tests__/integration/`. Unit tests for pure JS files (none currently) may be `.ts`; the policy is "TS for integration tests" per CLAUDE.md.
- [ ] No `any` without an inline `// eslint-disable-next-line` justification.
- [ ] `npm run typecheck` passes (test files are included since `tsconfig.json` includes `**/*.ts` / `**/*.tsx`).

## Risks & rollback

- **Risk: Mocking Prisma drifts from the real client shape, masking type errors after schema changes** → **Mitigation**: integration tests import types from `@prisma/client` (e.g. `Prisma.ProjectCreateInput`) when constructing fixtures, so a schema change forces a test edit. Re-run `npx prisma generate` in CI before tests (already done in workflow). When a real query bug bites, escalate to a real-DB integration test in a follow-up ADR.
- **Risk: `lib/env.ts` runs at import and crashes in tests without env vars** → **Mitigation**: `test/setup.ts` stubs the required vars before any module import via `vi.hoisted` or by ordering `setupFiles` first. Tested by step 2.
- **Risk: Rate-limiter test pollutes module state across tests** (the in-memory `Map` is a module singleton) → **Mitigation**: each rate-limit test uses a unique `key` (e.g. the test name) so windows don't overlap, plus `vi.useFakeTimers()` for time control.
- **Risk: jsdom incompatibilities with React 19 / framer-motion in `ContactForm`** → **Mitigation**: the test renders a stripped tree (no animations matter); if framer-motion warns, mock it via `vi.mock('framer-motion', () => ({ motion: new Proxy({}, { get: () => 'div' }) }))`. Document in `__tests__/README.md` if it triggers.
- **Risk: Adding Vitest shifts CI runtime** → **Mitigation**: Vitest cold start is ~3–5 s; the unit ring runs in well under 1 s. Net CI delta is negligible compared to the existing `tsc` step.
- **Rollback**: this ADR is purely additive. To rollback, revert the `package.json` script change, restore `__tests__/safe-callback-url.test.mjs`, and delete `vitest.config.ts`, `test/`, and the new `__tests__/{unit,integration,components}/` directories. No production code changes.

## Status

READY_FOR_BUILD

> Next step: Invoke `@devops-engineer` on step 1 (devDependencies + scripts), then `@backend-dev` on steps 2–3 (Vitest config + Prisma mock factory), then `@test-runner` on steps 4–6 (the three test rings), then `@devops-engineer` on step 7 (CI workflow update), and finally `@test-runner` on step 8 (README).
