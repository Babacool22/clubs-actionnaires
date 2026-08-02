import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CompanyLogo from "@/components/CompanyLogo";
import ParticleDotoText from "@/components/ParticleDotoText";
import GeoAnswerSummary from "@/components/GeoAnswerSummary";
import { MinSharesCost, StockPrice } from "@/components/StockPrice";
import { TrackedExternalLink } from "@/components/TrackedLink";
import { toYahooSymbol } from "@/lib/yahoo";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  clampSeoText,
  serializeJsonLd,
  withSeoBrand,
} from "@/lib/seo";
import {
  getEnglishCompanySlugs,
  getEnglishCompanyTranslation,
} from "@/lib/company-translations";
import { getShareholderAccess } from "@/lib/shareholder-access";

type Props = { params: Promise<{ slug: string }> };

const typeLabels: Record<string, string> = {
  reduction: "DISCOUNTS",
  cadeau: "GIFTS",
  evenement: "EVENTS",
  service: "SERVICES",
  priorite: "PRIORITY",
};

function absoluteLogoUrl(logoUrl: string | null) {
  if (!logoUrl) return undefined;
  if (logoUrl.startsWith("http")) return logoUrl;
  return `${BASE_URL}${logoUrl}`;
}

function splitRenderedSource(description: string) {
  const match = description.match(/\s*\(Source\s*:\s*(https?:\/\/[^)]+)\)\s*$/);

  if (!match) return { sourceUrl: null };

  return {
    sourceUrl: match[1],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const translation = getEnglishCompanyTranslation(slug);
  if (!translation) return { title: "Not found" };

  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      sector: true,
      stockIndex: true,
      lastVerifiedAt: true,
      updatedAt: true,
    },
  });

  if (!company) return { title: "Not found" };

  const url = `${BASE_URL}/en/companies/${slug}`;
  const frUrl = `${BASE_URL}/entreprises/${slug}`;
  const title = withSeoBrand(translation.seoTitle);
  const description = clampSeoText(translation.seoDescription, 158);
  const lastVerifiedAt = company.lastVerifiedAt ?? company.updatedAt;

  return {
    title,
    description,
    keywords: [
      `${translation.name} shareholder benefits`,
      `${translation.name} shareholders club`,
      `how many ${translation.name} shares for benefits`,
      `${translation.name} investor perks`,
      translation.sector,
      company.stockIndex,
    ],
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    category: translation.sector,
    alternates: {
      canonical: url,
      languages: {
        "fr-FR": frUrl,
        "en-US": url,
        "x-default": frUrl,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
      modifiedTime: lastVerifiedAt.toISOString(),
      images: [
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE_PATH],
    },
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

export function generateStaticParams() {
  return getEnglishCompanySlugs().map((slug) => ({ slug }));
}

export default async function EnglishCompanyPage({ params }: Props) {
  const { slug } = await params;
  const translation = getEnglishCompanyTranslation(slug);
  if (!translation) notFound();

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      benefits: { orderBy: { id: "asc" } },
      faqs: { orderBy: { order: "asc" } },
    },
  });

  if (!company) notFound();

  if (translation.benefits.length !== company.benefits.length) {
    throw new Error(
      `English benefit count mismatch for ${slug}: ${translation.benefits.length}/${company.benefits.length}`
    );
  }
  if (translation.faqs.length !== company.faqs.length) {
    throw new Error(
      `English FAQ count mismatch for ${slug}: ${translation.faqs.length}/${company.faqs.length}`
    );
  }

  const benefits = company.benefits.map((benefit, index) => ({
    ...benefit,
    title: translation.benefits[index].title,
    description: translation.benefits[index].description,
    value: translation.benefits[index].value ?? benefit.value,
    sourceUrl: splitRenderedSource(benefit.description).sourceUrl,
  }));
  const faqs = translation.faqs.map((faq, index) => ({
    id: index,
    question: faq.question,
    answer: faq.answer,
  }));
  const benefitsByType = benefits.reduce(
    (acc, benefit) => {
      if (!acc[benefit.type]) acc[benefit.type] = [];
      acc[benefit.type].push(benefit);
      return acc;
    },
    {} as Record<string, typeof benefits>
  );

  const yahooSymbol = toYahooSymbol(company.ticker, company.stockIndex);
  const shareholderAccess = getShareholderAccess(company.slug);
  const referenceShares = shareholderAccess?.minShares ?? company.minShares;
  const pageUrl = `${BASE_URL}/en/companies/${company.slug}`;
  const frUrl = `${BASE_URL}/entreprises/${company.slug}`;
  const lastVerifiedAt = company.lastVerifiedAt ?? company.updatedAt;
  const dateModified = lastVerifiedAt.toISOString();
  const lastVerifiedLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(lastVerifiedAt);
  const hasActiveBenefits = shareholderAccess
    ? shareholderAccess.programStatus !== "no_program" && benefits.length > 0
    : benefits.length > 0;
  const officialSourceUrl =
    shareholderAccess?.officialUrl ?? company.clubUrl ?? company.website;
  const programmeStatus = shareholderAccess
    ? {
        formal_club: "Active, documented shareholders' club",
        shareholder_benefit: "Active shareholder benefit without a separate club",
        shareholder_services: "Shareholder services without a benefits club",
        no_program: "No active shareholder programme identified",
        unclear: "Possible offer; 2026 conditions have not been published",
      }[shareholderAccess.programStatus]
    : hasActiveBenefits
      ? company.clubUrl
        ? "Documented shareholder club, programme or dedicated area"
        : "Documented shareholder benefits without a separate club"
      : "No active shareholder club or benefit identified";
  const alternateThresholdLabels: Record<string, string> = {
    "compagnie-des-alpes":
      "1 share for the Club; 400 registered shares held for 2 years for Shareholder Vouchers",
    edenred: "1 registered share or 30 bearer shares",
    mapfre:
      "1 share for general information; 1,000 shares and Spanish residency for the Club",
    orange:
      "1 share for the Club; more than 1,500 shares for Premium After Hours",
    repsol:
      "1 share for the Club; Waylet tiers start at 50, 850, 2,500 and 12,500 shares",
    totalenergies: "50 registered shares or 100 bearer shares",
  };
  const thresholdLabel = shareholderAccess
    ? shareholderAccess.programStatus === "no_program"
      ? "Not applicable"
      : shareholderAccess.programStatus === "unclear"
        ? "2026 conditions not published"
        : alternateThresholdLabels[company.slug] ??
          (referenceShares
            ? `${referenceShares} share${referenceShares > 1 ? "s" : ""}`
            : "No numeric threshold published")
    : referenceShares
      ? `${referenceShares} share${referenceShares > 1 ? "s" : ""}`
      : "No numeric threshold published";
  const mainBenefits = hasActiveBenefits
    ? benefits
        .slice(0, 3)
        .map((benefit) => benefit.title)
        .join("; ")
    : "No active benefit confirmed";
  const registrationSummary = translation.registrationProcedure
    ? clampSeoText(translation.registrationProcedure, 260)
    : officialSourceUrl
      ? "Check the official company page before taking action, as conditions and required documents may change."
      : "No official enrolment procedure is currently documented.";
  const quickAnswer = shareholderAccess?.programStatus === "no_program"
    ? `No active shareholder club or commercial benefit was identified for ${translation.name} as of the latest verification date.`
    : shareholderAccess?.programStatus === "unclear"
      ? `${translation.name} has a documented past or one-off shareholder offer, but its 2026 conditions have not been published.`
      : hasActiveBenefits
        ? `${translation.name} has ${benefits.length} documented shareholder benefit${benefits.length > 1 ? "s" : ""} or service${benefits.length > 1 ? "s" : ""}. Reference threshold: ${thresholdLabel}.`
        : `No active shareholder club or benefit was identified for ${translation.name} as of the latest verification date.`;
  const seoTitle = clampSeoText(translation.seoTitle, 60);
  const seoDescription = clampSeoText(translation.seoDescription, 158);

  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: seoTitle,
    description: seoDescription,
    inLanguage: "en-US",
    dateModified,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    about: { "@id": `${pageUrl}#company` },
    mainEntity: { "@id": `${pageUrl}#benefits` },
  };
  const corporationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": `${pageUrl}#company`,
    name: translation.name,
    description: translation.description,
    url: company.website ?? pageUrl,
    tickerSymbol: company.ticker ?? undefined,
    logo: absoluteLogoUrl(company.logoUrl),
    sameAs: [company.website, company.clubUrl].filter(Boolean),
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
  };
  const benefitsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#benefits`,
    name: `${translation.name} shareholder benefits`,
    numberOfItems: benefits.length,
    itemListElement: benefits.map((benefit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: benefit.title,
        description: benefit.description,
        category: benefit.type,
        url: benefit.sourceUrl ?? pageUrl,
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
    })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div
      lang="en"
      className="w-full max-w-5xl mx-auto overflow-x-clip px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] pt-[var(--space-xl)] sm:pt-[var(--space-2xl)] pb-28 sm:pb-[var(--space-2xl)]"
    >
      <BreadcrumbSchema
        items={[
          { name: "English catalogue", url: `${BASE_URL}/en` },
          { name: translation.name, url: pageUrl },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webpageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(corporationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(benefitsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      <nav className="flex min-w-0 items-center gap-[var(--space-sm)] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
        <Link
          href="/en#catalogue"
          className="shrink-0 font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors"
        >
          CATALOGUE
        </Link>
        <span className="shrink-0 text-text-disabled">/</span>
        <span className="min-w-0 break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary [overflow-wrap:anywhere]">
          {translation.name.toUpperCase()}
        </span>
      </nav>

      <div className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
        <div className="grid min-w-0 items-start gap-[var(--space-xl)] md:grid-cols-[minmax(0,1fr)_minmax(11rem,17rem)] md:gap-[var(--space-3xl)]">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)] mb-[var(--space-lg)]">
              {company.ticker && (
                <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
                  {company.ticker}
                </span>
              )}
              <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary border border-border-visible px-[var(--space-sm)] py-[var(--space-2xs)]">
                {company.stockIndex}
              </span>
              <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
                {translation.sector.toUpperCase()}
              </span>
            </div>

            <h1
              aria-label={translation.name}
              className="font-[family-name:var(--font-display)] text-[40px] sm:text-[48px] md:text-[72px] font-bold text-text-display leading-[1.0] tracking-[0.01em] mb-[var(--space-lg)] break-words"
            >
              <ParticleDotoText lines={[translation.name.toUpperCase()]} wrap />
            </h1>

            <p className="max-w-2xl break-words text-[16px] sm:text-[18px] text-text-secondary leading-[1.5] sm:leading-[1.3] mb-[var(--space-lg)] [overflow-wrap:anywhere]">
              {translation.description}
            </p>

            <div className="max-w-3xl min-w-0 border-l-2 border-accent pl-[var(--space-md)] mb-[var(--space-xl)]">
              <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-xs)]">
                DETAILED PAGE - CITED SOURCES
              </p>
              <p className="break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] [overflow-wrap:anywhere]">
                This page tracks {benefits.length} documented shareholder
                benefit{benefits.length > 1 ? "s" : ""} or service
                {benefits.length > 1 ? "s" : ""}. Reference threshold:{" "}
                {thresholdLabel}. Conditions can change, so always verify the
                official shareholders&apos; page before applying.
              </p>
              <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.05em] text-text-disabled mt-[var(--space-sm)]">
                LAST VERIFIED: {lastVerifiedLabel.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex justify-start md:justify-end md:pt-[var(--space-3xl)]">
            <CompanyLogo name={translation.name} logoUrl={company.logoUrl} />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-x-[var(--space-lg)] gap-y-[var(--space-xl)] sm:gap-[var(--space-xl)] border-t border-border pt-[var(--space-lg)]">
          {referenceShares && shareholderAccess?.programStatus !== "no_program" && (
            <>
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none">
                  {referenceShares}
                </p>
                <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
                  MIN. SHARE{referenceShares > 1 ? "S" : ""}
                </p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-border-visible" />
            </>
          )}
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] text-[36px] font-bold text-text-display leading-none">
              {benefits.length}
            </p>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
              BENEFITS
            </p>
          </div>
          {yahooSymbol && (
            <>
              <div className="hidden sm:block w-px h-8 bg-border-visible" />
              <StockPrice
                symbol={yahooSymbol}
                locale="en-US"
                loadingLabel="LIVE PRICE"
                unavailableLabel="PRICE UNAVAILABLE"
              />
              {referenceShares && shareholderAccess?.programStatus !== "no_program" && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-border-visible" />
                <MinSharesCost
                  symbol={yahooSymbol}
                  minShares={referenceShares}
                  locale="en-US"
                  label="MIN. COST"
                  loadingLabel="PRICE LOADING"
                  unavailableLabel="UNAVAILABLE"
                />
                </>
              )}
            </>
          )}
          {officialSourceUrl && (
            <>
              <div className="hidden sm:block w-px h-8 bg-border-visible" />
              <TrackedExternalLink
                href={officialSourceUrl}
                eventName="Open Official Club"
                eventProperties={{ company: company.slug, placement: "en_header" }}
                className="col-span-2 sm:col-span-1 min-h-11 min-w-0 break-words inline-flex items-center font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors [overflow-wrap:anywhere]"
              >
                OFFICIAL SHAREHOLDER AREA {"->"}
              </TrackedExternalLink>
            </>
          )}
        </div>
      </div>

      <GeoAnswerSummary
        eyebrow="QUICK ANSWER"
        title={`${translation.name}: key facts`}
        summary={quickAnswer}
        items={[
          { label: "PROGRAMME STATUS", value: programmeStatus },
          { label: "REFERENCE THRESHOLD", value: thresholdLabel },
          {
            label: "DOCUMENTED BENEFITS",
            value: `${benefits.length} benefit${benefits.length > 1 ? "s" : ""} or service${benefits.length > 1 ? "s" : ""}`,
          },
          { label: "MAIN BENEFITS", value: mainBenefits },
          { label: "HOW TO JOIN", value: registrationSummary },
          { label: "LAST VERIFIED", value: lastVerifiedLabel },
          {
            label: "OFFICIAL SOURCE",
            value: officialSourceUrl
              ? "Open the company's official source"
              : "No official URL documented",
            href: officialSourceUrl,
          },
        ]}
      />

      {officialSourceUrl && shareholderAccess?.programStatus !== "no_program" && (
        <section
          id="how-to-join"
          className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)] min-w-0 overflow-x-clip border border-border-visible bg-surface"
        >
          <div className="p-[var(--space-md)] sm:p-[var(--space-xl)] border-b border-border">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-sm)]">
              SHAREHOLDER PATH
            </p>
            <h2 className="break-words text-[26px] sm:text-[32px] font-medium text-text-display leading-[1.15] [overflow-wrap:anywhere]">
              {shareholderAccess?.programStatus === "shareholder_services"
                ? `How do you access ${translation.name} shareholder services?`
                : shareholderAccess?.programStatus === "shareholder_benefit"
                  ? `How do you request the ${translation.name} shareholder benefit?`
                  : `How do you join the ${translation.name} shareholders' club?`}
            </h2>
            <p className="max-w-3xl text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] mt-[var(--space-sm)]">
              Check the conditions when you apply: thresholds and procedures can
              evolve.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
              <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
                REFERENCE THRESHOLD
              </p>
              <p className="text-[18px] sm:text-[20px] font-medium text-text-display">
                {thresholdLabel}
              </p>
            </div>
            <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
              <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
                ESTIMATED INVESTMENT
              </p>
              {yahooSymbol && referenceShares ? (
                <MinSharesCost
                  symbol={yahooSymbol}
                  minShares={referenceShares}
                  compact
                  locale="en-US"
                  label="CURRENT PRICE"
                  loadingLabel="PRICE LOADING"
                  unavailableLabel="UNAVAILABLE"
                />
              ) : (
                <p className="text-[18px] sm:text-[20px] font-medium text-text-display">
                  {shareholderAccess?.programStatus === "unclear"
                    ? "2026 conditions not published"
                    : "No numeric threshold published"}
                </p>
              )}
            </div>
            <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
              <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
                HOLDING MODE
              </p>
              <p className="text-[18px] sm:text-[20px] font-medium text-text-display">
                {translation.holdingMode}
              </p>
            </div>
            <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
              <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
                PROGRAM ACCESS
              </p>
              <p className="text-[18px] sm:text-[20px] font-medium text-text-display">
                {translation.membershipCost}
              </p>
            </div>
          </div>

          <div className="p-[var(--space-md)] sm:p-[var(--space-xl)]">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-md)]">
              DOCUMENTED PROCEDURE
            </p>
            <p className="break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.65] [overflow-wrap:anywhere]">
              {translation.registrationProcedure}
            </p>
            <TrackedExternalLink
              href={officialSourceUrl}
              eventName="Join Official Club"
              eventProperties={{ company: company.slug, placement: "en_registration" }}
              className="mt-[var(--space-lg)] min-h-12 max-w-full break-words inline-flex items-center justify-center bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] sm:text-[12px] tracking-[0.06em] uppercase hover:opacity-80 transition-opacity [overflow-wrap:anywhere]"
            >
              VIEW OFFICIAL PROCEDURE {"->"}
            </TrackedExternalLink>
          </div>
        </section>
      )}

      <section className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)]">
          CLUB BENEFITS
        </p>
        <div className="space-y-[var(--space-2xl)]">
          {Object.entries(benefitsByType).map(([type, items]) => (
            <div key={type}>
              <h2 className="text-[24px] font-medium text-text-display mb-[var(--space-md)]">
                {typeLabels[type] ?? type.toUpperCase()}
              </h2>
              <div className="border-t border-border">
                {items.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="border-b border-border py-[var(--space-lg)] flex min-w-0 flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-sm)] sm:gap-[var(--space-lg)] hover:bg-surface transition-colors px-0 sm:px-[var(--space-md)]"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-[16px] font-medium text-text-display mb-[var(--space-xs)] [overflow-wrap:anywhere]">
                        {benefit.title}
                      </h3>
                      <p className="break-words text-[14px] text-text-secondary leading-[1.5] [overflow-wrap:anywhere]">
                        {benefit.description}
                      </p>
                      {benefit.sourceUrl && (
                        <TrackedExternalLink
                          href={benefit.sourceUrl}
                          eventName="Open Benefit Source"
                          eventProperties={{
                            company: company.slug,
                            benefit: benefit.title,
                          }}
                          className="mt-[var(--space-sm)] inline-flex max-w-full break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors [overflow-wrap:anywhere]"
                        >
                          SOURCE {"->"}
                        </TrackedExternalLink>
                      )}
                    </div>
                    {benefit.value && (
                      <span className="max-w-full break-words font-[family-name:var(--font-data)] text-[12px] sm:text-[13px] text-accent font-bold sm:max-w-[14rem] sm:text-right [overflow-wrap:anywhere]">
                        {benefit.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-[var(--space-3xl)] min-w-0 overflow-x-clip">
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)]">
          FREQUENTLY ASKED QUESTIONS - {translation.name.toUpperCase()}
        </p>
        <div className="border-t border-border">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group min-w-0 border-b border-border py-[var(--space-lg)] px-[var(--space-md)]"
            >
              <summary className="flex min-w-0 items-start justify-between gap-[var(--space-lg)] cursor-pointer list-none">
                <h2 className="min-w-0 flex-1 break-words text-[16px] font-medium text-text-display [overflow-wrap:anywhere]">
                  {faq.question}
                </h2>
                <span className="shrink-0 font-[family-name:var(--font-data)] text-[13px] text-text-disabled group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="break-words text-[14px] text-text-secondary leading-[1.5] mt-[var(--space-md)] [overflow-wrap:anywhere]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-[var(--space-2xl)] sm:mt-[var(--space-3xl)] border-t border-border pt-[var(--space-lg)] flex flex-col sm:flex-row gap-[var(--space-md)] sm:items-center sm:justify-between">
        <Link
          href="/en#catalogue"
          className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled hover:text-text-display transition-colors"
        >
          {"<-"} BACK TO ENGLISH CATALOGUE
        </Link>
        <Link
          href={frUrl}
          className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-interactive hover:text-text-display transition-colors"
        >
          VERSION FRANCAISE {"->"}
        </Link>
      </div>
    </div>
  );
}
