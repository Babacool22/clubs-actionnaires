"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <footer className="mt-[var(--space-4xl)] border-t border-border">
      <div className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="flex flex-col items-start justify-between gap-[var(--space-xl)] md:flex-row md:gap-[var(--space-2xl)]">
          <div className="shrink-0">
            <div className="mb-[var(--space-sm)] flex items-center gap-[var(--space-sm)]">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-[family-name:var(--font-data)] text-[11px] font-bold uppercase tracking-[0.08em] text-text-display">
                {isEnglish ? "Shareholder Clubs" : "Clubs Actionnaires"}
              </span>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-text-secondary">
              {isEnglish
                ? "A verified catalogue of shareholder benefits from major global companies."
                : "Catalogue des avantages actionnaires des plus grandes entreprises mondiales."}
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-lg)] md:items-end">
            <nav
              aria-label={isEnglish ? "Footer navigation" : "Navigation du pied de page"}
              className="flex w-full flex-wrap items-center justify-start gap-x-[var(--space-lg)] gap-y-[var(--space-sm)] md:justify-end"
            >
              <Link href={isEnglish ? "/en#catalogue" : "/#catalogue"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                Catalogue
              </Link>
              <Link href={isEnglish ? "/en#registration-guide" : "/#inscription"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                {isEnglish ? "How to join" : "Guide d'inscription"}
              </Link>
              <Link href={isEnglish ? "/en/about" : "/a-propos"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                {isEnglish ? "About" : "A propos"}
              </Link>
              <Link href={isEnglish ? "/en/faq" : "/faq"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                FAQ
              </Link>
              <Link href={isEnglish ? "/en/shareholder-clubs-report" : "/observatoire"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                {isEnglish ? "Data report" : "Observatoire"}
              </Link>
              <Link href={isEnglish ? "/en/legal-notice" : "/mentions-legales"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                {isEnglish ? "Legal notice" : "Mentions legales"}
              </Link>
              <Link href={isEnglish ? "/en/privacy-policy" : "/politique-de-confidentialite"} className="whitespace-nowrap text-[13px] text-text-secondary transition-colors hover:text-text-display">
                {isEnglish ? "Privacy policy" : "Confidentialite"}
              </Link>
            </nav>

            <p className="max-w-xl text-[12px] leading-relaxed text-text-disabled md:text-right">
              {isEnglish
                ? "Always verify conditions directly with each company. No investment advice."
                : "Verifiez les conditions directement aupres des entreprises. Aucun conseil en investissement."}
            </p>
          </div>
        </div>

        <div className="mt-[var(--space-xl)] flex flex-col justify-between gap-[var(--space-sm)] border-t border-border pt-[var(--space-lg)] sm:flex-row">
          <p className="text-[11px] text-text-disabled">
            (c) {new Date().getFullYear()} Clubs Actionnaires
          </p>
          <p className="text-[11px] text-text-disabled">
            {isEnglish
              ? "Non-contractual data - Official sources prioritised"
              : "Donnees non contractuelles - Sources officielles prioritaires"}
          </p>
        </div>
      </div>
    </footer>
  );
}
