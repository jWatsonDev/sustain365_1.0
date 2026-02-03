# Sustain365

A 6-week challenge tracker built with Next.js, Vercel Postgres, NextAuth.js, TypeScript, and TailwindCSS.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your environment variables (see `.env.example`).
3. Push the database schema:
   ```sh
   npx prisma db push
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```

## Authentication Flow

Uses NextAuth.js with Credentials provider (email/password). No external auth services required.

### Routes

| Route | Description |
|-------|-------------|
| `/auth/signup` | Create a new account |
| `/auth/signin` | Sign in with email/password |
| `/api/auth/register` | POST - Create user account |
| `/api/auth/[...nextauth]` | NextAuth API routes |

### Sign Up Flow

```
User visits /auth/signup
    ↓
Fills in name (optional), email, password (min 8 chars)
    ↓
POST /api/auth/register
    ↓
Password hashed with bcrypt (12 rounds)
    ↓
User created in database
    ↓
Redirect to /auth/signin
```

### Sign In Flow

```
User visits /auth/signin
    ↓
Enters email and password
    ↓
POST /api/auth/callback/credentials
    ↓
NextAuth validates credentials against database
    ↓
JWT token created (no database sessions)
    ↓
Session cookie set
    ↓
Redirect to callback URL (default: /)
```

### Session Management

- **Strategy:** JWT (stateless, no session table)
- **Storage:** HTTP-only cookie
- **Access:** `useSession()` hook (client) or `getServerSession()` (server)

### Key Files

```
lib/auth.ts                         # NextAuth configuration
lib/prisma.ts                       # Prisma client singleton
app/api/auth/[...nextauth]/route.ts # NextAuth API handler
app/api/auth/register/route.ts      # User registration endpoint
app/auth/signin/page.tsx            # Sign in page
app/auth/signup/page.tsx            # Sign up page
prisma/schema.prisma                # User model with password field
```

## Deployment

Deploy to Vercel for best results.
