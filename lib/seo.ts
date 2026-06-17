export const BASE_URL = "https://clubsactionnaires.fr";
export const SITE_NAME = "Clubs Actionnaires";

export function clampSeoText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength - 1).trimEnd();
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.72) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}
