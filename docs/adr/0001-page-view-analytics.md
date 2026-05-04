# ADR-0001: Page View Analytics (self-hosted, Prisma + `after()`)

## Context

Owner wants to see public-page visit counts (last 7 days, last 4 weeks, last 6 months) inside the existing custom admin dashboard at `app/admin/(protected)/`. Constraints from CLAUDE.md and prompt: stay on Vercel infra, prefer free, no external dashboards, TypeScript-strict, boring/maintainable. Stack is now Next.js **16** (verified: `next ^16.0.8` in `package.json`), which renames `middleware.ts` to `proxy.ts`, runs proxy on Node only, and explicitly discourages DB writes from inside proxy ("meant to be invoked separately of your render code… you should not attempt relying on shared modules or globals"). This shapes the tracking strategy.

## Decision

Build it ourselves with Prisma + Next.js 16's stable `after()` API. Add a `PageView` model, fire `after(() => prisma.pageView.create(...))` from a tiny Server Component (`<TrackPageView path={...} />`) embedded in the public route group's layout — this keeps tracking on the response's critical path *zero*, runs on Node, and never blocks rendering. Aggregation lives in a typed helper `lib/db/analytics.ts`, exposed via a new admin-only Route Handler `GET /api/admin/analytics`, and rendered in a new admin page `app/admin/(protected)/analytics/page.tsx` using **Recharts** (chosen over Chart.js for first-class React/TS APIs and easier server-rendered data → client-rendered chart pattern; bundle delta is ~80 KB and code-split via `next/dynamic`, acceptable for an admin-only page). Tracking is gated behind `if (!isBot && !isAdminCookie)` to keep counts honest without third-party services.

## Alternatives considered

- **Vercel Analytics (Option A)** — rejected: data lives on Vercel's dashboard, the embedding API requires the paid Pro plan. Violates "data IN the custom admin" constraint.
- **Plausible / Umami (Options C/D)** — rejected: Plausible Cloud costs ~$9/mo (avoidable); self-hosted Plausible/Umami means a second service to run, monitor, back up — over-engineering for a single-user portfolio.
- **`proxy.ts` for tracking (Option B variant)** — rejected: Next.js 16 docs explicitly warn against shared modules / DB calls in proxy ("deployed to your CDN for fast redirect/rewrite handling"). Also, `proxy` runs for every prefetch/RSC request, which would inflate counts.
- **Chart.js instead of Recharts** — rejected: smaller bundle (~213 KB vs ~290 KB) but the imperative API is awkward inside React 19 Server/Client boundaries; Recharts is purely declarative and the dashboard is admin-only (low-traffic), so bundle size matters less than DX.
- **Separate `analytics` DB / external store** — rejected: no scale problem to solve; a single table with two indexes handles years of personal-portfolio traffic.

## Implementation plan

1. [ ] **Schema** — add `PageView` model to `prisma/schema.prisma` with fields `id (cuid)`, `path String`, `visitedAt DateTime @default(now())`, `userAgent String?`, `country String?`, `referer String?`. Indexes: `@@index([visitedAt])`, `@@index([path, visitedAt])`. Generate migration `npx prisma migrate dev --name add_page_view`. — owner: `@db-schema-expert`
2. [ ] **Tracking helper** — create `lib/server/analytics-track.ts` exporting `trackPageView({ path, headers })` that filters obvious bots (regex on `user-agent`: `bot|crawler|spider|preview`) and skips when the `auth_token` cookie is present (don't count the admin's own visits). — owner: `@backend-dev`
3. [ ] **Tracker component** — create `components/analytics/TrackPageView.tsx` (Server Component, no `'use client'`). Reads `headers()` and `cookies()` once (per Next.js 16 `after()` rules for Server Components), then calls `after(() => trackPageView(...))`. Returns `null`. Render it inside `app/(public)/layout.tsx` (or root `app/layout.tsx` gated by path-prefix check) so every public page records exactly one hit per server render. — owner: `@frontend-dev` after step 2
4. [ ] **Aggregation helper** — create `lib/db/analytics.ts` with `getDailyCounts(days = 7)`, `getWeeklyCounts(weeks = 4)`, `getMonthlyCounts(months = 6)`. Use Prisma `$queryRaw` with `date_trunc('day' | 'week' | 'month', "visitedAt")` (PostgreSQL native) returning `{ bucket: Date; count: number }[]`. Cast `count` from `bigint` → `number`. — owner: `@backend-dev`
5. [ ] **Zod schema + DTO** — create `lib/schemas/analytics.schema.ts` defining `analyticsResponseSchema` (three arrays of `{ bucket: string (ISO); count: number }`) and exporting `type AnalyticsResponse = z.infer<...>`. — owner: `@backend-dev`
6. [ ] **API route** — create `app/api/admin/analytics/route.ts` with `GET` handler using `requireAdmin(request)` (existing pattern from `lib/auth/middleware.ts`); returns `AnalyticsResponse`. — owner: `@backend-dev`
7. [ ] **Admin page + chart** — install `recharts` (`npm i recharts`). Create `app/admin/(protected)/analytics/page.tsx` (client component) that fetches `/admin/analytics` via the existing `apiClient` from `@/lib/admin/api-client`, and renders three `<ResponsiveContainer><BarChart>` panels (daily/weekly/monthly). Use `next/dynamic` import for the chart subcomponent with `ssr: false` to defer the Recharts bundle. Add a sidebar entry in `components/admin/AdminShell` if one doesn't already exist for analytics. — owner: `@frontend-dev`
8. [ ] **Smoke test** — manual: visit 3 public pages, log in as admin, confirm counts appear; admin's own visits should NOT appear. (No Vitest tests yet — Phase 2 backlog item, defer to `@test-runner` when test infra lands.) — owner: developer

## Acceptance criteria

- [ ] `PageView` table exists in Postgres with the migration committed under `prisma/migrations/`.
- [ ] Visiting any public page (e.g. `/`, `/projects`, `/contact`) creates exactly one `PageView` row, with `path` matching the request path.
- [ ] Bot user-agents (string matches `/bot|crawler|spider|preview/i`) do NOT create rows.
- [ ] When the `auth_token` cookie is present, no row is created (admin self-visits excluded).
- [ ] `GET /api/admin/analytics` returns 401 when no admin token, 403 when token belongs to non-admin, and the typed payload otherwise.
- [ ] `/admin/analytics` page renders three charts (7-day daily, 4-week weekly, 6-month monthly) with data matching `prisma studio` counts within ±1.
- [ ] `npm run typecheck` passes; `npm run lint` passes; `npm run build` succeeds with the new page.
- [ ] Recharts is loaded only on the analytics page (verify with build output / network tab — not in any other route's chunk).

## Risks & rollback

- **Risk: tracker doubles a count** under React Strict Mode or RSC re-render → **Mitigation**: place the `<TrackPageView>` inside `app/(public)/layout.tsx` and rely on the fact that Server Components only render once per request; verify with a single page load creating exactly one row.
- **Risk: write amplification on a heavily-cached static page** → **Mitigation**: not a concern today (no `cacheComponents` enabled in `next.config.js`, pages are dynamic Server Components reading cookies). If ISR/Cache Components are adopted later, document that `after()` callbacks fire at build/revalidate time, not per-visit, and revisit (likely move tracking to a client-side `<script>` beacon).
- **Risk: PII / GDPR** — storing `userAgent` and (optionally) `country` may count as personal data under EU rules → **Mitigation**: hash IP rather than store, drop `userAgent` if the portfolio targets EU traffic, add a one-line cookie/privacy notice in the footer. Flag for `@security-auditor` review before deploy.
- **Risk: DB bloat over years** → **Mitigation**: add a maintenance script `scripts/prune-page-views.js` (allowed to be JS per Language Policy) that deletes rows older than 13 months; schedule via Vercel Cron or a manual quarterly run.
- **Rollback**: revert the migration (`npx prisma migrate resolve --rolled-back add_page_view` then `DROP TABLE "page_views"`), remove the `<TrackPageView>` import from the public layout, delete `app/admin/(protected)/analytics/`, uninstall `recharts`. No external dependencies, no auth changes — clean revert via single commit.

## Notes on prompt-vs-reality divergences (so the team isn't surprised)

- Prompt said "Next.js 16 App Router" and "deployed on Vercel" — verified correct (`next ^16.0.8`).
- Prompt referenced **`apiClient` (axios)** — correct, but located at `lib/admin/api-client.ts` (not `lib/api/client.ts`). Step 7 uses the real path.
- Prompt said "`requireAdmin` auth middleware" — verified at `lib/auth/middleware.ts`, exported as `requireAdmin(request)` returning `JWTPayload | NextResponse`. Step 6 uses this pattern.
- Prompt described CLAUDE.md auth as `getServerSession(authOptions)` — actual code uses **hand-rolled JWT** in `lib/auth/jwt.ts` + `lib/auth/middleware.ts` (cookie name `SESSION_COOKIE_NAME`). Bot/admin filtering in step 2 uses the same cookie.
- Prompt assumed `middleware.ts` was an option for tracking — in Next.js 16 the file is renamed to `proxy.ts`, runs Node-only, and the docs explicitly discourage shared-module/DB usage. ADR uses `after()` instead, which is the officially-blessed mechanism for non-blocking analytics ([Next.js `after()` docs](https://nextjs.org/docs/app/api-reference/functions/after)).

## Status

READY_FOR_BUILD

> Next step: Invoke `@db-schema-expert` on step 1 (Prisma migration), then `@backend-dev` on steps 2/4/5/6, then `@frontend-dev` on steps 3 and 7. Loop in `@security-auditor` before deploy for the PII review noted in Risks.
