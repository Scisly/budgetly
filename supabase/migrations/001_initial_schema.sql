-- profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  icon text NOT NULL DEFAULT 'circle',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_categories_user_id ON categories(user_id);

-- transactions
CREATE TYPE transaction_type AS ENUM ('expense', 'income');
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE RESTRICT NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL DEFAULT '',
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  type transaction_type NOT NULL DEFAULT 'expense',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- budgets
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  limit_amount decimal(10,2) NOT NULL CHECK (limit_amount > 0),
  month int NOT NULL CHECK (month BETWEEN 1 AND 12),
  year int NOT NULL CHECK (year >= 2020),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id, month, year)
);
CREATE INDEX idx_budgets_user_period ON budgets(user_id, month, year);

-- recurring_expenses
CREATE TYPE frequency_type AS ENUM ('weekly', 'monthly', 'yearly');
CREATE TABLE recurring_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE RESTRICT NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL DEFAULT '',
  frequency frequency_type NOT NULL DEFAULT 'monthly',
  next_occurrence date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_recurring_user_active ON recurring_expenses(user_id, is_active);
