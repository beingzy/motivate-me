# Motivate Me — Claude Instructions

## Project Context
This app was designed in Google Stitch. The UI source files 
are in /stitch-export/. We are building a React + Tailwind app.

## Rules
- Preserve the visual design from Stitch as closely as possible
- Use Tailwind CSS utility classes (already in the Stitch output)
- Use React functional components with hooks
- All API calls go through /src/api/
- Mobile-first, responsive

## Source of Truth

`prd.md` is the single source of truth for this project. Before starting any work:

1. Read `prd.md` fully.
2. Check the **Build Queue → Next Up** section for the current priority.
3. Check **Open Questions** — if one is relevant to the task, surface it before building.

## Iteration Workflow

For every development iteration, follow this sequence:

### 1. Update prd.md First

Before writing any code for a new feature or change:
- Update the relevant section of `prd.md` to reflect confirmed specifics (acceptance criteria, data model changes, screen details).
- If design decisions were confirmed (e.g. from Stitch exports, user feedback), update the **Google Stitch UI Design Prompt** section to keep it in sync.
- Do NOT change the **Backlog** or long-term roadmap items — those stay stable unless the user explicitly asks to reprioritize.

### 2. Build from prd.md

Implement only what the updated `prd.md` describes for the current iteration. Do not invent behavior not in the spec.

### 3. Update Build Queue on Completion

When a Build Queue item is completed:
- Check it off with `- [x]`.
- Add the git commit hash next to it: `- [x] **Feature name** — commit: abc1234`
- Move to the next unchecked item.

## Project-Specific Standards

### Tech Stack (do not deviate without user approval)
- **Framework:** Next.js (App Router)
- **Backend / DB:** Supabase (PostgreSQL + Auth + Storage)
- **Auth:** Magic link only — no passwords, no OAuth
- **Styling:** Tailwind CSS only — no CSS modules, no styled-components
- **PWA:** next-pwa
- **Deployment:** Vercel

### File Conventions
- Pages: `app/(routes)/page.tsx`
- Server actions: `app/actions/`
- Supabase client: `lib/supabase/` (separate client vs server helpers)
- Types: `types/` (generated from Supabase schema where possible)
- Shared UI components: `components/ui/`
- Feature components: `components/<feature>/`

### Code Rules
- No `any` types. No `@ts-ignore`. Fix the actual type.
- Supabase queries must handle errors explicitly — never silently swallow them.
- Point ledger is append-only. Never update or delete `point_ledger` rows.
- All point mutations go through a single server action (`actions/points.ts`) — never mutate balance directly.
- RLS (Row Level Security) must be enabled on all Supabase tables. Never bypass RLS.

### Testing
- Write tests before implementation (TDD).
- Test files live next to the code: `component.test.tsx` or `util.test.ts`.
- Coverage required: happy path, empty/zero/null edge cases, error states.
- Run `pnpm test` before every commit.

## Design Reference

When building UI, refer to the **Google Stitch UI Design Prompt** section in `prd.md` for:
- Color palette and brand direction
- Component specifications (point badge, streak counter, habit card, etc.)
- Screen-by-screen layout descriptions
- Micro-interaction behaviors

If Stitch exports are available in `design/` directory, match them precisely.

## Things Specific to This Project to Never Do

- Never allow point balance to go negative.
- Never credit points for a `pending_approval` action log — wait for monitor approval.
- Never let a user redeem a reward if their available balance (excluding held points) is insufficient.
- Never expose one user's data to another user's Supabase queries — enforce via RLS and always filter by `user_id`.
- Never build desktop-optimized layouts in v1 — mobile-first, PWA-first.
