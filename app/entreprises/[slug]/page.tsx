import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BenefitBadge from "@/components/BenefitBadge";
import { StockPrice, MinSharesCost } from "@/components/StockPrice";
import Faq from "@/components/Faq";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { toYahooSymbol } from "@/lib/yahoo";
import { BASE_URL } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return { title: "Introuvable" };
  return {
    title: `${company.name} — CLUBS ACTIONNAIRES`,
    description: `Avantages actionnaires de ${company.name}.`,
  };
}

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { slug: true } });
  return companies.map((c) => ({ slug: c.slug }));
}

const typeLabels: Record<string, string> = {
  reduction: "REDUCTIONS",
  cadeau: "CADEAUX",
  evenement: "EVENEMENTS",
  service: "SERVICES",
  priorite: "PRIORITE",
};

export default async function EntreprisePage({ params }: Props) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { benefits: true, faqs: { orderBy: { order: "asc" } } },
  });

  if (!company) notFound();

  const benefitsByType = company.benefits.reduce(
    (acc, benefit) => {
      if (!acc[benefit.type]) acc[benefit.type] = [];
      acc[benefit.type].push(benefit);
      return acc;
    },
    {} as Record<string, typeof company.benefits>
  );

  return (
    <div className="max-w-4xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-[var(--space-sm)] mb-[var(--space-2xl)]">
        <Link
          href="/"
          className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors duration-[var(--duration-micro)]"
        >
          CATALOGUE
        </Link>
        <span className="text-text-disabled">/</span>
        <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary">
          {company.name.toUpperCase()}
        </span>
      </nav>

      <BreadcrumbSchema
        items={[
          { name: "Catalogue", url: `${BASE_URL}/` },
          {
            name: company.name,
            url: `${BASE_URL}/entreprises/${company.slug}`,
          },
        ]}
      />

      {/* Company Header */}
      <div className="mb-[var(--space-3xl)]">
        {/* Top metadata row */}
        <div className="flex items-center gap-[var(--space-md)] mb-[var(--space-lg)]">
          {company.ticker && (
            <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
              {company.ticker}
            </span>
          )}
          <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary border border-border-visible px-[var(--space-sm)] py-[var(--space-2xs)]">
            {company.stockIndex}
          </span>
          <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
            {company.sector.toUpperCase()}
          </span>
        </div>

        {/* Primary — Company name */}
        <h1 className="font-[family-name:var(--font-display)] text-[48px] md:text-[72px] font-bold text-text-display leading-[1.0] tracking-[-0.03em] mb-[var(--space-lg)]">
          {company.name.toUpperCase()}
        </h1>

        {/* Secondary — Description */}
        <p className="text-[18px] text-text-secondary leading-[1.3] max-w-2xl mb-[var(--space-xl)]">
          {company.description}
        </p>

        {/* Data row */}
        {(() => {
          const yahooSymbol = toYahooSymbol(company.ticker, company.stockIndex);
          return (
            <div className="flex flex-wrap items-center gap-[var(--space-xl)] border-t border-border pt-[var(--space-lg)]">
              {company.minShares && (
                <>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none">
                      {company.minShares}
                    </p>
                    <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
                      ACTION{company.minShares > 1 ? "S" : ""} MIN.
                    </p>
                  </div>
                  <div className="w-px h-8 bg-border-visible" />
                </>
              )}
              <div>
                <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none">
                  {company.benefits.length}
                </p>
                <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
                  AVANTAGE{company.benefits.length > 1 ? "S" : ""}
                </p>
              </div>
              {yahooSymbol && (
                <>
                  <div className="w-px h-8 bg-border-visible" />
                  <StockPrice symbol={yahooSymbol} />
                  {company.minShares && (
                    <>
                      <div className="w-px h-8 bg-border-visible" />
                      <MinSharesCost
                        symbol={yahooSymbol}
                        minShares={company.minShares}
                      />
                    </>
                  )}
                </>
              )}
              {company.clubUrl && (
                <>
                  <div className="w-px h-8 bg-border-visible" />
                  <a
                    href={company.clubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors duration-[var(--duration-micro)]"
                  >
                    CLUB OFFICIEL →
                  </a>
                </>
              )}
            </div>
          );
        })()}
      </div>

      {/* Benefits */}
      <div className="mb-[var(--space-3xl)]">
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)]">
          AVANTAGES DU CLUB
        </p>

        <div className="space-y-[var(--space-2xl)]">
          {Object.entries(benefitsByType).map(([type, benefits]) => {
            const label = typeLabels[type] ?? type.toUpperCase();

            return (
              <div key={type}>
                {/* Type header */}
                <div className="flex items-center gap-[var(--space-md)] mb-[var(--space-md)]">
                  <h3 className="font-[family-name:var(--font-body)] text-[24px] font-medium text-text-display leading-[1.2] tracking-[-0.01em]">
                    {label}
                  </h3>
                  <BenefitBadge type={type} />
                </div>

                {/* Benefit items */}
                <div className="border-t border-border">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="border-b border-border py-[var(--space-lg)] flex items-start justify-between gap-[var(--space-lg)] hover:bg-surface transition-colors duration-[var(--duration-micro)] px-[var(--space-md)]"
                    >
                      <div className="flex-1">
                        <h4 className="text-[16px] font-medium text-text-display mb-[var(--space-xs)]">
                          {benefit.title}
                        </h4>
                        <p className="text-[14px] text-text-secondary leading-[1.5]">
                          {benefit.description}
                        </p>
                      </div>
                      {benefit.value && (
                        <span className="flex-shrink-0 font-[family-name:var(--font-data)] text-[13px] text-accent font-bold whitespace-nowrap">
                          {benefit.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      {company.faqs.length > 0 && (
        <Faq items={company.faqs} companyName={company.name} />
      )}

      {/* CTA */}
      <div className="border-t border-border pt-[var(--space-xl)]">
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-md)]">
          ACTIONNAIRE DE {company.name.toUpperCase()} ?
        </p>
        <div className="flex items-center gap-[var(--space-md)]">
          {company.clubUrl ? (
            <a
              href={company.clubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[var(--space-sm)] bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[13px] tracking-[0.08em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
            >
              S'INSCRIRE AU CLUB →
            </a>
          ) : company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[var(--space-sm)] bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[13px] tracking-[0.08em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
            >
              SITE OFFICIEL →
            </a>
          ) : null}
        </div>
      </div>

      {/* Back */}
      <div className="mt-[var(--space-3xl)] border-t border-border pt-[var(--space-lg)]">
        <Link
          href="/"
          className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors duration-[var(--duration-micro)]"
        >
          ← RETOUR AU CATALOGUE
        </Link>
      </div>
    </div>
  );
}
