import { BASE_CURRENCY, type CurrencyCode } from "@/lib/money/currencies";

const CACHE_TTL_MS = 60 * 60 * 1000;

interface CachedRate {
  rate: number;
  fetchedAt: number;
}

const rateCache = new Map<string, CachedRate>();

function getCacheKey(from: CurrencyCode, to: CurrencyCode): string {
  return `${from}:${to}`;
}

function readCachedRate(from: CurrencyCode, to: CurrencyCode): number | null {
  const cached = rateCache.get(getCacheKey(from, to));
  if (!cached || Date.now() - cached.fetchedAt >= CACHE_TTL_MS) {
    return null;
  }

  return cached.rate;
}

function writeCachedRate(
  from: CurrencyCode,
  to: CurrencyCode,
  rate: number
): void {
  rateCache.set(getCacheKey(from, to), {
    rate,
    fetchedAt: Date.now(),
  });
}

export async function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number> {
  if (from === to) {
    return 1;
  }

  const cached = readCachedRate(from, to);
  if (cached !== null) {
    return cached;
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Exchange rate request failed: ${response.status}`);
    }

    const data = (await response.json()) as { rates?: Record<string, number> };
    const rate = data.rates?.[to];

    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new Error(`Missing exchange rate for ${to}`);
    }

    writeCachedRate(from, to, rate);
    return rate;
  } catch {
    const stale = rateCache.get(getCacheKey(from, to))?.rate;
    return stale ?? 1;
  }
}

export async function getDisplayExchangeRate(
  displayCurrency: CurrencyCode
): Promise<number> {
  return getExchangeRate(BASE_CURRENCY, displayCurrency);
}
