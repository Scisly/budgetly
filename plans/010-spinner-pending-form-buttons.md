# Plan 010: Spinner on pending form buttons

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step.
>
> **Drift check (run first)**: `git diff --stat fb58be8..HEAD -- components/auth/ components/budgets/budget-form.tsx components/transactions/transaction-form.tsx components/recurring/recurring-form.tsx components/categories/category-form.tsx components/settings/export-csv-button.tsx`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 001
- **Category**: dx
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Text-only pending states ("Logowanie…") are inconsistent with shadcn Spinner pattern used elsewhere (month-selector, transaction-filters). Spinner + label improves perceived feedback.

## Current state

Pending pattern exemplar: `components/transactions/transaction-filters.tsx` lines 144-146:
```tsx
{isPending ? <Spinner data-icon="inline-start" /> : null}
Filtruj
```

Files still using text-only pending:
- `components/auth/login-form.tsx` — "Logowanie…"
- `components/auth/register-form.tsx` — "Rejestracja…"
- `components/budgets/budget-form.tsx` — "Zapisywanie…"
- `components/transactions/transaction-form.tsx` — "Zapisywanie…"
- `components/recurring/recurring-form.tsx` — "Zapisywanie…"
- `components/categories/category-form.tsx` — "Zapisywanie…"
- `components/settings/export-csv-button.tsx` — "Eksportowanie…"

Delete dialogs handled in plan 009.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Test | `npm run test` | all pass |
| Build | `npm run build` | exit 0 |
| Grep | `rg "Logowanie…|Rejestracja…|Zapisywanie…|Eksportowanie…|Usuwanie…" components/` | no matches (or only non-pending contexts) |

## Scope

**In scope**: the seven files listed above

**Out of scope**: navigation spinners already done; currency-selector

## Steps

### Step 1: Add Spinner to pending buttons

For each file: import Spinner, replace ternary pending text with Spinner + static label.

**Verify**: grep check → no ellipsis pending strings

### Step 2: Full verification

**Verify**: `npm run lint && npm run test && npm run build` → all exit 0

## Done criteria

- [ ] All scoped forms use Spinner + label pattern
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] `plans/README.md` row 010 → DONE

## STOP conditions

- File already migrated (skip and note)
- Verification fails twice
