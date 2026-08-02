import type { Metadata } from "next";
import Link from "next/link";
import {
  buildCatalogueReportSummary,
  getCatalogueReportCompanies,
} from "@/lib/catalogue-report";
import { getEnglishCompanyTranslation } from "@/lib/company-translations";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${BASE_URL}/en/shareholder-clubs-report`;
const FR_PAGE_URL = `${BASE_URL}/observatoire`;
const DATA_URL = `${BASE_URL}/data/shareholder-clubs.csv`;
const PUBLISHED_AT = "2026-07-30";

function englishSector(slug: string, fallback: string) {
  return getEnglishCompanyTranslation(slug)?.sector ?? fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const companies = await getCatalogueReportCompanies();
  const summary = buildCatalogueReportSummary(companies, (company) =>
    englishSector(company.slug, company.sector)
  );
  const title = `2026 shareholder clubs report: ${summary.companyCount} companies | ${SITE_NAME}`;
  const description = `Study of ${summary.companyCount} companies and ${summary.benefitCount} shareholder benefits, with eligibility thresholds, sectors, methodology and downloadable verified data.`;

  return {
    title,
    description,
    alternates: {
      canonical: PAGE_URL,
      languages: {
        "fr-FR": FR_PAGE_URL,
        "en-US": PAGE_URL,
        "x-default": FR_PAGE_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      publishedTime: PUBLISHED_AT,
      modifiedTime: summary.lastUpdated.toISOString(),
      images: [
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: "2026 shareholder clubs report",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE_PATH],
    },
  };
}

export default async function ShareholderClubsReportPage() {
  const companies = await getCatalogueReportCompanies();
  const summary = buildCatalogueReportSummary(companies, (company) =>
    englishSector(company.slug, company.sector)
  );
  const activeRate = Math.round(
    (summary.activeCompanyCount / summary.companyCount) * 100
  );
  const lastUpdatedLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(summary.lastUpdated);
  const citation = `${SITE_NAME} (2026), 2026 Shareholder Clubs Report, ${PAGE_URL}.`;
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${PAGE_URL}#dataset`,
    name: "2026 Shareholder Clubs Report",
    description: `A verified dataset covering ${summary.companyCount} major companies, ${summary.benefitCount} shareholder benefits, eligibility thresholds, sectors, stock indices and official source links.`,
    url: PAGE_URL,
    identifier: PAGE_URL,
    inLanguage: ["en-US", "fr-FR"],
    isAccessibleForFree: true,
    datePublished: PUBLISHED_AT,
    dateModified: summary.lastUpdated.toISOString(),
    temporalCoverage: "2026",
    creator: {
      "@type": "Person",
      name: "Bastien Coulonnier",
      url: `${BASE_URL}/en/about`,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    keywords: [
      "shareholder clubs",
      "shareholder benefits",
      "eligibility thresholds",
      "individual shareholders",
      "financial dataset",
    ],
    measurementTechnique:
      "Manual verification of official investor-relations pages and shareholder club rules.",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Companies reviewed",
        value: summary.companyCount,
      },
      {
        "@type": "PropertyValue",
        name: "Benefits recorded",
        value: summary.benefitCount,
      },
      {
        "@type": "PropertyValue",
        name: "Sectors represented",
        value: summary.sectorCount,
      },
    ],
    distribution: {
      "@type": "DataDownload",
      contentUrl: DATA_URL,
      encodingFormat: "text/csv",
    },
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(datasetJsonLd) }}
      />

      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] lg:py-[var(--space-4xl)]">
          <p className="mb-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
            VERIFIED DATA · 2026 EDITION
          </p>
          <h1 className="max-w-5xl font-[family-name:var(--font-display)] text-[42px] font-bold leading-[1.02] text-text-display sm:text-[56px] lg:text-[72px]">
            Shareholder Clubs Report
          </h1>
          <p className="mt-[var(--space-xl)] max-w-3xl text-[17px] leading-[1.65] text-text-secondary sm:text-[19px]">
            A consolidated view of programmes for individual shareholders,
            compiled from official club rules and investor-relations sources.
          </p>
          <p className="mt-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.05em] text-text-disabled">
            LAST UPDATED · {lastUpdatedLabel.toUpperCase()}
          </p>
        </div>
      </header>

      <section className="border-b border-border">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-[var(--space-md)] sm:px-[var(--space-lg)] lg:grid-cols-4 lg:px-[var(--space-xl)]">
          {[
            ["Companies reviewed", summary.companyCount],
            ["Programmes with benefits", summary.activeCompanyCount],
            ["Benefits recorded", summary.benefitCount],
            ["Sectors represented", summary.sectorCount],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-border px-[var(--space-md)] py-[var(--space-xl)] even:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"
            >
              <dt className="font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.08em] text-text-disabled">
                {label}
              </dt>
              <dd className="mt-[var(--space-sm)] font-[family-name:var(--font-display)] text-[36px] font-bold leading-none text-text-display sm:text-[48px]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <main className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <section className="grid gap-[var(--space-2xl)] border-b border-border pb-[var(--space-3xl)] lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              KEY FINDINGS
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium leading-tight text-text-display">
              Accessible programmes with widely varying rules
            </h2>
          </div>
          <div className="grid gap-[var(--space-xl)] sm:grid-cols-3">
            <div>
              <p className="text-[28px] font-medium text-text-display">
                {activeRate}%
              </p>
              <p className="mt-[var(--space-xs)] text-[14px] leading-relaxed text-text-secondary">
                of reviewed companies publish at least one identifiable
                shareholder benefit.
              </p>
            </div>
            <div>
              <p className="text-[28px] font-medium text-text-display">
                {summary.oneShareCompanyCount}
              </p>
              <p className="mt-[var(--space-xs)] text-[14px] leading-relaxed text-text-secondary">
                programmes are accessible from a single share.
              </p>
            </div>
            <div>
              <p className="text-[28px] font-medium text-text-display">
                {summary.medianMinimumShares ?? "—"}
              </p>
              <p className="mt-[var(--space-xs)] text-[14px] leading-relaxed text-text-secondary">
                shares is the median threshold among programmes that publish a
                minimum holding.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-[var(--space-3xl)]">
          <div className="mb-[var(--space-xl)] max-w-3xl">
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              BREAKDOWN
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium text-text-display">
              Shareholder clubs by sector
            </h2>
          </div>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {[
                    "Sector",
                    "Companies",
                    "Active programmes",
                    "Benefits",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.08em] text-text-disabled"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.sectors.map((sector) => (
                  <tr
                    key={sector.name}
                    className="border-b border-border last:border-b-0"
                  >
                    <th className="px-[var(--space-md)] py-[var(--space-md)] text-[14px] font-medium text-text-display">
                      {sector.name}
                    </th>
                    <td className="px-[var(--space-md)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] text-text-secondary">
                      {sector.companyCount}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] text-text-secondary">
                      {sector.activeCompanyCount}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] text-text-secondary">
                      {sector.benefitCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-[var(--space-2xl)] border-b border-border py-[var(--space-3xl)] lg:grid-cols-2">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              METHODOLOGY
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium text-text-display">
              Company-by-company verification
            </h2>
          </div>
          <div className="space-y-[var(--space-md)] text-[15px] leading-[1.7] text-text-secondary">
            <p>
              Investor-relations pages, club rules, enrolment forms and official
              company communications are prioritised. Every company profile
              displays its latest verification date.
            </p>
            <p>
              Standard shareholder rights, customer promotions and unconfirmed
              perks are not counted as shareholder-club benefits.
            </p>
            <p>
              Conditions can change. Always check the company&apos;s official
              source before taking action.
            </p>
          </div>
        </section>

        <section className="grid gap-[var(--space-2xl)] py-[var(--space-3xl)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              DATA AND CITATION
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium text-text-display">
              Download and cite the report
            </h2>
            <p className="mt-[var(--space-md)] max-w-2xl text-[15px] leading-[1.7] text-text-secondary">
              The CSV contains companies, sectors, indices, thresholds, benefit
              counts, verification dates and official-source URLs.
            </p>
            <div className="mt-[var(--space-xl)] flex flex-wrap gap-[var(--space-md)]">
              <a
                href="/data/shareholder-clubs.csv"
                download
                className="border border-accent bg-accent px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-hover"
              >
                Download CSV
              </a>
              <Link
                href="/en#catalogue"
                className="border border-border-visible px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] font-bold uppercase tracking-[0.06em] text-text-display transition-colors hover:border-text-secondary"
              >
                Browse the catalogue
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-accent pl-[var(--space-lg)]">
            <p className="font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.08em] text-text-disabled">
              Recommended citation
            </p>
            <p className="mt-[var(--space-md)] break-words text-[14px] leading-[1.7] text-text-secondary">
              {citation}
            </p>
            <p className="mt-[var(--space-lg)] text-[12px] leading-relaxed text-text-disabled">
              Indicative, non-contractual data. Official company terms prevail.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
