"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { hasEnglishCompanyTranslation } from "@/lib/company-translations";

const frenchToEnglishRoutes: Record<string, string> = {
  "/": "/en",
  "/a-propos": "/en/about",
  "/faq": "/en/faq",
  "/mentions-legales": "/en/legal-notice",
  "/politique-de-confidentialite": "/en/privacy-policy",
};

const englishToFrenchRoutes: Record<string, string> = Object.fromEntries(
  Object.entries(frenchToEnglishRoutes).map(([fr, en]) => [en, fr])
);

export default function Header() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const englishCompanyMatch = pathname.match(/^\/en\/companies\/([^/]+)/);
  const frenchCompanyMatch = pathname.match(/^\/entreprises\/([^/]+)/);
  const frenchCompanySlug = frenchCompanyMatch?.[1];

  const languageHref = isEnglish
    ? englishCompanyMatch
      ? `/entreprises/${englishCompanyMatch[1]}`
      : englishToFrenchRoutes[pathname] ?? "/"
    : frenchCompanySlug && hasEnglishCompanyTranslation(frenchCompanySlug)
      ? `/en/companies/${frenchCompanySlug}`
      : frenchToEnglishRoutes[pathname] ?? "/en";

  const catalogueHref = isEnglish ? "/en#catalogue" : "/#catalogue";
  const inscriptionHref = isEnglish
    ? "/en#registration-guide"
    : "/#inscription";
  const aboutHref = isEnglish ? "/en/about" : "/a-propos";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--black)]">
      <div className="mx-auto max-w-7xl px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="flex h-14 items-center justify-between gap-[var(--space-sm)]">
          <Link
            href={isEnglish ? "/en" : "/"}
            className="flex min-w-0 items-center gap-[var(--space-xs)] sm:gap-[var(--space-sm)]"
          >
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-[family-name:var(--font-data)] text-[10px] font-bold uppercase leading-tight tracking-[0.05em] text-text-display sm:text-[13px] sm:tracking-[0.08em]">
              <span className="sm:hidden">Clubs</span>
              <span className="hidden sm:inline">
                {isEnglish ? "Shareholder Clubs" : "Clubs Actionnaires"}
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-lg)]">
            <Link
              href={catalogueHref}
              className="inline-flex min-h-11 items-center font-[family-name:var(--font-data)] text-[9px] uppercase tracking-[0.05em] text-text-secondary transition-colors duration-[var(--duration-micro)] hover:text-text-display sm:text-[11px] sm:tracking-[0.08em]"
            >
              Catalogue
            </Link>
            <Link
              href={inscriptionHref}
              className="inline-flex min-h-11 items-center font-[family-name:var(--font-data)] text-[9px] uppercase tracking-[0.05em] text-text-secondary transition-colors duration-[var(--duration-micro)] hover:text-text-display sm:text-[11px] sm:tracking-[0.08em]"
            >
              <span className="sm:hidden">Guide</span>
              <span className="hidden sm:inline">
                {isEnglish ? "How to join" : "S'inscrire"}
              </span>
            </Link>
            <Link
              href={aboutHref}
              className="hidden min-h-11 items-center font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.08em] text-text-secondary transition-colors duration-[var(--duration-micro)] hover:text-text-display sm:inline-flex"
            >
              {isEnglish ? "About" : "A propos"}
            </Link>
            <Link
              href={languageHref}
              className="inline-flex min-h-11 items-center font-[family-name:var(--font-data)] text-[9px] uppercase tracking-[0.05em] text-text-secondary transition-colors duration-[var(--duration-micro)] hover:text-text-display sm:text-[11px] sm:tracking-[0.08em]"
            >
              {isEnglish ? "FR" : "EN"}
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
