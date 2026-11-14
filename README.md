# FocusFlow

A scalable productivity and time-management app built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Getting started

1. Install Node.js 20.9+.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key.
4. In Supabase Authentication URL configuration, set your Site URL and add `http://localhost:3000/auth/callback` as an allowed redirect URL.
5. Run `npm run dev`.

## Authentication

Email/password sign-up and sign-in use server actions. Supabase sessions are stored in cookies using `@supabase/ssr`. The root `proxy.ts` refreshes sessions and protects `/dashboard` using `auth.getClaims()`.

Enable email/password authentication in Supabase. If email confirmation is enabled, users must confirm their email before signing in.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript validation