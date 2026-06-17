-- Apply in Supabase SQL Editor after migration 005.
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS currency_code text NOT NULL DEFAULT 'PLN',
  ADD COLUMN IF NOT EXISTS amount_base decimal(10,2),
  ADD COLUMN IF NOT EXISTS exchange_rate decimal(12,6) NOT NULL DEFAULT 1;

ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_currency_code_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_currency_code_check
  CHECK (currency_code IN (
    'PLN', 'EUR', 'USD', 'GBP', 'CHF', 'CZK', 'SEK', 'NOK', 'DKK', 'HUF', 'UAH'
  ));

UPDATE transactions
SET
  amount_base = amount,
  exchange_rate = 1,
  currency_code = 'PLN'
WHERE amount_base IS NULL;

ALTER TABLE transactions
  ALTER COLUMN amount_base SET NOT NULL;
