export type TransactionType = "expense" | "income";

export type FrequencyType = "weekly" | "monthly" | "yearly";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  currency_code: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  amount_base: number;
  currency_code: string;
  exchange_rate: number;
  description: string;
  transaction_date: string;
  type: TransactionType;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  limit_amount: number;
  month: number;
  year: number;
  created_at: string;
}

export interface RecurringExpense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  frequency: FrequencyType;
  next_occurrence: string;
  is_active: boolean;
  type: TransactionType;
  created_at: string;
}
