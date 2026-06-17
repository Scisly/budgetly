# Plan 005: Unify page animations

> **Drift check**: `git diff --stat fb58be8..HEAD -- app/(dashboard)/`

## Status

- **Priority**: P1 | **Effort**: S | **Risk**: LOW
- **Depends on**: none
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

`dashboard/page.tsx` and `transactions/page.tsx` use `animate-fade-up` on top of `DashboardPageTransition` ViewTransition — double animation feels janky. Other 5 dashboard pages rely only on ViewTransition.

## Decision

Rely on `DashboardPageTransition` only. Remove `animate-fade-up` from the two pages.

## Scope

- `app/(dashboard)/dashboard/page.tsx` — change `className="animate-fade-up space-y-6"` → `className="space-y-6"`
- `app/(dashboard)/transactions/page.tsx` — same change

## Done criteria

- [ ] No `animate-fade-up` in dashboard or transactions page
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
