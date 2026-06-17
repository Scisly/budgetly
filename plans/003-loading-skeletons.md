# Plan 003: Add dashboard loading skeletons

> **Drift check**: `git diff --stat fb58be8..HEAD -- app/(dashboard)/ components/`

## Status

- **Priority**: P1 | **Effort**: M | **Risk**: LOW
- **Depends on**: plans/001-shadcn-prerequisites.md
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Dashboard pages are server-rendered with no loading UI. Users see blank content during navigation. Next.js `loading.tsx` files show instant skeleton feedback.

## Current state

- No `loading.tsx` files exist under `app/(dashboard)/`
- 7 dashboard routes: dashboard, transactions, budgets, categories, recurring, compare, settings

## Scope

**In scope**:
- `components/shared/page-skeletons.tsx` (new reusable layouts)
- `app/(dashboard)/dashboard/loading.tsx`
- `app/(dashboard)/transactions/loading.tsx`
- `app/(dashboard)/budgets/loading.tsx`
- `app/(dashboard)/categories/loading.tsx`
- `app/(dashboard)/recurring/loading.tsx`
- `app/(dashboard)/compare/loading.tsx`
- `app/(dashboard)/settings/loading.tsx`

**Out of scope**: layout-level Suspense splits

## Conventions

- Use `Skeleton` from `@/components/ui/skeleton`
- Use `flex flex-col gap-*` not `space-y-*` in NEW code
- Match each page's visual structure (header + content blocks)

## Steps

### Step 1: Create shared skeleton components

Create `components/shared/page-skeletons.tsx` with:
- `PageHeaderSkeleton` — title + description skeletons
- `DashboardPageSkeleton` — header, stats grid (4 cards), 2-column grid
- `ListPageSkeleton` — header, filter bar placeholder, list rows
- `ComparePageSkeleton` — header, 2 period selectors, summary cards, chart area
- `SettingsPageSkeleton` — header, settings cards

### Step 2: Add loading.tsx per route

Each file default-exports the matching skeleton component.

**Verify**: `npm run build` → exit 0

## Done criteria

- [ ] 7 `loading.tsx` files exist
- [ ] Shared skeleton module exists
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] plans/README.md row 003 → DONE
