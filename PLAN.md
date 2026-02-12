# Next.js + Supabase Starter App — Implementation Plan

This document is the implementation plan for the assignment. Save it as a markdown file in the project root (e.g. **PLAN.md** or **ASSIGNMENT_PLAN.md**).

**Decisions:** Tailwind CSS (plain CSS only when needed), Jest for unit tests, bash setup script (`setup.sh`), Vercel as primary deployment target, Supabase Storage for avatar uploads. Route/component names are flexible; keep them consistent and documented.

---

## 1. Next.js application (already partially done)

- **Status:** Project exists with Next.js 16, TypeScript, Tailwind 4, App Router ([app/](app/)).
- **Remaining:** Confirm project structure and add folders: `components/` (e.g. `components/ui/` for reusable UI), `lib/` (Supabase clients, hooks, utils). Document structure in README.
- **Styling:** Use Tailwind primarily; add plain CSS only when necessary (e.g. one-off overrides). No CSS modules.

---

## 2. Supabase integration

- **Install:** Supabase CLI (dev), `@supabase/supabase-js` and `@supabase/ssr`. Initialize Supabase in repo: `npx supabase init` to create `supabase/` (config, migrations).
- **Local dev:** Use `npx supabase start` for local Supabase; document Docker requirement in README.
- **Client utilities (using @supabase/ssr):**
- **Server:** e.g. `lib/supabase/server.ts` — create Supabase client for server components (cookies).
- **Client:** e.g. `lib/supabase/client.ts` — create browser client for client components.
- **Middleware + proxy:** Implement token refresh:
- Put session refresh / proxy logic in **`proxy.ts`** (e.g. under `lib/supabase/` or root).
- In **`middleware.ts`** at project root, import and run that logic so the session is updated on each request.
- **Env:** Require `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Document in README; ensure `.env.local` is in `.gitignore` (already covered by [.gitignore](.gitignore) `.env*`).

---

## 3. Profile model (declarative schema and migrations)

- **Declarative schema:** Create `supabase/schemas/profiles.sql` defining a `profiles` table:
- `id` UUID PRIMARY KEY REFERENCES `auth.users(id)` ON DELETE CASCADE
- `email` (from auth), `full_name`, `avatar_url`, `updated_at` (or similar)
- No trigger in the declarative file; triggers go in migrations.
- **Migration from schema:** Run `npx supabase db diff -f create_profiles` (or similar) to generate a migration from the declarative schema. Commit under `supabase/migrations/`.
- **updated_at trigger:** Add a migration (or extend the same one) that creates a trigger to set `profiles.updated_at` on row update (e.g. `BEFORE UPDATE ... SET updated_at = now()`).
- **Automatic profile creation:** Add a migration that:
- Creates a function that runs AFTER INSERT on `auth.users`, reads `NEW.id` and `NEW.email`, and INSERTs one row into `profiles`.
- Creates a trigger: `AFTER INSERT ON auth.users FOR EACH ROW EXECUTE ...`
- Puts both function and trigger in the migration file.

All schema changes only via migration files; no manual SQL execution.

---

## 4. Row Level Security (RLS)

- **Enable RLS** on `profiles` in a migration.
- **Policies** using `auth.uid()`:
- SELECT: user can read only their own row (`id = auth.uid()`).
- UPDATE: user can update only their own row.
- INSERT: user can insert only their own row (id = auth.uid()).
- Ensure no policy allows reading or modifying other users' profiles.

---

## 5. Authentication

- **Implement:** Sign up, sign in, sign out (email/password) using Supabase Auth.
- **Patterns:**
- **Client:** e.g. `useAuth()` (or `useUser()`) in `lib/hooks/` that exposes user and auth actions; use in client components.
- **Server:** e.g. `getUser()` or `getSession()` in `lib/supabase/` that server components and Server Actions call to check auth.
- **Protected routes:** For dashboard and profile, check auth server-side (or in middleware); redirect to login if unauthenticated.
- **Display user info:** Show user/email (and profile data where relevant) on home, dashboard, and profile when logged in.
- **Errors:** Handle failed sign up/sign in (e.g. invalid credentials, rate limit) and show clear messages in the UI.

---

## 6. Example pages

Use a consistent naming scheme (e.g. `/login`, `/signup`, `/dashboard`, `/profile` or `/auth/login`, `/account`, etc.) and document it in README.

| Route | Purpose |
|-------|--------|
| **/** | Home: welcome message, auth status; link to login/signup when logged out, to dashboard when logged in. |
| **/login** | Email and password login form; error handling; redirect to dashboard on success. |
| **/signup** | Email and password signup form; error handling; redirect to dashboard on success. |
| **/dashboard** | Protected. Require auth (redirect to login otherwise). Show profile summary, link to profile page, sign out button. |
| **/profile** | Protected. Require auth. Show current profile; form to update `full_name` (and any other profile fields); **avatar upload** (select file, upload to Supabase Storage, update `avatar_url`, display avatar, save button); error handling for upload and validation. |

For avatar upload: create a Supabase Storage bucket (e.g. `avatars`), set RLS so users can read/update only their own object (e.g. by path or user id). Update `profiles.avatar_url` with the public or signed URL.

---

## 7. Setup script (bash)

- **File:** `setup.sh` in project root; make executable (`chmod +x setup.sh`).
- **Assumptions:** Supabase already initialized (`supabase/` with migrations and schemas exists). Idempotent and safe to run multiple times.
- **Steps in order:**

1. `npm install`
2. Start Supabase: `npx supabase start` (detect if already running and skip or continue).
3. Extract from `supabase start` output: Supabase URL and anon key (e.g. grep/sed or parse the printed table).
4. Create or update `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Run migrations: `npx supabase db reset` or `npx supabase migration up`.
6. Print clear summary of what was done and next steps (e.g. "Run `npm run dev`").

- **Edge cases:** If `.env.local` exists, overwrite or prompt; if Supabase is already running, avoid duplicate start; on failure, print helpful error messages.
- **README:** Document how to run the script (e.g. `./setup.sh`) and prerequisites (Node, Docker), plus troubleshooting.

---

## 8. Code organization and documentation

- **Decide and document in README:**
- Reusable components: e.g. `components/` or `components/ui/`.
- Custom hooks: e.g. `lib/hooks/`.
- Utility functions: e.g. `lib/utils/`.
- Supabase helpers: `lib/supabase/`.
- **README sections to include:** Project description and purpose; prerequisites (Node version, Docker); quick start (setup script); manual setup (step-by-step); project structure; how to use this starter for new projects; environment variables; database schema overview; authentication flow; deployment (Vercel-focused); GitHub Actions; troubleshooting.

---

## 9. Unit testing (Jest)

- **Setup:** Add Jest and React Testing Library (and any Jest env for Next/React if needed). Configure for TypeScript (e.g. ts-jest or project references). Add `test` script in [package.json](package.json).
- **Examples:** At least a few tests demonstrating:
- React component tests (e.g. a button or a small form).
- Utility function tests.
- Auth-related code (e.g. a helper that returns user or null).
- **README:** How to run tests (`npm test`) and how to add new tests (where to put them, pattern to follow).

---

## 10. Deployment (Vercel) and CI/CD

- **Deployment docs (README):**
- Create/link production Supabase project; get production URL and anon key.
- In Vercel: new project from repo; set env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`); link production database.
- Platform notes: Vercel env dashboard, no commit of `.env.local`, optional serverless/Edge notes if relevant.
- **GitHub Actions workflow:** e.g. `.github/workflows/migrate.yml`:
- Trigger: push to `main` (or deployment to production).
- Job: checkout, set up Node (if needed for CLI), run Supabase migrations against production using Supabase CLI and credentials from GitHub Secrets (e.g. `SUPABASE_DB_URL` or project ref + access token as per Supabase docs).
- On failure: clear error message; do not expose secrets.
- **README:** How to set up and configure the workflow (which secrets to add, where to find them in Supabase dashboard).

---

## 11. Submission checklist

- Remove `node_modules`; keep `supabase/` (migrations and schemas).
- Ensure `setup.sh` is included and executable.
- Verify README is comprehensive and clear.
- Zip project folder and submit.

---

## Suggested implementation order

1. Supabase init, client utilities, env, middleware + proxy.
2. Declarative schema and migrations (profiles table, updated_at trigger, auto profile trigger).
3. RLS on profiles.
4. Auth: sign up, sign in, sign out; server/client helpers and protected route checks.
5. Pages: home, login, signup, dashboard, profile (with avatar upload and Storage).
6. Setup script (`setup.sh`).
7. Jest setup and example tests.
8. README (all sections) and deployment + GitHub Actions docs.
9. Final test: remove `node_modules` and `.env.local`, run `./setup.sh`, then run app and verify flows.

---

## File and folder reference (summary)

| Item | Location / note |
|------|------------------|
| Supabase config & migrations | `supabase/` (init then add migrations) |
| Declarative schema | `supabase/schemas/profiles.sql` |
| Server client | e.g. `lib/supabase/server.ts` |
| Browser client | e.g. `lib/supabase/client.ts` |
| Token refresh logic | `proxy.ts` (then used in middleware) |
| Middleware | `middleware.ts` (root) |
| Auth hook | e.g. `lib/hooks/useAuth.ts` |
| Reusable UI | e.g. `components/` or `components/ui/` |
| Setup script | `setup.sh` (root) |
| GitHub Actions | `.github/workflows/migrate.yml` |
| Plan document | Save this content as `PLAN.md` (or `ASSIGNMENT_PLAN.md`) in project root |
