-- Apply in Supabase SQL Editor after deploy (same as migrations 001–004).
ALTER TABLE recurring_expenses
  ADD COLUMN IF NOT EXISTS type transaction_type NOT NULL DEFAULT 'expense';
