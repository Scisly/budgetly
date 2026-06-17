# Plan 008: Add dashboard error.tsx boundary

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step.
>
> **Drift check (run first)**: `git diff --stat fb58be8..HEAD -- app/(dashboard)/`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 007
- **Category**: dx
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Dashboard routes lack an error boundary. Server/render failures currently bubble without a polished recovery UI. A route-level `error.tsx` gives Polish copy, retry, and navigation home.

## Current state

- No `error.tsx` under `app/(dashboard)/`
- App uses shadcn Card, Button, Alert — see `components/auth/login-form.tsx`

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Test | `npm run test` | all pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `app/(dashboard)/error.tsx` (create)

**Out of scope**: root `app/error.tsx`, not-found pages

## Steps

### Step 1: Create error boundary

Create `app/(dashboard)/error.tsx` as a `"use client"` component per Next.js App Router conventions:
- Props: `error: Error & { digest?: string }`, `reset: () => void`
- Polish copy, `reset()` retry button, link to `/dashboard`
- Use Card or Alert + shadcn Button

**Verify**: `test -f app/(dashboard)/error.tsx` or `ls app/(dashboard)/error.tsx` → exists

### Step 2: Verify build

**Verify**: `npm run lint && npm run test && npm run build` → all exit 0

## Done criteria

- [ ] `app/(dashboard)/error.tsx` exists with retry + dashboard link
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] `plans/README.md` row 008 → DONE

## STOP conditions

- Next.js error boundary API differs from documented props
- Verification fails twice
