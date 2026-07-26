"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { hasEnglishCompanyTranslation } from "@/lib/company-translations";

export default function Header() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const englishCompanyMatch = pathname.match(/^\/en\/companies\/([^/]+)/);
  const frenchCompanyMatch = pathname.match(/^\/entreprises\/([^/]+)/);
  const frenchCompanySlug = frenchCompanyMatch?.[1];
  const languageHref = isEnglish
    ? englishCompanyMatch
      ? `/entreprises/${englishCompanyMatch[1]}`
      : "/"
    : frenchCompanySlug && hasEnglishCompanyTranslation(frenchCompanySlug)
      ? `/en/companies/${frenchCompanySlug}`
      : "/en";
  const catalogueHref = isEnglish ? "/en#catalogue" : "/#catalogue";
  const inscriptionHref = isEnglish ? "/en#catalogue" : "/#inscription";
  const aboutHref = isEnglish ? "/en" : "/a-propos";

  return (
    <header className="sticky top-0 z-50 bg-[var(--black)] border-b border-border">
      <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="flex items-center justify-between h-14 gap-[var(--space-sm)]">
          <Link href={isEnglish ? "/en" : "/"} className="flex items-center gap-[var(--space-xs)] sm:gap-[var(--space-sm)] min-w-0">
            {/* Dot indicator */}
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span
              className="font-[family-name:var(--font-data)] text-[10px] sm:text-[13px] font-bold tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-display leading-tight"
            >
              <span className="sm:hidden">Clubs</span>
              <span className="hidden sm:inline">
                {isEnglish ? "Shareholder Clubs" : "Clubs Actionnaires"}
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-lg)]">
            <Link
              href={catalogueHref}
              className="min-h-11 inline-flex items-center font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              {isEnglish ? "Catalogue" : "Catalogue"}
            </Link>
            <Link
              href={inscriptionHref}
              className="min-h-11 inline-flex items-center font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              <span className="sm:hidden">{isEnglish ? "Guide" : "Guide"}</span>
              <span className="hidden sm:inline">
                {isEnglish ? "English" : "S'inscrire"}
              </span>
            </Link>
            <Link
              href={aboutHref}
              className="hidden sm:inline-flex min-h-11 items-center font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              {isEnglish ? "About" : "A propos"}
            </Link>
            <Link
              href={languageHref}
              className="min-h-11 inline-flex items-center font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
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
