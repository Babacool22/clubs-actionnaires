import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  getEnglishCompanySlugs,
  getEnglishCompanyTranslation,
} from "@/lib/company-translations";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

const EN_URL = `${BASE_URL}/en`;

export const metadata: Metadata = {
  title: "Shareholder Clubs - Benefits for individual shareholders",
  description:
    "English catalogue of shareholder clubs, eligibility thresholds, shareholder benefits and official sources.",
  alternates: {
    canonical: EN_URL,
    languages: {
      "fr-FR": BASE_URL,
      "en-US": EN_URL,
      "x-default": BASE_URL,
    },
  },
  openGraph: {
    title: "Shareholder Clubs",
    description:
      "English catalogue of shareholder clubs, eligibility thresholds and official sources.",
    url: EN_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Shareholder Clubs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shareholder Clubs",
    description:
      "English catalogue of shareholder clubs, eligibility thresholds and official sources.",
    images: [SOCIAL_IMAGE_PATH],
  },
};

export default async function EnglishHomePage() {
  const translatedSlugs = getEnglishCompanySlugs();
  const companies = await prisma.company.findMany({
    where: { slug: { in: translatedSlugs } },
    include: { benefits: true },
    orderBy: { name: "asc" },
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${EN_URL}#catalogue`,
        url: EN_URL,
        name: "Shareholder clubs catalogue",
        description:
          "Verified English catalogue of shareholder club benefits, share thresholds and enrolment conditions.",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${EN_URL}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${EN_URL}#itemlist`,
        name: "Shareholder Clubs - English catalogue",
        numberOfItems: companies.length,
        itemListElement: companies.map((company, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${company.name} shareholder benefits`,
          url: `${BASE_URL}/en/companies/${company.slug}`,
        })),
      },
    ],
  };

  return (
    <div lang="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListJsonLd) }}
      />

      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)] sm:py-[var(--space-3xl)]">
          <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent mb-[var(--space-md)]">
            ENGLISH PILOT
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[42px] sm:text-[56px] md:text-[72px] font-bold text-text-display leading-[1.0] mb-[var(--space-lg)]">
            SHAREHOLDER
            <br />
            CLUBS
          </h1>
          <p className="text-[16px] sm:text-[18px] text-text-secondary leading-[1.6] max-w-2xl">
            English shareholder benefit pages are being rolled out progressively.
            This local pilot validates the bilingual architecture before the full
            SEO translation phase.
          </p>
        </div>
      </section>

      <section
        id="catalogue"
        className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]"
      >
        <div className="flex items-end justify-between gap-[var(--space-md)] mb-[var(--space-lg)]">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
              CATALOGUE
            </p>
            <h2 className="text-[28px] font-medium text-text-display leading-tight">
              Translated company pages
            </h2>
          </div>
          <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
            {companies.length} READY
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {companies.map((company) => {
            const translation = getEnglishCompanyTranslation(company.slug);
            if (!translation) return null;

            return (
              <Link
                key={company.slug}
                href={`/en/companies/${company.slug}`}
                className="group min-w-0 bg-surface border border-border p-[var(--space-md)] sm:p-[var(--space-lg)] hover:border-border-visible transition-colors"
              >
                <div className="flex items-start justify-between gap-[var(--space-md)] mb-[var(--space-lg)]">
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
                      {company.ticker ?? company.stockIndex}
                    </p>
                    <h3 className="break-words text-[24px] font-medium text-text-display mt-[var(--space-xs)] [overflow-wrap:anywhere]">
                      {translation.name}
                    </h3>
                  </div>
                  {company.logoUrl && (
                    <div className="relative w-20 aspect-square shrink-0 overflow-hidden">
                      <Image
                        src={company.logoUrl}
                        alt={`${translation.name} logo`}
                        fill
                        sizes="5rem"
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[14px] text-text-secondary mb-[var(--space-lg)]">
                  {translation.sector}
                </p>
                <p className="line-clamp-3 text-[14px] text-text-disabled leading-[1.6] mb-[var(--space-lg)]">
                  {translation.description}
                </p>
                <div className="border-t border-border pt-[var(--space-md)] flex items-center justify-between gap-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
                    {company.benefits.length} BENEFITS
                  </span>
                  <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary group-hover:text-text-display transition-colors">
                    DETAILS {"->"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
