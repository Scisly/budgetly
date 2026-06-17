# Plan 001: Add shadcn UI prerequisites

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step.
>
> **Drift check (run first)**: `git diff --stat fb58be8..HEAD -- components/ui/`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Phase 1 UX work depends on shadcn skeleton, empty, spinner, and alert components. These are not yet installed in `components/ui/`.

## Current state

- `components/ui/` has button, card, dialog, sonner, etc. but NOT skeleton, empty, spinner, alert.
- `components.json` uses style `base-vega`, lucide icons, npm package manager.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Add components | `npx shadcn@latest add skeleton empty spinner alert --yes` | exit 0, files created |
| Lint | `npm run lint` | exit 0 |
| Test | `npm run test` | all pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `components/ui/skeleton.tsx` (new)
- `components/ui/empty.tsx` (new)
- `components/ui/spinner.tsx` (new)
- `components/ui/alert.tsx` (new)

**Out of scope**: alert-dialog, globals.css token changes

## Steps

### Step 1: Install shadcn components

Run from repo root:
```
npx shadcn@latest add skeleton empty spinner alert --yes
```

**Verify**: `ls components/ui/skeleton.tsx components/ui/empty.tsx components/ui/spinner.tsx components/ui/alert.tsx` → all exist

### Step 2: Verify exports

Confirm each file exports the expected components (Skeleton, Empty*, Spinner, Alert*).

**Verify**: `npm run lint` → exit 0

## Done criteria

- [ ] All four component files exist under `components/ui/`
- [ ] `npm run lint` exits 0
- [ ] `npm run test` exits 0
- [ ] `npm run build` exits 0
- [ ] `plans/README.md` row 001 → DONE

## STOP conditions

- shadcn CLI fails twice after reasonable fix attempt
- CLI tries to overwrite existing files unexpectedly
