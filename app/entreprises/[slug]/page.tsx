import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BenefitBadge from "@/components/BenefitBadge";
import { StockPrice, MinSharesCost } from "@/components/StockPrice";
import Faq from "@/components/Faq";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import {
  TrackedExternalLink,
  TrackedLink,
} from "@/components/TrackedLink";
import CatalogueReturnLink from "@/components/CatalogueReturnLink";
import { toYahooSymbol } from "@/lib/yahoo";
import { BASE_URL } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { benefits: { select: { id: true } } },
  });
  if (!company) return { title: "Introuvable" };
  const url = `${BASE_URL}/entreprises/${company.slug}`;
  const minPart = company.minShares
    ? ` Dès ${company.minShares} action${company.minShares > 1 ? "s" : ""}.`
    : "";
  const description = `${company.benefits.length} avantages actionnaires ${company.name} (${company.sector}) : réductions, cadeaux, événements, services.${minPart} Source vérifiée.`;
  return {
    title: `Avantages actionnaires ${company.name} — Clubs Actionnaires`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `Avantages actionnaires ${company.name}`,
      description,
      url,
      type: "article",
      locale: "fr_FR",
    },
    twitter: { card: "summary", title: company.name, description },
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

function sectorFamily(sector: string) {
  return sector.toLocaleLowerCase("fr").split(/[&/]/)[0].trim();
}

export default async function EntreprisePage({ params }: Props) {
  const { slug } = await params;
  const [company, catalogueCompanies] = await Promise.all([
    prisma.company.findUnique({
      where: { slug },
      include: { benefits: true, faqs: { orderBy: { order: "asc" } } },
    }),
    prisma.company.findMany({
      select: {
        slug: true,
        name: true,
        sector: true,
        stockIndex: true,
        minShares: true,
        _count: { select: { benefits: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!company) notFound();

  const benefitsByType = company.benefits.reduce(
    (acc, benefit) => {
      if (!acc[benefit.type]) acc[benefit.type] = [];
      acc[benefit.type].push(benefit);
      return acc;
    },
    {} as Record<string, typeof company.benefits>
  );

  const currentIndex = catalogueCompanies.findIndex(
    (item) => item.slug === company.slug
  );
  const previousCompany =
    currentIndex > 0 ? catalogueCompanies[currentIndex - 1] : null;
  const nextCompany =
    currentIndex >= 0 && currentIndex < catalogueCompanies.length - 1
      ? catalogueCompanies[currentIndex + 1]
      : null;

  const relatedCompanies = [
    ...catalogueCompanies.filter(
      (item) =>
        item.slug !== company.slug &&
        sectorFamily(item.sector) === sectorFamily(company.sector)
    ),
    ...catalogueCompanies.filter(
      (item) =>
        item.slug !== company.slug &&
        item.sector !== company.sector &&
        item.stockIndex === company.stockIndex
    ),
  ]
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.slug === item.slug) === index
    )
    .slice(0, 3);

  const benefitTypeNames = Object.keys(benefitsByType)
    .map((type) => typeLabels[type] ?? type.toUpperCase())
    .join(", ")
    .toLowerCase();
  const hasCitedSources = company.benefits.some((benefit) =>
    benefit.description.includes("(Source :")
  );

  return (
    <div className="max-w-5xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-xl)] sm:py-[var(--space-2xl)]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-[var(--space-sm)] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
        <CatalogueReturnLink
          className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors duration-[var(--duration-micro)]"
        >
          CATALOGUE
        </CatalogueReturnLink>
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

      {/* Corporation JSON-LD (invisible) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Corporation",
            name: company.name,
            description: company.description,
            url: company.website ?? undefined,
            tickerSymbol: company.ticker ?? undefined,
            logo: company.logoUrl ?? undefined,
            sameAs: [company.website, company.clubUrl].filter(Boolean),
          }),
        }}
      />

      {/* ItemList JSON-LD des avantages (invisible) */}
      {company.benefits.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Avantages actionnaires ${company.name}`,
              numberOfItems: company.benefits.length,
              itemListElement: company.benefits.map((b, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Offer",
                  name: b.title,
                  description: b.description,
                  category: b.type,
                  ...(b.value ? { priceSpecification: { "@type": "PriceSpecification", description: b.value } } : {}),
                },
              })),
            }),
          }}
        />
      )}

      {/* Company Header */}
      <div className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
        {/* Top metadata row */}
        <div className="flex flex-wrap items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)] mb-[var(--space-lg)]">
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
        <h1 className="font-[family-name:var(--font-display)] text-[40px] sm:text-[48px] md:text-[72px] font-bold text-text-display leading-[1.0] tracking-[-0.03em] mb-[var(--space-lg)] break-words">
          {company.name.toUpperCase()}
        </h1>

        {/* Secondary — Description */}
        <p className="text-[16px] sm:text-[18px] text-text-secondary leading-[1.5] sm:leading-[1.3] max-w-2xl mb-[var(--space-lg)]">
          {company.description}
        </p>

        <div className="max-w-3xl border-l-2 border-accent pl-[var(--space-md)] mb-[var(--space-xl)]">
          <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-xs)]">
            {hasCitedSources ? "FICHE DETAILLEE · SOURCES CITEES" : "FICHE SYNTHETIQUE"}
          </p>
          <p className="text-[14px] sm:text-[15px] text-text-secondary leading-[1.6]">
            Cette fiche recense {company.benefits.length} avantage
            {company.benefits.length > 1 ? "s" : ""} ou service
            {company.benefits.length > 1 ? "s" : ""}
            {company.minShares
              ? ` accessible${company.benefits.length > 1 ? "s" : ""} à partir de ${company.minShares} action${company.minShares > 1 ? "s" : ""}`
              : ""}
            {benefitTypeNames ? ` : ${benefitTypeNames}.` : "."}
            {!hasCitedSources &&
              " Les conditions peuvent évoluer : vérifiez toujours la page officielle avant toute démarche."}
          </p>
        </div>

        {/* Data row */}
        {(() => {
          const yahooSymbol = toYahooSymbol(company.ticker, company.stockIndex);
          return (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xl)] sm:gap-[var(--space-xl)] border-t border-border pt-[var(--space-lg)]">
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
                  <div className="hidden sm:block w-px h-8 bg-border-visible" />
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
                  <div className="hidden sm:block w-px h-8 bg-border-visible" />
                  <StockPrice symbol={yahooSymbol} />
                  {company.minShares && (
                    <>
                      <div className="hidden sm:block w-px h-8 bg-border-visible" />
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
                  <div className="hidden sm:block w-px h-8 bg-border-visible" />
                  <TrackedExternalLink
                    href={company.clubUrl}
                    eventName="Open Official Club"
                    eventProperties={{
                      company: company.slug,
                      placement: "header",
                    }}
                    className="col-span-2 sm:col-span-1 min-h-11 inline-flex items-center font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors duration-[var(--duration-micro)]"
                  >
                    CLUB OFFICIEL →
                  </TrackedExternalLink>
                </>
              )}
            </div>
          );
        })()}
      </div>

      {/* Benefits */}
      <div className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
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
                      className="border-b border-border py-[var(--space-lg)] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-sm)] sm:gap-[var(--space-lg)] hover:bg-surface transition-colors duration-[var(--duration-micro)] px-0 sm:px-[var(--space-md)]"
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
                        <span className="flex-shrink-0 font-[family-name:var(--font-data)] text-[12px] sm:text-[13px] text-accent font-bold sm:whitespace-nowrap">
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
            <TrackedExternalLink
              href={company.clubUrl}
              eventName="Join Official Club"
              eventProperties={{
                company: company.slug,
                minShares: company.minShares,
              }}
              className="w-full sm:w-auto min-h-12 inline-flex items-center justify-center gap-[var(--space-sm)] bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[12px] sm:text-[13px] tracking-[0.08em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
            >
              S&apos;INSCRIRE AU CLUB →
            </TrackedExternalLink>
          ) : company.website ? (
            <TrackedExternalLink
              href={company.website}
              eventName="Open Company Website"
              eventProperties={{ company: company.slug }}
              className="w-full sm:w-auto min-h-12 inline-flex items-center justify-center gap-[var(--space-sm)] bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[12px] sm:text-[13px] tracking-[0.08em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
            >
              SITE OFFICIEL →
            </TrackedExternalLink>
          ) : null}
        </div>
      </div>

      {(previousCompany || nextCompany) && (
        <nav
          aria-label="Navigation entre les entreprises"
          className="grid grid-cols-2 gap-px bg-border mt-[var(--space-2xl)] sm:mt-[var(--space-3xl)] border border-border"
        >
          {previousCompany ? (
            <TrackedLink
              href={`/entreprises/${previousCompany.slug}`}
              eventName="Browse Previous Company"
              eventProperties={{ from: company.slug, to: previousCompany.slug }}
              className="bg-surface min-h-24 p-[var(--space-md)] flex flex-col justify-between hover:bg-surface-raised transition-colors duration-[var(--duration-micro)]"
            >
              <span className="font-[family-name:var(--font-data)] text-[9px] sm:text-[10px] tracking-[0.08em] text-text-disabled">
                ← PRECEDENTE
              </span>
              <span className="text-[14px] sm:text-[16px] font-medium text-text-display">
                {previousCompany.name}
              </span>
            </TrackedLink>
          ) : (
            <div className="bg-surface" />
          )}
          {nextCompany ? (
            <TrackedLink
              href={`/entreprises/${nextCompany.slug}`}
              eventName="Browse Next Company"
              eventProperties={{ from: company.slug, to: nextCompany.slug }}
              className="bg-surface min-h-24 p-[var(--space-md)] flex flex-col items-end text-right justify-between hover:bg-surface-raised transition-colors duration-[var(--duration-micro)]"
            >
              <span className="font-[family-name:var(--font-data)] text-[9px] sm:text-[10px] tracking-[0.08em] text-text-disabled">
                SUIVANTE →
              </span>
              <span className="text-[14px] sm:text-[16px] font-medium text-text-display">
                {nextCompany.name}
              </span>
            </TrackedLink>
          ) : (
            <div className="bg-surface" />
          )}
        </nav>
      )}

      {relatedCompanies.length > 0 && (
        <section className="mt-[var(--space-2xl)] sm:mt-[var(--space-3xl)]">
          <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-md)]">
            ENTREPRISES SIMILAIRES
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
            {relatedCompanies.map((related) => (
              <TrackedLink
                key={related.slug}
                href={`/entreprises/${related.slug}`}
                eventName="Open Related Company"
                eventProperties={{ from: company.slug, to: related.slug }}
                className="bg-surface p-[var(--space-md)] hover:bg-surface-raised transition-colors duration-[var(--duration-micro)]"
              >
                <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
                  {related.stockIndex} · {related.sector.toUpperCase()}
                </p>
                <h2 className="text-[18px] font-medium text-text-display mb-[var(--space-sm)]">
                  {related.name}
                </h2>
                <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.05em] text-text-secondary">
                  {related._count.benefits} AVANTAGES
                  {related.minShares
                    ? ` · ${related.minShares} ACTION${related.minShares > 1 ? "S" : ""} MIN.`
                    : ""}
                </p>
              </TrackedLink>
            ))}
          </div>
        </section>
      )}

      {/* Back */}
      <div className="mt-[var(--space-2xl)] sm:mt-[var(--space-3xl)] border-t border-border pt-[var(--space-lg)]">
        <CatalogueReturnLink
          className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors duration-[var(--duration-micro)]"
        >
          ← RETOUR AU CATALOGUE
        </CatalogueReturnLink>
      </div>
    </div>
  );
}
