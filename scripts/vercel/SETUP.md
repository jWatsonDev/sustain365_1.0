# Vercel & Local Development Setup

## 1. Local Development

1. Copy `.env.example` to `.env` and fill in your values:
   ```sh
   cp .env.example .env
   # Edit .env with your Postgres, NextAuth, and Resend keys
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Push Prisma schema to your local or Vercel Postgres database:
   ```sh
   npx prisma db push
   ```
4. Start the dev server:
   ```sh
   npm run dev
   ```

## 2. Deploy to Vercel

1. Commit your code to GitHub/GitLab/Bitbucket.
2. Go to https://vercel.com/new and import your repo.
3. Set environment variables in the Vercel dashboard (from your `.env`).
4. Vercel will auto-deploy on push.

## 3. Provision Vercel Postgres (if needed)

- In the Vercel dashboard, add a Postgres database to your project.
- Copy the connection string to your `.env` as `DATABASE_URL`.

## 4. Useful CLI Commands

- To open a Vercel Postgres shell:
  ```sh
  vercel postgres shell
  ```
- To run migrations:
  ```sh
  npx prisma migrate deploy
  ```

---

See README.md for more details.