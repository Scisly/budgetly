# Budgetly

**Budgetly** to wieloużytkownikowy dziennik wydatków — aplikacja webowa stworzona jako projekt zaliczeniowy z przedmiotu *Programowanie aplikacji internetowych* (WSB).

Umożliwia rejestrowanie wydatków i przychodów, zarządzanie kategoriami, ustawianie budżetów z alertami, automatyzację wydatków cyklicznych, porównywanie miesięcy oraz import i eksport danych do CSV.

## Stack technologiczny


| Warstwa        | Technologia                                   |
| -------------- | --------------------------------------------- |
| Frontend       | Next.js 16 (App Router), React 19, TypeScript |
| UI             | shadcn/ui, Tailwind CSS 4, Lucide Icons       |
| Wykresy        | Recharts                                      |
| Backend / Baza | Supabase (PostgreSQL, Auth, RLS)              |
| Walidacja      | Zod                                           |
| Testy          | Vitest                                        |
| Deploy         | Vercel                                        |


## Uruchomienie lokalne

### Wymagania

- Node.js 20+
- Konto [Supabase](https://supabase.com) z utworzonym projektem

### 1. Instalacja

```bash
cd budgetly
npm install
```

### 2. Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij klucze z Supabase Dashboard → **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ_PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-key
SUPABASE_SERVICE_ROLE_KEY=twoj-service-role-key
```

> `SUPABASE_SERVICE_ROLE_KEY` jest opcjonalny w produkcji; lokalnie ułatwia rejestrację w dev (omija limit e-maili).

### 3. Migracje bazy danych

W Supabase Dashboard → **SQL Editor** uruchom po kolei pliki z `supabase/migrations/`:

1. `001_initial_schema.sql`
2. `002_rls_policies.sql`
3. `003_profile_trigger.sql`
4. `004_profile_currency.sql`

### 4. Uruchomienie

```bash
npm run dev
```

Aplikacja: [http://localhost:3000](http://localhost:3000)

### 5. Testy

```bash
npm test
npm run build
```

### 6. Dane demo (opcjonalnie)

Po rejestracji konta uruchom `supabase/seed.sql` w SQL Editor (patrz komentarz w pliku — podmień `USER_ID`).

## Struktura folderów

```
budgetly/
├── app/                    # Next.js App Router (strony, layouty)
│   ├── (auth)/             # Logowanie, rejestracja
│   └── (dashboard)/        # Chronione ekrany aplikacji
├── actions/                # Server Actions (kontroler)
├── services/               # Logika biznesowa
├── lib/
│   ├── supabase/           # Klient Supabase (browser, server, middleware)
│   ├── validations/        # Schematy Zod
│   └── types/              # Typy TypeScript
├── components/             # Komponenty UI
├── supabase/migrations/    # Migracje SQL
└── docs/                   # Dokumentacja techniczna
```

**Architektura:** `app/` → `actions/` → `services/` → Supabase Client → PostgreSQL (RLS)

## Materiały do przekazania

- kod źródłowy projektu,
- `README.md` z instrukcją uruchomienia,
- `docs/dokumentacja_projektowa_budgetly_uml.docx` jako rozszerzona dokumentacja projektowa,
- `docs/database-diagram.md` jako opis i diagram ER bazy danych,
- `docs/demo-checklist.md` jako scenariusz prezentacji i lista kontroli przed demo.
- `docs/analytics-module.md` jako opis modułu analityki (metryki, architektura, trade-offs).
- `docs/multi-currency.md` jako opis modelu wielowalutowego transakcji.

## Diagram bazy danych

Szczegółowy diagram ER (Mermaid) i opis tabel: `[docs/database-diagram.md](docs/database-diagram.md)`

## Funkcjonalności


| Moduł           | Opis                                                             |
| --------------- | ---------------------------------------------------------------- |
| **Auth**        | Rejestracja, logowanie, middleware chroniący trasy               |
| **Kategorie**   | CRUD z ikoną i kolorem; 5 kategorii seedowanych przy rejestracji |
| **Transakcje**  | CRUD wydatków/przychodów z filtrami (data, kategoria, typ)       |
| **Dashboard**   | Podsumowanie miesiąca, wykres kołowy, ostatnie transakcje        |
| **Budżety**     | Limity per kategoria, pasek postępu, alert przy przekroczeniu    |
| **Cykliczne**   | CRUD + auto-generowanie wydatków i przychodów cyklicznych        |
| **Porównanie**  | Wykres słupkowy i tabela różnic między dwoma miesiącami          |
| **Import CSV**  | Import transakcji z pliku w formacie eksportu Budgetly           |
| **Eksport CSV** | Pobranie wszystkich transakcji z ustawień                        |
| **UI**          | Dark mode, responsywność (mobile / tablet / desktop), język PL   |


## Deploy na Vercel

1. Wypchnij repozytorium na GitHub.
2. W [Vercel](https://vercel.com) → **Import Project** → wybierz repo, root: `budgetly`.
3. Dodaj zmienne środowiskowe:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (cron + opcjonalna rejestracja w dev)
  - `CRON_SECRET` (losowy ciąg znaków — zabezpiecza `/api/cron/recurring`)
4. Cron Vercel uruchamia przetwarzanie transakcji cyklicznych codziennie o 06:00 UTC (`vercel.json`).
5. W Supabase → **Authentication → URL Configuration**:
  - **Site URL:** `https://twoja-domena.vercel.app`
  - **Redirect URLs:** `https://twoja-domena.vercel.app/`**
6. Po deployu zweryfikuj logowanie i CRUD na produkcji.

Checklista przed prezentacją: `[docs/demo-checklist.md](docs/demo-checklist.md)`

## Autor

Projekt zespołowy — *Programowanie aplikacji internetowych*, WSB.

> Karol Scisłowski, 177306, Informatyka Online, K38
>
> Jakub Grygiel, 174556, Informatyka Online, K38

## Licencja

Projekt edukacyjny — do użytku zaliczeniowego.
