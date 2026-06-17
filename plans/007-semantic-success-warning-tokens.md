# Plan 007: Add semantic success/warning CSS tokens

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat fb58be8..HEAD -- app/globals.css components/dashboard/dashboard-stats.tsx components/transactions/transaction-list.tsx components/budgets/budget-card.tsx components/compare/compare-difference-table.tsx components/dashboard/recent-transactions.tsx components/auth/register-form.tsx`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Raw Tailwind `emerald`/`amber`/`green` classes scatter color semantics across components and break dark-mode consistency. Central CSS tokens let the theme own success/warning meaning and simplify future palette changes.

## Current state

- `app/globals.css` defines `--destructive` but no `--success` or `--warning`.
- Six components use raw color classes (grep: `emerald`, `amber`, `green-`).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Test | `npm run test` | all pass |
| Build | `npm run build` | exit 0 |
| Grep check | `rg "emerald|amber-|green-" components/dashboard/dashboard-stats.tsx components/transactions/transaction-list.tsx components/budgets/budget-card.tsx components/compare/compare-difference-table.tsx components/dashboard/recent-transactions.tsx components/auth/register-form.tsx` | no matches |

## Scope

**In scope**:
- `app/globals.css`
- `components/dashboard/dashboard-stats.tsx`
- `components/transactions/transaction-list.tsx`
- `components/budgets/budget-card.tsx`
- `components/compare/compare-difference-table.tsx`
- `components/dashboard/recent-transactions.tsx`
- `components/auth/register-form.tsx`

**Out of scope**: chart colors, other components not listed

## Steps

### Step 1: Add CSS variables

In `app/globals.css`:
- Add `--color-success`, `--color-success-foreground`, `--color-warning`, `--color-warning-foreground` to `@theme inline`
- Add `--success`, `--success-foreground`, `--warning`, `--warning-foreground` in `:root` and `.dark`

**Verify**: `rg "color-success" app/globals.css` → matches

### Step 2: Replace raw color classes

Replace emerald/amber/green with `text-success`, `bg-success`, `text-warning`, `bg-warning` in all six scoped files.

**Verify**: grep check command above → no matches

### Step 3: Full verification

**Verify**: `npm run lint && npm run test && npm run build` → all exit 0

## Done criteria

- [ ] Semantic tokens in globals.css (light + dark)
- [ ] No raw emerald/amber/green in scoped files
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] `plans/README.md` row 007 → DONE

## STOP conditions

- Scoped file excerpts don't match (drift)
- Verification fails twice after fix attempt
