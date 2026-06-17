# Plan 009: Migrate delete confirms to AlertDialog

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step.
>
> **Drift check (run first)**: `git diff --stat fb58be8..HEAD -- components/transactions/transactions-manager.tsx components/budgets/budgets-manager.tsx components/categories/categories-manager.tsx components/recurring/recurring-manager.tsx`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: 001
- **Category**: dx
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Destructive delete actions should use AlertDialog (shadcn pattern) to signal irreversibility. Generic Dialog is for editing; AlertDialog separates confirm/cancel semantics.

## Current state

- Four managers use `Dialog` for delete confirmation
- `components/ui/alert-dialog.tsx` does not exist yet
- Delete buttons use `variant="destructive"` with `isDeleting` pending text

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Add component | `npx shadcn@latest add alert-dialog --yes` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Test | `npm run test` | all pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `components/ui/alert-dialog.tsx` (new via shadcn)
- `components/transactions/transactions-manager.tsx`
- `components/budgets/budgets-manager.tsx`
- `components/categories/categories-manager.tsx`
- `components/recurring/recurring-manager.tsx`

**Out of scope**: edit/create dialogs (keep Dialog)

## Steps

### Step 1: Install AlertDialog

```
npx shadcn@latest add alert-dialog --yes
```

**Verify**: `components/ui/alert-dialog.tsx` exists

### Step 2: Migrate four delete dialogs

Replace delete `Dialog` with `AlertDialog` + `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction`.
- `AlertDialogAction` uses `variant="destructive"` (via className or Button)
- Spinner with `data-icon="inline-start"` when `isDeleting`

**Verify**: `rg "Usuń.*DialogTitle" components/*/**-manager.tsx` → no Dialog-based delete titles remain

### Step 3: Full verification

**Verify**: `npm run lint && npm run test && npm run build` → all exit 0

## Done criteria

- [ ] alert-dialog component installed
- [ ] Four managers use AlertDialog for delete
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] `plans/README.md` row 009 → DONE

## STOP conditions

- shadcn CLI fails twice
- AlertDialog API incompatible with base-vega setup
