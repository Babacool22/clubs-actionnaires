const SUFFIX_BY_INDEX: Record<string, string> = {
  CAC40: ".PA",
  SBF120: ".PA",
  "IBEX 35": ".MC",
  "FTSE MIB": ".MI",
  "FTSE 100": ".L",
  "S&P 500": "",
};

const SYMBOL_OVERRIDES: Record<string, string> = {
  "CAC40:MT": "MT.AS",
};

export function toYahooSymbol(
  ticker: string | null | undefined,
  stockIndex: string
): string | null {
  if (!ticker) return null;
  const override = SYMBOL_OVERRIDES[`${stockIndex}:${ticker}`];
  if (override) return override;

  const suffix = SUFFIX_BY_INDEX[stockIndex] ?? "";
  const base = suffix === "" ? ticker.replace(".", "-") : ticker;
  return `${base}${suffix}`;
}
