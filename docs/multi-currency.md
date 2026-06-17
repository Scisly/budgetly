# Multi-currency w Budgetly

## Problem

Przed tą zmianą wszystkie kwoty były traktowane jako PLN (`BASE_CURRENCY`). Preferencja waluty w profilu (`currency_code`) oraz kurs Frankfurter służyły wyłącznie do **wyświetlania** — przy zapisie formularz przeliczał kwotę z powrotem na PLN (`useCurrencyAmountInput`). Użytkownik wpisujący 50 EUR przy wyświetlaniu w EUR zapisywał równowartość PLN bez zachowania oryginalnej waluty i kursu z momentu transakcji.

## Wybrany model danych

| Kolumna | Rola |
|---------|------|
| `currency_code` | ISO waluty wpisanej przez użytkownika (domyślnie `PLN`) |
| `amount` | Kwota w `currency_code` (oryginał) |
| `amount_base` | Równowartość PLN w momencie zapisu (agregacje, budżety, wykresy) |
| `exchange_rate` | `amount_base / amount` — snapshot kursu (audyt) |

## Odrzucone alternatywy

1. **Tylko `currency_code` + `amount` bez `amount_base`** — wymagałoby przeliczania historycznych sum przy każdym odczycie; budżety i wykresy byłyby niestabilne.
2. **Konwersja wyłącznie w UI** — brak śladu kursu; analityka i eksport CSV byłyby niewiarygodne.

## Migracja i backfill

Migracja `006_transaction_multi_currency.sql`:

- Dodaje kolumny z domyślnymi wartościami.
- Ustawia `amount_base = amount`, `exchange_rate = 1`, `currency_code = 'PLN'` dla istniejących wierszy.
- Wymusza `NOT NULL` na `amount_base` po backfillu.

Uruchomić w Supabase SQL Editor po migracji 005.

## CSV

Nowy nagłówek: `Data,Opis,Kwota,Waluta,Typ,Kategoria`

- `Kwota` — oryginalna kwota transakcji.
- `Waluta` — kod ISO (opcjonalny przy imporcie starych plików 5-kolumnowych → domyślnie `PLN`).

## Budżety i agregacje

Sumy wydatków/przychodów (`getMonthlySummary`, budżety, porównania, dashboard) używają **`amount_base`** (PLN). Limity budżetów pozostają w PLN.

## Ograniczenia (v1)

- **Cykliczne transakcje** — tabela `recurring_expenses` nadal przechowuje kwoty w PLN; multi-currency dla recurring wymaga osobnej migracji.
- **Wyświetlanie list** — kwoty w walucie profilu z `amount_base` + bieżący kurs profilu; oryginalna waluta widoczna jako badge gdy różni się od profilu.
- **Kurs historyczny w UI** — zapisany w `exchange_rate`, ale lista nie przelicza „jak wtedy” przy zmianie waluty profilu.

## Powiązanie z ER

Zobacz zaktualizowany blok `transactions` w [database-diagram.md](./database-diagram.md).
