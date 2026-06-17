# Plan 002: Mount Toaster in root layout

> **Drift check**: `git diff --stat fb58be8..HEAD -- app/layout.tsx components/ui/sonner.tsx`

## Status

- **Priority**: P1 | **Effort**: S | **Risk**: LOW
- **Depends on**: plans/001-shadcn-prerequisites.md
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

`components/settings/currency-selector.tsx` calls `toast()` from sonner but `<Toaster />` is not mounted. Toasts are silently dropped.

## Current state

`app/layout.tsx` — ThemeProvider + SoundProvider, no Toaster:
```tsx
<ThemeProvider ...>
  <SoundProvider>{children}</SoundProvider>
</ThemeProvider>
```

`components/ui/sonner.tsx` exports `Toaster` (client component using next-themes).

## Scope

**In scope**: `app/layout.tsx` only

## Steps

### Step 1: Import and mount Toaster

Add:
```tsx
import { Toaster } from "@/components/ui/sonner";
```

Inside ThemeProvider (Toaster needs theme context), after SoundProvider children or as sibling:
```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <SoundProvider>{children}</SoundProvider>
  <Toaster />
</ThemeProvider>
```

**Verify**: `npm run build` → exit 0

## Done criteria

- [ ] `Toaster` imported and rendered in `app/layout.tsx`
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] plans/README.md row 002 → DONE
