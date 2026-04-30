# ADR-0001: Admin Dashboard for Portfolio CMS

## Context

The public portfolio at `app/(public)/**` is live and consumes the existing Route Handlers under `app/api/**`. There is no admin UI yet — the owner (John, sole admin) currently must edit content directly in the database. The APIs are already protected by `requireAdmin(request)` (JWT Bearer-token auth from `lib/auth/middleware.ts`), and `POST /api/auth/login` returns `{ user, token }`. We need to build an admin section that lets John log in, see counts, and run full CRUD on the six content entities (Project, Experience, Education, Certification, Volunteer, ContactMessage) plus read-only inbox + mark-as-read for messages. The admin UI is French-only.

Constraints surfaced during grounding that override several prompt assumptions:

- Real auth is **JWT in `Authorization: Bearer` header**, NOT NextAuth `getServerSession`. Token is stored client-side in a non-HttpOnly cookie via `lib/auth/session.ts`. Server Components therefore cannot transparently read it.
- The prompt says `GET /api/contact` lists messages — it does not. Only `POST /api/contact` exists. A new admin-only `GET /api/messages` (and `PATCH /api/messages/[id]` to mark read) must be added.
- The prompt says `admin.*` i18n keys exist — they do not. Since admin is FR-only, we hardcode FR strings in admin components (no `<T>` wrapping).
- Project Prisma models carry bilingual fields (`titleFr/titleEn`, `descriptionFr/En`, etc.) but the Zod schemas in `lib/schemas/*.schema.ts` do not. Admin forms must edit these; schemas need to be extended (separately tracked in step 1).

## Decision

Build the admin under `app/admin/` as a **client-side authenticated SPA-style island** mounted on top of the existing JWT API. We do this because the auth token lives in a non-HttpOnly browser cookie — Server Components cannot read it without a refactor we are not doing in this ADR. Concretely:

1. **Auth gate** lives in a client `app/admin/layout.tsx` that calls `GET /api/auth/verify` on mount (using the cookie token via a small `lib/admin/api-client.ts` axios instance) and redirects to `/admin/login` on 401. Login page is the only public route inside `/admin`.
2. **Pages** are Client Components (`'use client'`) that fetch list/detail data through `lib/admin/api-client.ts`. Forms use React Hook Form + zodResolver with the **same** Zod schemas from `lib/schemas/`, extended in step 1 to cover bilingual fields.
3. **Shared components** live in `components/admin/` — `AdminShell` (sidebar + topbar + main), `AdminTable` (generic list with sort/delete/edit), `AdminForm` field primitives (`FormField`, `ArrayField` for `string[]`, `DateField`, `BilingualField` for `{base, fr, en}` triplets), `StatCard`, `EmptyState`, `ConfirmDialog`. All `.tsx` with explicit prop contracts.
4. **Two new API endpoints** are required: `GET /api/messages` (admin) and `PATCH /api/messages/[id]` (admin) for the inbox. Backend-dev creates these following the existing `requireAdmin` + Zod + `handleApiError` pattern.
5. **Dashboard stats** come from a single new admin endpoint `GET /api/admin/stats` returning counts (one Prisma `$transaction` of `count` queries) — avoids six round-trips from the client.

This is intentionally **boring**: same axios client, same Zod, same Tailwind primitives, same Prisma singleton. The friction (client-side auth gate instead of Server-Component fetching) is dictated by the existing JWT-in-non-HttpOnly-cookie design and is documented as a follow-up in Risks.

## Alternatives considered

- **Server-Component data fetching with NextAuth**: would let pages be Server Components and use `getServerSession`. Rejected — the project's APIs are already `requireAdmin` JWT; converting would touch every route handler, the login flow, and the cookie storage. Out of scope for this ADR.
- **Edge middleware (`middleware.ts`) for the auth redirect**: rejected because the JWT cookie is `auth_token` (non-HttpOnly, set client-side post-login) and we'd still need a client-side recheck after refresh. Adds a moving part without removing the client check.
- **Single mega-form per entity vs. shared `AdminForm` factory**: rejected the factory because the entities differ enough (achievements, technologies, bilingual triplets, GPA, credentialUrl) that a generic factory becomes a config soup. Picked per-entity form components that compose shared field primitives.
- **Drag-and-drop reordering in v1**: deferred. CLAUDE.md mentions it as a convention but it's not blocking. Order is editable as an integer field; DnD is a separate ADR.

## Implementation plan

> Owner labels reference the agent routing table in CLAUDE.md.

1. [ ] **Extend Zod schemas to cover bilingual fields and add admin-only schemas**: update `lib/schemas/{project,experience,education,certification,volunteer}.schema.ts` to add optional `titleFr/titleEn`, `descriptionFr/En`, etc., matching the Prisma models exactly. Add new `lib/schemas/message.schema.ts` (`messageUpdateSchema = z.object({ read: z.boolean() })`). Add `lib/schemas/login.schema.ts` (extracted from inline schema in `app/api/auth/login/route.ts`). — owner: `@backend-dev`

2. [ ] **Add missing admin API endpoints**: create `app/api/messages/route.ts` (`GET` admin, lists `ContactMessage` ordered by `createdAt desc`; supports `?unread=true`), `app/api/messages/[id]/route.ts` (`PATCH` admin via `messageUpdateSchema`, `DELETE` admin), and `app/api/admin/stats/route.ts` (`GET` admin, returns `{ projects, experiences, education, certifications, volunteer, messages, unreadMessages }` via one `prisma.$transaction([...counts])`). All follow the existing `requireAdmin` + `ZodError`/`Prisma.PrismaClientKnownRequestError` pattern from `app/api/projects/route.ts`. — owner: `@backend-dev`

3. [ ] **Build the admin API client and auth helpers**: create `lib/admin/api-client.ts` (axios instance with a request interceptor that reads `auth_token` cookie via `getAuthCookie()` and attaches `Authorization: Bearer`; a response interceptor that on 401 calls `clearAuthCookie()` and `window.location.href = '/admin/login'`). Add `lib/admin/use-require-auth.ts` (client hook that calls `GET /api/auth/verify` once on mount, returns `{ user, loading }`, redirects on failure). — owner: `@frontend-dev`

4. [ ] **Build shared admin layout + primitives in `components/admin/`**: `AdminShell.tsx` (sidebar nav with links to dashboard + each entity + messages + logout button; topbar with user name; `children` slot), `AdminTable.tsx` (generic `<T>` table with columns config, row actions: Edit/Delete, empty state, loading skeleton), `AdminForm/FormField.tsx` (label + Input + error), `AdminForm/ArrayField.tsx` (controlled chip-style input for `string[]` — technologies, achievements, skills), `AdminForm/BilingualField.tsx` (renders the `base / FR / EN` triplet for one logical field), `AdminForm/DateField.tsx` (date input wrapping `Input type="text"` with format hint), `StatCard.tsx`, `EmptyState.tsx`, `ConfirmDialog.tsx` (wraps existing `components/ui/Modal.js`). Document prop contracts in component JSDoc. — owner: `@frontend-dev`

5. [ ] **Build admin pages (Client Components)**:
   - `app/admin/layout.tsx` — `'use client'`, mounts `AdminShell`, calls `useRequireAuth()`, renders login page if `pathname === '/admin/login'` without the shell.
   - `app/admin/login/page.tsx` — login form; on submit `POST /api/auth/login`, store token via `setAuthCookie()`, redirect to `/admin`.
   - `app/admin/page.tsx` — dashboard: fetches `/api/admin/stats`, renders one `StatCard` per entity + a "Messages non lues" tile linking to `/admin/messages`.
   - `app/admin/projects/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — list/create/edit. Mirror this structure for `experiences`, `education`, `certifications`, `volunteer`.
   - `app/admin/messages/page.tsx` — list inbox (read/unread badge); `[id]/page.tsx` — read full message + mark-as-read + delete.
   - Each entity has its own `<EntityForm>` Client Component in `components/admin/forms/` (e.g. `ProjectForm.tsx`) consuming the shared field primitives. — owner: `@frontend-dev`

6. [ ] **Wire logout + 401 handling**: `LogoutButton.tsx` clears the cookie and pushes `/admin/login`. Confirm 401 interceptor in `api-client.ts` catches expired tokens during a session. — owner: `@frontend-dev`

7. [ ] **Manual smoke test + screenshots**: verify each entity create → list → edit → delete loop, login + logout, 401 redirect on stale token, empty states, validation errors surfaced from API. — owner: `@test-runner` (manual until Vitest/Playwright is set up per CLAUDE.md TODO)

8. [ ] **Security + code review pass**: `@security-auditor` confirms no token logging, no admin route reachable without `/api/auth/verify` 200, no raw Prisma user objects returned. `@code-reviewer` final pass. — owner: `@security-auditor` then `@code-reviewer`

## File list (in implementation order)

### Step 1 — schemas (backend-dev)
- `lib/schemas/project.schema.ts` — extended: bilingual fields added, `partial()` update schema unchanged
- `lib/schemas/experience.schema.ts` — extended: `titleFr/En`, `descriptionFr/En`, `achievementsFr/En`
- `lib/schemas/education.schema.ts` — extended: `degreeFr/En`, `fieldFr/En`, `descriptionFr/En`, `noteFr/En`
- `lib/schemas/certification.schema.ts` — extended: `titleFr/En`, `descriptionFr/En`
- `lib/schemas/volunteer.schema.ts` — extended: `titleFr/En`, `descriptionFr/En`
- `lib/schemas/message.schema.ts` — NEW: `messageUpdateSchema` (`{ read: boolean }`)
- `lib/schemas/login.schema.ts` — NEW: extracted from `app/api/auth/login/route.ts` so frontend login form can share it

### Step 2 — APIs (backend-dev)
- `app/api/messages/route.ts` — NEW: `GET` admin lists messages
- `app/api/messages/[id]/route.ts` — NEW: `PATCH`, `DELETE` admin
- `app/api/admin/stats/route.ts` — NEW: `GET` admin returns counts via `prisma.$transaction`
- `app/api/auth/login/route.ts` — refactor to import `loginSchema` from `lib/schemas/login.schema.ts` (no behavior change)

### Step 3 — admin client infrastructure (frontend-dev)
- `lib/admin/api-client.ts` — NEW: axios instance + interceptors
- `lib/admin/use-require-auth.ts` — NEW: client hook for auth gate
- `lib/admin/types.ts` — NEW: shared admin DTO types (e.g. `AdminStats`, derived from `z.infer` where possible)

### Step 4 — shared admin components (frontend-dev)
- `components/admin/AdminShell.tsx` — NEW: sidebar + topbar + main
- `components/admin/AdminSidebar.tsx` — NEW: nav links
- `components/admin/AdminTable.tsx` — NEW: generic typed table with row actions
- `components/admin/StatCard.tsx` — NEW
- `components/admin/EmptyState.tsx` — NEW
- `components/admin/ConfirmDialog.tsx` — NEW: wraps `components/ui/Modal.js`
- `components/admin/LogoutButton.tsx` — NEW
- `components/admin/forms/FormField.tsx` — NEW
- `components/admin/forms/ArrayField.tsx` — NEW: `string[]` chip input
- `components/admin/forms/BilingualField.tsx` — NEW: `{base, fr, en}` triplet
- `components/admin/forms/DateField.tsx` — NEW
- `components/admin/forms/SwitchField.tsx` — NEW: for `featured`, `current`, `read`
- `components/admin/forms/ProjectForm.tsx` — NEW
- `components/admin/forms/ExperienceForm.tsx` — NEW
- `components/admin/forms/EducationForm.tsx` — NEW
- `components/admin/forms/CertificationForm.tsx` — NEW
- `components/admin/forms/VolunteerForm.tsx` — NEW

### Step 5 — admin pages (frontend-dev)
- `app/admin/layout.tsx` — NEW: client auth gate + AdminShell
- `app/admin/page.tsx` — NEW: dashboard (stats)
- `app/admin/login/page.tsx` — NEW: login form
- `app/admin/projects/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — NEW
- `app/admin/experiences/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — NEW
- `app/admin/education/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — NEW
- `app/admin/certifications/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — NEW
- `app/admin/volunteer/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — NEW
- `app/admin/messages/page.tsx`, `[id]/page.tsx` — NEW (read-only list + detail with mark-read/delete)

## Acceptance criteria

- [ ] Visiting `/admin` while logged out redirects to `/admin/login` within one tick (no flash of admin content).
- [ ] `POST /api/auth/login` with valid creds stores `auth_token` cookie and redirects to `/admin`; the dashboard renders six stat tiles + an "unread messages" tile reading from `GET /api/admin/stats`.
- [ ] For each of `projects`, `experiences`, `education`, `certifications`, `volunteer`: list page renders rows from the public `GET /api/<entity>`; "Nouveau" button leads to a form that successfully `POST`s to the API and redirects to the list; clicking a row leads to an edit form that `PUT`s and redirects; delete row triggers `ConfirmDialog` then `DELETE` then refreshes the list.
- [ ] Bilingual fields (`titleFr/titleEn`, `descriptionFr/descriptionEn`, etc.) are editable in each entity form and round-trip through the API.
- [ ] `Messages` page lists `ContactMessage` rows with read/unread badge; opening one calls `PATCH /api/messages/[id]` with `{ read: true }`; delete works.
- [ ] Forms surface server-side Zod errors (400 `details`) inline next to the offending field via React Hook Form's `setError`.
- [ ] Logout button clears the cookie and redirects to `/admin/login`; the dashboard is no longer reachable.
- [ ] An expired/invalid token causes any admin API call to redirect to `/admin/login` (via the response interceptor).
- [ ] No `.js` / `.jsx` files are introduced under `app/admin/**` or `components/admin/**` — Language Policy holds.
- [ ] No `new PrismaClient()` in any new file; all DB access via `@/lib/db/prisma`.
- [ ] No raw `User` Prisma object returned from any new endpoint (admin stats has no user fields; `/api/auth/verify` already returns a `select`-ed DTO).
- [ ] `npm run build` (which runs `tsc`) passes with no `any` and no `@ts-ignore`.

## Risks & rollback

- **Risk: Non-HttpOnly `auth_token` cookie is XSS-readable** → **Mitigation**: out of scope for this ADR but flag a follow-up ADR to migrate to NextAuth or HttpOnly cookies set server-side. Document in `docs/adr/0002-auth-hardening.md` (placeholder). For now: ensure no admin code logs request bodies, no `dangerouslySetInnerHTML`, and CSP headers in `next.config.js` (already set) stay strict.
- **Risk: Two parallel auth systems coexist** (`lib/auth/config.js` NextAuth + `lib/auth/jwt.ts` hand-rolled) → **Mitigation**: this ADR uses the JWT one because that's what the APIs require. Add a comment in `lib/auth/config.js` marking it "unused — pending decision in ADR-0002".
- **Risk: Bilingual schema extension could break the existing public `POST` endpoints** if any caller sends the strict shape → **Mitigation**: all new fields are `optional().nullable()`. Verify with `npm run build` and a manual `POST` to one existing endpoint before merging step 1.
- **Risk: `/api/admin/stats` fan-out becomes slow as data grows** → **Mitigation**: with curated content (< 100 entries total, per CLAUDE.md business context) `count()` over six tables is sub-10ms; no caching needed at this scale. Revisit only if `@performance-optimizer` flags it.
- **Risk: Admin pages being all-client breaks the project's "Server Components by default" convention** → **Mitigation**: documented exception in this ADR. The constraint is a property of the existing JWT-in-cookie auth, not a stylistic choice. Convention is preserved on public pages.
- **Rollback**: each step is independently revertible. Step 1 (schema extensions) is additive (all optional). Step 2 (new endpoints) — delete the three new files. Steps 3–6 — delete `app/admin/**`, `components/admin/**`, `lib/admin/**`. The public site, public APIs, and login flow are untouched. Rollback in prod = redeploy previous commit; no DB migration is required (no `prisma migrate` in this ADR).

## Status

READY_FOR_BUILD

> Next step: Invoke `@backend-dev` on step 1 (schema extension) and step 2 (new admin API endpoints), then `@frontend-dev` on steps 3–6. `@security-auditor` reviews before merge.
