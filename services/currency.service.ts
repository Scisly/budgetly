import type { SupabaseClient } from "@supabase/supabase-js";
import {
  BASE_CURRENCY,
  type CurrencyCode,
  isCurrencyCode,
} from "@/lib/money/currencies";
import { getDisplayExchangeRate } from "@/lib/money/exchange-rates";
import type { DisplayCurrencyOptions } from "@/lib/money/format-currency";
import type { Profile } from "@/lib/types/database.types";

export interface DisplayCurrencyContext extends DisplayCurrencyOptions {
  baseCurrency: typeof BASE_CURRENCY;
}

export async function getProfileCurrency(
  supabase: SupabaseClient,
  userId: string
): Promise<CurrencyCode> {
  const { data, error } = await supabase
    .from("profiles")
    .select("currency_code")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data?.currency_code || !isCurrencyCode(data.currency_code)) {
    return BASE_CURRENCY;
  }

  return data.currency_code;
}

export async function updateProfileCurrency(
  supabase: SupabaseClient,
  userId: string,
  currencyCode: CurrencyCode
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ currency_code: currencyCode })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Nie udało się zaktualizować waluty.");
  }

  return data as Profile;
}

export async function getDisplayCurrencyContext(
  supabase: SupabaseClient,
  userId: string | null
): Promise<DisplayCurrencyContext> {
  const currencyCode = userId
    ? await getProfileCurrency(supabase, userId)
    : BASE_CURRENCY;
  const rate = await getDisplayExchangeRate(currencyCode);

  return {
    baseCurrency: BASE_CURRENCY,
    currencyCode,
    rate,
  };
}
