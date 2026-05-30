-- =============================================================================
-- Budgetly — seed danych demo
-- =============================================================================
-- Uruchom w Supabase SQL Editor PO rejestracji użytkownika (kategorie muszą
-- już istnieć — seedowane automatycznie przy rejestracji).
--
-- INSTRUKCJA:
-- 1. Zaloguj się do aplikacji jako użytkownik demo.
-- 2. W Supabase → Authentication → Users skopiuj UUID użytkownika.
-- 3. Podmień wartość poniżej i uruchom cały skrypt.
-- =============================================================================

DO $$
DECLARE
  v_user_id_text text := 'PASTE_YOUR_USER_UUID_HERE';
  v_user_id uuid;
  v_jedzenie uuid;
  v_transport uuid;
  v_rozrywka uuid;
  v_rachunki uuid;
  v_zdrowie uuid;
  v_now date := CURRENT_DATE;
  v_month int := EXTRACT(MONTH FROM v_now)::int;
  v_year int := EXTRACT(YEAR FROM v_now)::int;
BEGIN
  IF v_user_id_text = 'PASTE_YOUR_USER_UUID_HERE' THEN
    RAISE EXCEPTION 'Podmień PASTE_YOUR_USER_UUID_HERE na UUID użytkownika z auth.users';
  END IF;

  v_user_id := v_user_id_text::uuid;

  SELECT id INTO v_jedzenie FROM categories WHERE user_id = v_user_id AND name = 'Jedzenie';
  SELECT id INTO v_transport FROM categories WHERE user_id = v_user_id AND name = 'Transport';
  SELECT id INTO v_rozrywka FROM categories WHERE user_id = v_user_id AND name = 'Rozrywka';
  SELECT id INTO v_rachunki FROM categories WHERE user_id = v_user_id AND name = 'Rachunki';
  SELECT id INTO v_zdrowie FROM categories WHERE user_id = v_user_id AND name = 'Zdrowie';

  IF v_jedzenie IS NULL THEN
    RAISE EXCEPTION 'Brak kategorii — najpierw zarejestruj użytkownika w aplikacji';
  END IF;

  -- Usuń poprzednie dane demo (opcjonalnie — odkomentuj przy ponownym seedzie)
  -- DELETE FROM transactions WHERE user_id = v_user_id;
  -- DELETE FROM budgets WHERE user_id = v_user_id;
  -- DELETE FROM recurring_expenses WHERE user_id = v_user_id;

  -- 15 transakcji z ostatnich 3 miesięcy (wydatki + przychody)
  INSERT INTO transactions (user_id, category_id, amount, description, transaction_date, type) VALUES
    -- 2 miesiące temu
    (v_user_id, v_jedzenie, 245.50, 'Zakupy spożywcze Biedronka', (v_now - INTERVAL '62 days')::date, 'expense'),
    (v_user_id, v_transport, 120.00, 'Paliwo Orlen', (v_now - INTERVAL '58 days')::date, 'expense'),
    (v_user_id, v_rachunki, 89.00, 'Internet Orange', (v_now - INTERVAL '55 days')::date, 'expense'),
    (v_user_id, v_jedzenie, 5000.00, 'Wypłata — marzec', (v_now - INTERVAL '60 days')::date, 'income'),
    -- 1 miesiąc temu
    (v_user_id, v_jedzenie, 312.80, 'Zakupy Lidl', (v_now - INTERVAL '32 days')::date, 'expense'),
    (v_user_id, v_rozrywka, 49.99, 'Netflix', (v_now - INTERVAL '30 days')::date, 'expense'),
    (v_user_id, v_transport, 89.00, 'Bilet miesięczny MPK', (v_now - INTERVAL '28 days')::date, 'expense'),
    (v_user_id, v_zdrowie, 150.00, 'Wizyta u lekarza', (v_now - INTERVAL '25 days')::date, 'expense'),
    (v_user_id, v_rachunki, 450.00, 'Czynsz', (v_now - INTERVAL '27 days')::date, 'expense'),
    (v_user_id, v_jedzenie, 5000.00, 'Wypłata — kwiecień', (v_now - INTERVAL '30 days')::date, 'income'),
    -- bieżący miesiąc
    (v_user_id, v_jedzenie, 178.40, 'Zakupy Auchan', (v_now - INTERVAL '10 days')::date, 'expense'),
    (v_user_id, v_transport, 45.00, 'Uber', (v_now - INTERVAL '7 days')::date, 'expense'),
    (v_user_id, v_rozrywka, 35.00, 'Kino', (v_now - INTERVAL '5 days')::date, 'expense'),
    (v_user_id, v_rachunki, 199.00, 'Prąd Tauron', (v_now - INTERVAL '3 days')::date, 'expense'),
    (v_user_id, v_jedzenie, 5000.00, 'Wypłata — bieżący miesiąc', (v_now - INTERVAL '2 days')::date, 'income');

  -- 1 budżet na bieżący miesiąc (Jedzenie)
  INSERT INTO budgets (user_id, category_id, limit_amount, month, year)
  VALUES (v_user_id, v_jedzenie, 800.00, v_month, v_year)
  ON CONFLICT (user_id, category_id, month, year) DO UPDATE
    SET limit_amount = EXCLUDED.limit_amount;

  -- 2 wydatki cykliczne
  INSERT INTO recurring_expenses (user_id, category_id, amount, description, frequency, next_occurrence, is_active)
  VALUES
    (v_user_id, v_rozrywka, 49.99, 'Netflix', 'monthly', (v_now + INTERVAL '5 days')::date, true),
    (v_user_id, v_rachunki, 450.00, 'Czynsz', 'monthly', (v_now + INTERVAL '10 days')::date, true);

  RAISE NOTICE 'Seed zakończony dla user_id: %', v_user_id;
END $$;
