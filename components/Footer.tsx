"use client";

import Link from "next/link";
import NewsletterCta from "./NewsletterCta";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <footer className="mt-[var(--space-4xl)] border-t border-border">
      <div className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="flex flex-col items-start justify-between gap-[var(--space-xl)] md:flex-row">
          <div>
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

          <div className="flex flex-col gap-[var(--space-xl)] sm:flex-row sm:gap-[var(--space-2xl)]">
            <div>
              <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.08em] text-text-disabled">
                Navigation
              </p>
              <ul className="space-y-[var(--space-xs)]">
                <li>
                  <Link
                    href={isEnglish ? "/en#catalogue" : "/#catalogue"}
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link
                    href={
                      isEnglish ? "/en#registration-guide" : "/#inscription"
                    }
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    {isEnglish ? "How to join" : "Guide d'inscription"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={isEnglish ? "/en/about" : "/a-propos"}
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    {isEnglish ? "About" : "A propos"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={isEnglish ? "/en#newsletter" : "/#newsletter"}
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    {isEnglish ? "Newsletter (FR)" : "Le Club Actionnaire"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={isEnglish ? "/en/faq" : "/faq"}
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href={
                      isEnglish
                        ? "/en/shareholder-clubs-report"
                        : "/observatoire"
                    }
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    {isEnglish ? "Data report" : "Observatoire"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.08em] text-text-disabled">
                Legal
              </p>
              <ul className="space-y-[var(--space-xs)]">
                <li>
                  <Link
                    href={
                      isEnglish ? "/en/legal-notice" : "/mentions-legales"
                    }
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    {isEnglish ? "Legal notice" : "Mentions legales"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={
                      isEnglish
                        ? "/en/privacy-policy"
                        : "/politique-de-confidentialite"
                    }
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-display"
                  >
                    {isEnglish ? "Privacy policy" : "Confidentialite"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="max-w-xs">
              <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.08em] text-text-disabled">
                {isEnglish
                  ? "Indicative information"
                  : "Informations indicatives"}
              </p>
              <p className="text-[12px] leading-relaxed text-text-disabled">
                {isEnglish
                  ? "Always verify conditions directly with each company. No investment advice."
                  : "Verifiez les conditions directement aupres des entreprises. Aucun conseil en investissement."}
              </p>
            </div>

            <NewsletterCta
              variant="footer"
              placement="footer_email_box"
              locale={isEnglish ? "en" : "fr"}
            />
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
