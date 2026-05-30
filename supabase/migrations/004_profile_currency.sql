ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS currency_code text NOT NULL DEFAULT 'PLN';

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_currency_code_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_currency_code_check
  CHECK (
    currency_code IN (
      'PLN', 'EUR', 'USD', 'GBP', 'CHF', 'CZK', 'SEK', 'NOK', 'DKK', 'HUF', 'UAH'
    )
  );
