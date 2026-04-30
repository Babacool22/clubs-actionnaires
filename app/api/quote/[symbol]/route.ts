import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

type Props = { params: Promise<{ symbol: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { symbol } = await params;

  if (!/^[A-Z0-9.\-]+$/i.test(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=1d&range=1d`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; clubs-actionnaires/1.0; +https://clubs-actionnaires.vercel.app)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Yahoo Finance ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta) {
      return NextResponse.json({ error: "No data" }, { status: 404 });
    }

    const price: number = meta.regularMarketPrice;
    const previousClose: number =
      meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;

    return NextResponse.json(
      {
        symbol: meta.symbol,
        price,
        previousClose,
        change,
        changePercent,
        currency: meta.currency,
        marketState: meta.marketState,
        exchange: meta.exchangeName,
        updatedAt: Date.now(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fetch failed" },
      { status: 502 }
    );
  }
}
