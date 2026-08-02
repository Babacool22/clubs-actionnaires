"use client";

import { useEffect, useState } from "react";

type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: string;
  exchange: string;
  updatedAt: number;
};

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  GBp: "p",
};

const QUOTE_CACHE_DURATION = 55_000;
const quoteCache = new Map<
  string,
  { quote: Quote; fetchedAt: number }
>();
const quoteRequests = new Map<string, Promise<Quote>>();

async function fetchQuote(symbol: string) {
  const cached = quoteCache.get(symbol);
  if (cached && Date.now() - cached.fetchedAt < QUOTE_CACHE_DURATION) {
    return cached.quote;
  }

  const pendingRequest = quoteRequests.get(symbol);
  if (pendingRequest) return pendingRequest;

  const request = fetch(`/api/quote/${encodeURIComponent(symbol)}`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const quote = (await response.json()) as Quote;
      if (
        !Number.isFinite(quote.price) ||
        !Number.isFinite(quote.change) ||
        !Number.isFinite(quote.changePercent)
      ) {
        throw new Error("Invalid quote payload");
      }
      quoteCache.set(symbol, { quote, fetchedAt: Date.now() });
      return quote;
    })
    .finally(() => {
      quoteRequests.delete(symbol);
    });

  quoteRequests.set(symbol, request);
  return request;
}

function formatPrice(
  price: number,
  currency: string,
  locale: "fr-FR" | "en-US"
): string {
  if (currency === "GBp") return `${price.toFixed(2)}p`;
  const sym = CURRENCY_SYMBOL[currency];
  const formatted = price.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (!sym) {
    return locale === "fr-FR"
      ? `${formatted} ${currency}`
      : `${currency} ${formatted}`;
  }
  return sym === "€" && locale === "fr-FR"
    ? `${formatted} €`
    : `${sym}${formatted}`;
}

function formatTotal(
  total: number,
  currency: string,
  locale: "fr-FR" | "en-US"
): string {
  if (currency === "GBp") {
    const pounds = total / 100;
    return `£${pounds.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  const sym = CURRENCY_SYMBOL[currency];
  const formatted = total.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  if (!sym) {
    return locale === "fr-FR"
      ? `${formatted} ${currency}`
      : `${currency} ${formatted}`;
  }
  return sym === "€" && locale === "fr-FR"
    ? `${formatted} €`
    : `${sym}${formatted}`;
}

export function StockPrice({
  symbol,
  locale = "fr-FR",
  loadingLabel = "COURS EN DIRECT",
  unavailableLabel = "COURS INDISPONIBLE",
}: {
  symbol: string;
  locale?: "fr-FR" | "en-US";
  loadingLabel?: string;
  unavailableLabel?: string;
}) {
  const quote = useQuote(symbol);

  if (quote === "error") {
    return (
      <div className="min-w-0">
        <p className="break-words font-[family-name:var(--font-display)] text-[36px] font-bold text-text-disabled leading-none [overflow-wrap:anywhere]">
          —
        </p>
        <p className="break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)] [overflow-wrap:anywhere]">
          {unavailableLabel}
        </p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-w-0">
        <p className="break-words font-[family-name:var(--font-display)] text-[36px] font-bold text-text-disabled leading-none animate-pulse [overflow-wrap:anywhere]">
          ···
        </p>
        <p className="break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)] [overflow-wrap:anywhere]">
          {loadingLabel}
        </p>
      </div>
    );
  }

  const isUp = quote.change >= 0;
  const sign = isUp ? "+" : "";
  const colorClass = isUp ? "text-[var(--success)]" : "text-[var(--error)]";

  return (
    <div className="min-w-0">
      <p className="break-words font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none [overflow-wrap:anywhere]">
        {formatPrice(quote.price, quote.currency, locale)}
      </p>
      <p
        className={`break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] ${colorClass} mt-[var(--space-xs)] [overflow-wrap:anywhere]`}
      >
        {sign}
        {quote.change.toFixed(2)} ({sign}
        {quote.changePercent.toFixed(2)}%)
      </p>
    </div>
  );
}

export function MinSharesCost({
  symbol,
  minShares,
  compact = false,
  label = "COÛT MIN.",
  locale = "fr-FR",
  loadingLabel = "COURS EN CHARGEMENT",
  unavailableLabel = "INDISPONIBLE",
}: {
  symbol: string;
  minShares: number;
  compact?: boolean;
  label?: string;
  locale?: "fr-FR" | "en-US";
  loadingLabel?: string;
  unavailableLabel?: string;
}) {
  const quote = useQuote(symbol);
  const valueClass = compact
    ? "text-[18px] sm:text-[20px]"
    : "text-[36px]";
  const labelClass = compact ? "text-[9px]" : "text-[11px]";

  if (quote === "error") {
    return (
      <div className="min-w-0">
        <p className={`font-[family-name:var(--font-display)] ${valueClass} font-bold text-text-disabled leading-none`}>
          —
        </p>
        <p className={`break-words font-[family-name:var(--font-data)] ${labelClass} tracking-[0.08em] text-text-disabled mt-[var(--space-xs)] [overflow-wrap:anywhere]`}>
          {unavailableLabel}
        </p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-w-0">
        <p className={`break-words font-[family-name:var(--font-display)] ${valueClass} font-bold text-text-disabled leading-none animate-pulse [overflow-wrap:anywhere]`}>
          ···
        </p>
        <p className={`break-words font-[family-name:var(--font-data)] ${labelClass} tracking-[0.08em] text-text-disabled mt-[var(--space-xs)] [overflow-wrap:anywhere]`}>
          {loadingLabel}
        </p>
      </div>
    );
  }

  const total = quote.price * minShares;

  return (
    <div className="min-w-0">
      <p className={`break-words font-[family-name:var(--font-display)] ${valueClass} font-bold text-text-display leading-none [overflow-wrap:anywhere]`}>
        {formatTotal(total, quote.currency, locale)}
      </p>
      <p className={`break-words font-[family-name:var(--font-data)] ${labelClass} tracking-[0.08em] text-text-disabled mt-[var(--space-xs)] [overflow-wrap:anywhere]`}>
        {label}
      </p>
    </div>
  );
}

function useQuote(symbol: string): Quote | "error" | null {
  const [state, setState] = useState<Quote | "error" | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const quote = await fetchQuote(symbol);
        if (!cancelled) setState(quote);
      } catch {
        if (!cancelled) setState("error");
      }
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbol]);

  return state;
}

export default StockPrice;
