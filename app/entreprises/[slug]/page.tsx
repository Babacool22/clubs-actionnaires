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
import RegistrationPanel from "@/components/RegistrationPanel";
import { toYahooSymbol } from "@/lib/yahoo";
import { BASE_URL, SITE_NAME, clampSeoText } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

type CompanySeoInput = {
  name: string;
  slug: string;
  sector: string;
  stockIndex: string;
  minShares: number | null;
  updatedAt?: Date;
  benefits: Array<unknown>;
};

function buildCompanySeo(company: CompanySeoInput) {
  const benefitCount = company.benefits.length;
  const hasBenefits = benefitCount > 0;
  const minSharesText = company.minShares
    ? ` dès ${company.minShares} action${company.minShares > 1 ? "s" : ""}`
    : "";

  const title = hasBenefits
    ? `Avantages actionnaires ${company.name}`
    : `${company.name} : fiche actionnaire vérifiée`;

  const description = hasBenefits
    ? `Découvrez ${benefitCount} avantage${benefitCount > 1 ? "s" : ""} actionnaire${benefitCount > 1 ? "s" : ""} ${company.name}${minSharesText} : conditions, coût estimé, FAQ et sources officielles.`
    : `Fiche actionnaire ${company.name} : aucun club ou avantage actif identifié. Consultez les FAQ, sources officielles et droits à ne pas confondre.`;

  return {
    title: clampSeoText(title, 60),
    description: clampSeoText(description, 158),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { benefits: { select: { id: true } } },
  });
  if (!company) return { title: "Introuvable" };
  const url = `${BASE_URL}/entreprises/${company.slug}`;
  const seo = buildCompanySeo(company);
  const keywords = [
    `avantages actionnaires ${company.name}`,
    `club actionnaire ${company.name}`,
    `combien actions ${company.name}`,
    `conditions actionnaires ${company.name}`,
    company.sector,
    company.stockIndex,
  ];

  return {
    title: seo.title,
    description: seo.description,
    keywords,
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    category: company.sector,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "fr_FR",
      modifiedTime: company.updatedAt.toISOString(),
    },
    twitter: { card: "summary", title: seo.title, description: seo.description },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

function findRegistrationProcedure(
  faqs: Array<{ question: string; answer: string }>,
  benefits: Array<{ title: string; description: string }>
) {
  const rankedFaqs = faqs
    .map((faq) => {
      const question = normalizeText(faq.question);
      const answer = normalizeText(faq.answer);
      let score = 0;

      if (question.includes("comment")) score += 2;
      if (
        question.includes("rejoindre") ||
        question.includes("devenir actionnaire") ||
        question.includes("adherer") ||
        question.includes("inscription") ||
        question.includes("acceder") ||
        question.includes("beneficier")
      ) {
        score += 4;
      }
      if (
        question.includes("combien d'action") ||
        question.includes("nombre d'action")
      ) {
        score += 3;
      }
      if (
        answer.includes("inscription") ||
        answer.includes("adhesion") ||
        answer.includes("attestation") ||
        answer.includes("justificatif") ||
        answer.includes("preuve de detention")
      ) {
        score += 2;
      }

      return { answer: faq.answer, score };
    })
    .sort((a, b) => b.score - a.score);

  if (rankedFaqs[0]?.score >= 4) return rankedFaqs[0].answer;

  const registrationBenefit = benefits.find((benefit) => {
    const title = normalizeText(benefit.title);
    return title.includes("adhesion") || title.includes("inscription");
  });

  return (
    registrationBenefit?.description.replace(/\s*\(Source\s*:[^)]+\)\s*$/, "") ??
    null
  );
}

function getHoldingMode(procedure: string | null) {
  if (!procedure) return "À vérifier";

  const text = normalizeText(procedure);
  const mentionsBearer = text.includes("au porteur");
  const mentionsRegistered = text.includes("au nominatif");

  if (mentionsBearer && mentionsRegistered) return "Porteur ou nominatif";
  if (
    text.includes("compte titres ordinaire") &&
    (text.includes("pas de pea") ||
      text.includes("non eligible au pea") ||
      text.includes("n'est pas eligible au pea"))
  ) {
    return "Compte-titres ordinaire";
  }
  if (text.includes("pea") && text.includes("compte titres")) {
    return "PEA ou compte-titres";
  }
  if (mentionsRegistered) return "Nominatif mentionné";
  if (mentionsBearer) return "Au porteur";

  return "À vérifier";
}

function getProofRequirement(procedure: string | null) {
  if (!procedure) {
    return "Les pièces demandées doivent être vérifiées sur la page officielle.";
  }

  const text = normalizeText(procedure);
  if (text.includes("stockperks")) {
    return "La détention est vérifiée via Stockperks selon la procédure indiquée.";
  }
  if (text.includes("attestation")) {
    return "Préparez une attestation de détention fournie par votre intermédiaire financier.";
  }
  if (text.includes("justificatif") || text.includes("preuve de detention")) {
    return "Préparez un justificatif récent prouvant la détention de vos actions.";
  }

  return "Consultez la page officielle pour connaître les pièces éventuellement demandées.";
}

function getMembershipCost(
  faqs: Array<{ question: string; answer: string }>,
  procedure: string | null
) {
  const feeFaq = faqs.find((faq) => {
    const question = normalizeText(faq.question);
    return (
      question.includes("payant") ||
      question.includes("gratuit") ||
      question.includes("cotisation")
    );
  });
  const source = normalizeText(feeFaq?.answer ?? procedure ?? "");

  if (
    source.includes("gratuit") ||
    source.includes("aucune cotisation") ||
    source.includes("aucun frais d'inscription")
  ) {
    return "Gratuit";
  }

  return "À vérifier";
}

function splitRenderedSource(description: string) {
  const match = description.match(/\s*\(Source\s*:\s*(https?:\/\/[^)]+)\)\s*$/);

  if (!match) return { text: description, sourceUrl: null };

  return {
    text: description.slice(0, match.index).trim(),
    sourceUrl: match[1],
  };
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
  const registrationProcedure = findRegistrationProcedure(
    company.faqs,
    company.benefits
  );
  const yahooSymbol = toYahooSymbol(company.ticker, company.stockIndex);
  const hasActiveBenefits = company.benefits.length > 0;
  const officialRegistrationUrl = hasActiveBenefits
    ? company.clubUrl ?? company.website
    : null;
  const pageUrl = `${BASE_URL}/entreprises/${company.slug}`;
  const seo = buildCompanySeo(company);
  const dateModified = company.updatedAt.toISOString();
  const corporationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": `${pageUrl}#company`,
    name: company.name,
    description: company.description,
    url: company.website ?? pageUrl,
    tickerSymbol: company.ticker ?? undefined,
    logo: company.logoUrl ?? undefined,
    sameAs: [company.website, company.clubUrl].filter(Boolean),
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
  };
  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: seo.title,
    description: seo.description,
    inLanguage: "fr-FR",
    dateModified,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    about: { "@id": `${pageUrl}#company` },
    mainEntity: hasActiveBenefits
      ? { "@id": `${pageUrl}#benefits` }
      : { "@id": `${pageUrl}#company` },
  };
  const benefitsJsonLd = hasActiveBenefits
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${pageUrl}#benefits`,
        name: `Avantages actionnaires ${company.name}`,
        numberOfItems: company.benefits.length,
        itemListElement: company.benefits.map((benefit, i) => {
          const renderedSource = splitRenderedSource(benefit.description);

          return {
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Offer",
              name: benefit.title,
              description: renderedSource.text,
              category: benefit.type,
              url: renderedSource.sourceUrl ?? pageUrl,
              offeredBy: { "@id": `${pageUrl}#company` },
              ...(benefit.value
                ? {
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      description: benefit.value,
                    },
                  }
                : {}),
            },
          };
        }),
      }
    : null;

  return (
    <div className={`w-full max-w-5xl mx-auto overflow-x-clip px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] pt-[var(--space-xl)] sm:pt-[var(--space-2xl)] ${officialRegistrationUrl ? "pb-28 sm:pb-[var(--space-2xl)]" : "pb-[var(--space-xl)] sm:pb-[var(--space-2xl)]"}`}>
      {/* Breadcrumb */}
      <nav className="flex min-w-0 items-center gap-[var(--space-sm)] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
        <CatalogueReturnLink
          className="shrink-0 font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors duration-[var(--duration-micro)]"
        >
          CATALOGUE
        </CatalogueReturnLink>
        <span className="shrink-0 text-text-disabled">/</span>
        <span className="min-w-0 break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary [overflow-wrap:anywhere]">
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

      {/* WebPage + Corporation JSON-LD (invisible) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(corporationJsonLd) }}
      />

      {/* ItemList JSON-LD des avantages (invisible) */}
      {benefitsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(benefitsJsonLd) }}
        />
      )}

      {/* Company Header */}
      <div className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
        {/* Top metadata row */}
        <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)] mb-[var(--space-lg)]">
          {company.ticker && (
            <span className="break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled [overflow-wrap:anywhere]">
              {company.ticker}
            </span>
          )}
          <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary border border-border-visible px-[var(--space-sm)] py-[var(--space-2xs)]">
            {company.stockIndex}
          </span>
          <span className="min-w-0 break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled [overflow-wrap:anywhere]">
            {company.sector.toUpperCase()}
          </span>
        </div>

        {/* Primary — Company name */}
        <h1 className="font-[family-name:var(--font-display)] text-[40px] sm:text-[48px] md:text-[72px] font-bold text-text-display leading-[1.0] tracking-[-0.03em] mb-[var(--space-lg)] break-words">
          {company.name.toUpperCase()}
        </h1>

        {/* Secondary — Description */}
        <p className="max-w-2xl break-words text-[16px] sm:text-[18px] text-text-secondary leading-[1.5] sm:leading-[1.3] mb-[var(--space-lg)] [overflow-wrap:anywhere]">
          {company.description}
        </p>

        <div className="max-w-3xl min-w-0 border-l-2 border-accent pl-[var(--space-md)] mb-[var(--space-xl)]">
          <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-xs)] [overflow-wrap:anywhere]">
            {hasCitedSources ? "FICHE DETAILLEE · SOURCES CITEES" : "FICHE SYNTHETIQUE"}
          </p>
          <p className="break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] [overflow-wrap:anywhere]">
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
          return (
            <div className="grid min-w-0 grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xl)] sm:gap-[var(--space-xl)] border-t border-border pt-[var(--space-lg)]">
              {company.minShares && (
                <>
                  <div className="min-w-0">
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
              <div className="min-w-0">
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
                    className="col-span-2 sm:col-span-1 min-h-11 min-w-0 break-words inline-flex items-center font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors duration-[var(--duration-micro)] [overflow-wrap:anywhere]"
                  >
                    ESPACE ACTIONNAIRES →
                  </TrackedExternalLink>
                </>
              )}
            </div>
          );
        })()}
      </div>

      {officialRegistrationUrl && (
        <RegistrationPanel
          companyName={company.name}
          companySlug={company.slug}
          minShares={company.minShares}
          yahooSymbol={yahooSymbol}
          holdingMode={getHoldingMode(registrationProcedure)}
          membershipCost={getMembershipCost(
            company.faqs,
            registrationProcedure
          )}
          proofRequirement={getProofRequirement(registrationProcedure)}
          procedure={registrationProcedure}
          officialUrl={officialRegistrationUrl}
          companyWebsite={company.website}
        />
      )}

      {/* Benefits */}
      <div className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)]">
          AVANTAGES DU CLUB
        </p>

        {hasActiveBenefits ? (
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
                  {benefits.map((benefit) => {
                    const renderedSource = splitRenderedSource(
                      benefit.description
                    );

                    return (
                      <div
                        key={benefit.id}
                        className="border-b border-border py-[var(--space-lg)] flex min-w-0 flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-sm)] sm:gap-[var(--space-lg)] hover:bg-surface transition-colors duration-[var(--duration-micro)] px-0 sm:px-[var(--space-md)]"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="break-words text-[16px] font-medium text-text-display mb-[var(--space-xs)] [overflow-wrap:anywhere]">
                            {benefit.title}
                          </h4>
                          <p className="break-words text-[14px] text-text-secondary leading-[1.5] [overflow-wrap:anywhere]">
                            {renderedSource.text}
                          </p>
                          {renderedSource.sourceUrl && (
                            <TrackedExternalLink
                              href={renderedSource.sourceUrl}
                              eventName="Open Benefit Source"
                              eventProperties={{
                                company: company.slug,
                                benefit: benefit.title,
                              }}
                              className="mt-[var(--space-sm)] inline-flex max-w-full break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors duration-[var(--duration-micro)] [overflow-wrap:anywhere]"
                            >
                              SOURCE OFFICIELLE →
                            </TrackedExternalLink>
                          )}
                        </div>
                        {benefit.value && (
                          <span className="max-w-full break-words font-[family-name:var(--font-data)] text-[12px] sm:text-[13px] text-accent font-bold sm:max-w-[14rem] sm:text-right [overflow-wrap:anywhere]">
                            {benefit.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="border border-border-visible bg-surface p-[var(--space-md)] sm:p-[var(--space-xl)]">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-sm)]">
              AUCUN AVANTAGE ACTIF IDENTIFIE
            </p>
            <h2 className="break-words text-[22px] sm:text-[26px] font-medium text-text-display leading-[1.2] mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              Pas de club actionnaire publiable pour {company.name}
            </h2>
            <p className="break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] [overflow-wrap:anywhere]">
              Les sources vérifiées ne montrent pas de club, remise, cadeau,
              événement ou service économique réservé aux actionnaires
              individuels. La fiche conserve donc les FAQ utiles pour éviter
              de confondre les relations investisseurs, le dividende, l&apos;AG
              ou les publications financières avec de vrais avantages.
            </p>
            {company.website && (
              <TrackedExternalLink
                href={company.website}
                eventName="Open Investor Website"
                eventProperties={{
                  company: company.slug,
                  placement: "no_benefits_state",
                }}
                className="mt-[var(--space-lg)] inline-flex min-h-11 max-w-full break-words items-center font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors duration-[var(--duration-micro)] [overflow-wrap:anywhere]"
              >
                CONSULTER LE SITE INVESTISSEURS →
              </TrackedExternalLink>
            )}
          </div>
        )}
      </div>

      {/* FAQ */}
      {company.faqs.length > 0 && (
        <Faq items={company.faqs} companyName={company.name} />
      )}

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
              className="bg-surface min-h-24 min-w-0 p-[var(--space-md)] flex flex-col justify-between hover:bg-surface-raised transition-colors duration-[var(--duration-micro)]"
            >
              <span className="break-words font-[family-name:var(--font-data)] text-[9px] sm:text-[10px] tracking-[0.08em] text-text-disabled [overflow-wrap:anywhere]">
                ← PRECEDENTE
              </span>
              <span className="break-words text-[14px] sm:text-[16px] font-medium text-text-display [overflow-wrap:anywhere]">
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
              className="bg-surface min-h-24 min-w-0 p-[var(--space-md)] flex flex-col items-end text-right justify-between hover:bg-surface-raised transition-colors duration-[var(--duration-micro)]"
            >
              <span className="break-words font-[family-name:var(--font-data)] text-[9px] sm:text-[10px] tracking-[0.08em] text-text-disabled [overflow-wrap:anywhere]">
                SUIVANTE →
              </span>
              <span className="break-words text-[14px] sm:text-[16px] font-medium text-text-display [overflow-wrap:anywhere]">
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
                className="bg-surface min-w-0 p-[var(--space-md)] hover:bg-surface-raised transition-colors duration-[var(--duration-micro)]"
              >
                <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
                  {related.stockIndex} · {related.sector.toUpperCase()}
                </p>
                <h2 className="break-words text-[18px] font-medium text-text-display mb-[var(--space-sm)] [overflow-wrap:anywhere]">
                  {related.name}
                </h2>
                <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.05em] text-text-secondary [overflow-wrap:anywhere]">
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
