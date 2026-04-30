# Portfolio — John Marvin Ndekebitik Heliang

> Full-stack personal portfolio with a headless CMS, built with Next.js 16 and PostgreSQL.

**Live:** [https://johnportfolio-git-main-johnmarvin237s-projects.vercel.app](https://johnportfolio-git-main-johnmarvin237s-projects.vercel.app)

---

## What this is

A production-grade portfolio that serves two purposes at once:

1. **Public showcase** — presents projects, professional experience, education, certifications, and volunteer work to recruiters and collaborators.
2. **Admin CMS** — a password-protected dashboard lets the owner create, update, delete, and reorder every piece of content without touching the database directly.

The site is fully bilingual (FR/EN), supports dark mode, and is optimised for SEO with server-rendered pages.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19 + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon) |
| Auth | Custom JWT — `jose` + HttpOnly cookies |
| Email | Nodemailer (SMTP) |
| Deploy | Vercel + GitHub Actions CI/CD |

---

## Features

### Public site
- Animated hero section with framer-motion
- Projects grid with tech-stack badges and live/GitHub links
- Detailed experience timeline
- Education, certifications, and volunteer sections
- Contact form with server-side Zod validation and email notification
- Dark mode (system preference + manual toggle)
- Bilingual content (French / English) via i18n context
- Neon DB cold-start eliminated via `instrumentation.ts` keep-alive ping

### Admin dashboard (`/admin`)
- JWT authentication with HttpOnly, Secure, SameSite=Lax cookie
- Full CRUD for every content type (projects, experiences, education, certifications, volunteer, contact messages)
- Stats overview (entry counts, unread messages)
- Real-time form validation with shared Zod schemas
- Protected routes via server-side auth guard in the layout

### Security
- Rate limiting on the contact form (5 requests / 10 min per IP)
- Input validation with Zod on every API route before any DB access
- DTO mapping — raw Prisma models never returned directly
- Security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Role check (`role === 'admin'`) on every mutating API endpoint
- Environment variables validated at boot via Zod (`lib/env.ts`)

### CI/CD
- GitHub Actions: lint → typecheck → tests → Vercel deploy (on `main` push only)
- `node --test` built-in runner — no extra test framework dependency
- `postinstall` hook runs `prisma generate` so Vercel builds succeed without the generated client in the repo

---

## Project structure

```
app/
  (public)/           public portfolio pages
  admin/              admin CMS (auth-guarded)
  api/                REST Route Handlers (.ts)
components/
  ui/                 primitives — Button, Card, Input, Modal
  sections/           portfolio sections — Hero, Projects, Experience…
  admin/              admin-only components — AdminTable, AdminForm
lib/
  auth/               JWT sign/verify helpers
  db/prisma.ts        Prisma singleton
  schemas/            Zod schemas shared between forms and API handlers
  server/rate-limit.ts  in-memory sliding-window rate limiter
  email/mailer.ts     Nodemailer contact notification
  env.ts              env var validation at boot
prisma/
  schema.prisma
  seed.js             initial admin user + sample data
```

---

## Local setup

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or [Neon](https://neon.tech))

### Steps

```bash
git clone https://github.com/JohnMarvin237/johnportfolio.git
cd johnportfolio
npm install

# Copy and fill in environment variables
cp .env.example .env.local

# Generate Prisma client and run migrations
npx prisma migrate dev
npx prisma db seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

### Environment variables

See `.env.example` for the full list. Required variables:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32-char random string (`openssl rand -base64 48`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | SMTP credentials for contact form emails |
| `EMAIL_FROM` / `EMAIL_TO` | Sender address / recipient for contact notifications |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Initial admin account (seed only — rotate after first login) |

---

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build (runs tsc)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # node --test (built-in runner)
npm run db:seed      # seed the database
npm run db:studio    # Prisma Studio (visual DB browser)
npm run db:reset     # reset + re-migrate + re-seed
```

---

## Deployment

The project deploys automatically to Vercel on every push to `main` after CI passes.

Required GitHub repository secrets:

| Secret | Where to get it |
| --- | --- |
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `vercel env pull` or project settings |
| `VERCEL_PROJECT_ID` | `vercel env pull` or project settings |

All application env vars must also be set in Vercel → Project → Settings → Environment Variables.

---

## License

Private — all rights reserved. Not licensed for reuse.
