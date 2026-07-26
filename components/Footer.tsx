"use client";

import Link from "next/link";
import NewsletterCta from "./NewsletterCta";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <footer className="border-t border-border mt-[var(--space-4xl)]">
      <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-[var(--space-xl)]">
          <div>
            <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
              <div className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-display font-bold">
                {isEnglish ? "Shareholder Clubs" : "Clubs Actionnaires"}
              </span>
            </div>
            <p className="text-[14px] text-text-secondary leading-relaxed max-w-sm">
              {isEnglish
                ? "Catalogue of shareholder benefits from major global companies."
                : "Catalogue des avantages actionnaires des plus grandes entreprises mondiales."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-[var(--space-xl)] sm:gap-[var(--space-2xl)]">
            <div>
              <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-disabled mb-[var(--space-sm)]">
                Navigation
              </p>
              <ul className="space-y-[var(--space-xs)]">
                <li>
                  <Link
                    href={isEnglish ? "/en#catalogue" : "/#catalogue"}
                    className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                  >
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link
                    href={isEnglish ? "/en#catalogue" : "/#inscription"}
                    className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                  >
                    {isEnglish ? "English pilot" : "Guide d'inscription"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={isEnglish ? "/en" : "/a-propos"}
                    className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                  >
                    {isEnglish ? "About" : "A propos"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#newsletter"
                    className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                  >
                    Le Club Actionnaire
                  </Link>
                </li>
                {!isEnglish && (
                  <li>
                    <Link
                      href="/faq"
                      className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-disabled mb-[var(--space-sm)]">
                Legal
              </p>
              <ul className="space-y-[var(--space-xs)]">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                  >
                    {isEnglish ? "Legal notice" : "Mentions legales"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politique-de-confidentialite"
                    className="text-[13px] text-text-secondary hover:text-text-display transition-colors"
                  >
                    {isEnglish ? "Privacy" : "Confidentialite"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="max-w-xs">
              <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-disabled mb-[var(--space-sm)]">
                {isEnglish
                  ? "Indicative information"
                  : "Informations indicatives"}
              </p>
              <p className="text-[12px] text-text-disabled leading-relaxed">
                {isEnglish
                  ? "Always verify conditions directly with each company. No investment advice."
                  : "Verifiez les conditions directement aupres des entreprises. Aucun conseil en investissement."}
              </p>
            </div>

            <NewsletterCta variant="footer" placement="footer_email_box" />
          </div>
        </div>

        <div className="mt-[var(--space-xl)] pt-[var(--space-lg)] border-t border-border flex flex-col sm:flex-row justify-between gap-[var(--space-sm)]">
          <p className="text-[11px] text-text-disabled">
            (c) {new Date().getFullYear()} Clubs Actionnaires
          </p>
          <p className="text-[11px] text-text-disabled">
            {isEnglish
              ? "Non-contractual data - Official sources prioritized"
              : "Donnees non contractuelles - Sources officielles prioritaires"}
          </p>
        </div>
      </div>
    </footer>
  );
}
