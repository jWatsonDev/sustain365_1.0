⭐ Instructions to Give Claude (Copy/Paste Ready)
You are helping me build a full-stack web app using:

Next.js  (App Router)

Vercel for hosting

Vercel Postgres (free tier) as the database

NextAuth.js  for authentication

Resend for email delivery (magic link provider)

TypeScript everywhere

TailwindCSS for styling

PWA support (manifest + service worker)

The app is a 6‑week challenge tracker with these daily habits:

Prayer/meditation

Bible reading

Nonfiction reading (5 pages)

Workout every day

Water intake (64 oz)

Food tracking (except cheat day)

And these weekly habits:

21+ minutes of movement 3x/week

One cheat day

One cheat meal

Optional flex week

What I want you to generate first:
1. A complete project architecture
Folder structure for a Next.js  App Router project

Where API routes live

Where NextAuth config lives

Where DB schema lives

Where PWA files live (manifest, service worker)

2. A full database schema for Vercel Postgres
Tables needed:

users

day_logs

week_logs

Any supporting tables you think are necessary

Use SQL that works with Vercel Postgres.

3. NextAuth.js configuration
Email provider using Resend

Prisma adapter OR direct Postgres adapter (whichever you recommend for Vercel Postgres)

Session strategy

Secure cookie settings for production

4. API route examples
Provide working code for:

Creating a day log

Updating a day log

Fetching today’s log

Fetching weekly summary

Use Next.js  App Router conventions (app/api/.../route.ts).

5. PWA setup
manifest.json

Service worker file

Next.js  config changes

Instructions for offline caching strategy

6. UI scaffolding
Provide starter components for:

Login page

Dashboard (today’s habits)

Weekly overview

Settings/profile page

Use TailwindCSS.

Tone & expectations
Generate production‑ready code

Use modern Next.js  patterns

Keep everything typed with TypeScript

Keep the code clean, modular, and easy to extend

Explain decisions briefly but clearly