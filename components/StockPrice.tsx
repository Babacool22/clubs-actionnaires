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

function formatPrice(price: number, currency: string): string {
  if (currency === "GBp") return `${price.toFixed(2)}p`;
  const sym = CURRENCY_SYMBOL[currency] ?? currency;
  const formatted = price.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return sym === "€" ? `${formatted} €` : `${sym}${formatted}`;
}

function formatTotal(total: number, currency: string): string {
  if (currency === "GBp") {
    const pounds = total / 100;
    return `£${pounds.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  const sym = CURRENCY_SYMBOL[currency] ?? currency;
  const formatted = total.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return sym === "€" ? `${formatted} €` : `${sym}${formatted}`;
}

export function StockPrice({ symbol }: { symbol: string }) {
  const quote = useQuote(symbol);

  if (quote === "error") {
    return (
      <div>
        <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-disabled leading-none">
          —
        </p>
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
          COURS INDISPONIBLE
        </p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div>
        <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-disabled leading-none animate-pulse">
          ···
        </p>
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
          COURS EN DIRECT
        </p>
      </div>
    );
  }

  const isUp = quote.change >= 0;
  const sign = isUp ? "+" : "";
  const colorClass = isUp ? "text-[var(--success)]" : "text-[var(--error)]";

  return (
    <div>
      <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none">
        {formatPrice(quote.price, quote.currency)}
      </p>
      <p
        className={`font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] ${colorClass} mt-[var(--space-xs)]`}
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
}: {
  symbol: string;
  minShares: number;
}) {
  const quote = useQuote(symbol);

  if (quote === "error" || !quote) {
    return (
      <div>
        <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-disabled leading-none">
          —
        </p>
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
          COÛT MIN.
        </p>
      </div>
    );
  }

  const total = quote.price * minShares;

  return (
    <div>
      <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none">
        {formatTotal(total, quote.currency)}
      </p>
      <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
        COÛT MIN.
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
        const res = await fetch(`/api/quote/${encodeURIComponent(symbol)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Quote = await res.json();
        if (!cancelled) setState(data);
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
