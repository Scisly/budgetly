# Checklista demo — Budgetly

Lista kontrolna przed prezentacją projektu zaliczeniowego (5–7 min).

## Przygotowanie środowiska

- [ ] `npm install` zakończone bez błędów
- [ ] `.env.local` skonfigurowany (Supabase URL + anon key)
- [ ] Migracje SQL `001`-`004` uruchomione w Supabase
- [ ] `npm run dev` — aplikacja na http://localhost:3000
- [ ] `npm test` — wszystkie testy przechodzą
- [ ] `npm run build` — build produkcyjny OK

## Dane demo

- [ ] Konto testowe zarejestrowane
- [ ] 5 domyślnych kategorii widocznych po rejestracji
- [ ] `supabase/seed.sql` uruchomiony (15 transakcji, 1 budżet, 2 cykliczne)
- [ ] Dashboard pokazuje dane z bieżącego miesiąca

## Funkcjonalność

- [ ] **Auth** — rejestracja i logowanie działają
- [ ] **CRUD kategorii** — dodaj, edytuj, usuń
- [ ] **CRUD transakcji** — dodaj wydatek i przychód, filtry działają
- [ ] **Dashboard** — karty podsumowania, wykres kołowy, ostatnie transakcje
- [ ] **Budżety** — limit ustawiony, pasek postępu, alert przy przekroczeniu
- [ ] **Cykliczne** — lista, toggle aktywny, auto-generowanie transakcji
- [ ] **Porównanie** — wybór dwóch miesięcy, wykres + tabela różnic
- [ ] **Eksport CSV** — pobranie pliku z ustawień
- [ ] **Formularze walidowane** — błędne dane pokazują komunikat po polsku

## UI / UX

- [ ] **Responsywność 375px** — bottom nav, karty zamiast tabel
- [ ] **Responsywność 768px** — sidebar widoczny
- [ ] **Responsywność 1280px** — pełny layout desktop
- [ ] **Dark mode** — przełącznik w Ustawieniach, wszystkie ekrany czytelne
- [ ] **Język PL** — interfejs po polsku

## Produkcja (opcjonalnie)

- [ ] Deploy na Vercel z env vars
- [ ] Supabase redirect URLs skonfigurowane
- [ ] Logowanie działa na URL produkcyjnym

## Scenariusz prezentacji (5–7 min)

1. [ ] Temat i cel aplikacji (landing `/`)
2. [ ] Demo rejestracji / logowania
3. [ ] CRUD transakcji i kategorii
4. [ ] Dashboard z wykresem
5. [ ] Budżet z alertem przekroczenia
6. [ ] Wydatki cykliczne (auto-generowanie)
7. [ ] Porównanie miesięcy + eksport CSV
8. [ ] Responsywność (mobile → desktop)
9. [ ] Diagram bazy danych + struktura kodu (`docs/database-diagram.md`)

## Materiały do oddania

- [ ] Kod źródłowy (Git / archiwum)
- [ ] README.md
- [ ] Diagram ER
- [ ] Link do deploy (jeśli wymagany)
