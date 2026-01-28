# Project Structure for sustain365

- app/              # Next.js App Router pages and routes
  - api/            # API routes (REST endpoints)
  - auth/           # NextAuth.js config and custom auth pages
- components/       # React components (UI)
- db/               # Database schema, migrations, and helpers
- pwa/              # PWA files (manifest, service worker)
- scripts/vercel/   # Vercel/Postgres setup scripts or docs
- styles/           # Tailwind and global CSS

## Key Files
- next.config.js    # Next.js config (PWA, etc.)
- tailwind.config.js# TailwindCSS config
- package.json      # Project dependencies
- README.md         # Project overview and setup

This structure follows modern Next.js and Vercel best practices.