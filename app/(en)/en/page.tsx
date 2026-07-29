import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogueClient from "@/components/CatalogueClient";
import NewsletterCta from "@/components/NewsletterCta";
import ParticleDotoText from "@/components/ParticleDotoText";
import { prisma } from "@/lib/prisma";
import {
  getEnglishCompanyTranslation,
  getEnglishCompanySlugs,
} from "@/lib/company-translations";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

const EN_URL = `${BASE_URL}/en`;

export const metadata: Metadata = {
  title: "Shareholder clubs and benefits",
  description:
    "Compare 65 shareholder clubs, their eligibility thresholds, benefits, enrolment conditions and official sources.",
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
      "A verified catalogue of shareholder clubs, eligibility thresholds and benefits.",
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
      "A verified catalogue of shareholder clubs, eligibility thresholds and benefits.",
    images: [SOCIAL_IMAGE_PATH],
  },
};

export default async function EnglishHomePage() {
  const translatedSlugs = getEnglishCompanySlugs();
  const companies = await prisma.company.findMany({
    where: { slug: { in: translatedSlugs } },
    include: { benefits: { orderBy: { id: "asc" } } },
    orderBy: { name: "asc" },
  });

  const translatedCompanies = companies.map((company) => {
    const translation = getEnglishCompanyTranslation(company.slug);
    if (!translation) {
      throw new Error(`Missing English translation for ${company.slug}`);
    }

    if (translation.benefits.length !== company.benefits.length) {
      throw new Error(
        `English benefit count mismatch for ${company.slug}: ${translation.benefits.length}/${company.benefits.length}`
      );
    }

    return {
      ...company,
      name: translation.name,
      sector: translation.sector,
      description: translation.description,
      benefits: company.benefits.map((benefit, index) => ({
        ...benefit,
        title: translation.benefits[index].title,
        description: translation.benefits[index].description,
        value: translation.benefits[index].value ?? benefit.value,
      })),
    };
  });

  const sectors = [
    ...new Set(translatedCompanies.map((company) => company.sector)),
  ].sort();
  const indexes = [
    ...new Set(translatedCompanies.map((company) => company.stockIndex)),
  ].sort();
  const totalBenefits = translatedCompanies.reduce(
    (total, company) => total + company.benefits.length,
    0
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${EN_URL}#catalogue`,
        url: EN_URL,
        name: "Shareholder clubs catalogue",
        description:
          "Verified catalogue of shareholder benefits, share thresholds and enrolment conditions.",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${EN_URL}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${EN_URL}#itemlist`,
        name: "Shareholder Clubs - Company catalogue",
        numberOfItems: translatedCompanies.length,
        itemListElement: translatedCompanies.map((company, index) => ({
          "@type": "ListItem",
          position: index + 1,
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-[var(--space-xl)] px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] sm:py-[var(--space-3xl)] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:px-[var(--space-xl)]">
          <div>
            <h1
              aria-label="SHAREHOLDER CLUBS"
              className="mb-[var(--space-lg)] font-[family-name:var(--font-display)] text-[42px] font-bold leading-[1] text-text-display sm:text-[48px] md:text-[72px]"
            >
              <ParticleDotoText lines={["SHAREHOLDER", "CLUBS"]} />
            </h1>
            <p className="max-w-2xl text-[16px] leading-[1.6] text-text-secondary sm:text-[18px]">
              Benefits reserved for individual shareholders of major global
              companies. One catalogue to compare thresholds, services, events
              and official enrolment routes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-[var(--space-sm)] border-t border-border-visible pt-[var(--space-lg)]">
            <Metric value={translatedCompanies.length} label="COMPANIES" />
            <Metric value={totalBenefits} label="BENEFITS" />
            <Metric value={sectors.length} label="SECTORS" />
          </div>
        </div>
      </section>

      <NewsletterCta
        variant="compact"
        placement="en_home_dashboard_top"
        locale="en"
      />

      <section
        id="catalogue"
        className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]"
      >
        <h2 className="sr-only">Shareholder clubs catalogue</h2>
        <Suspense
          fallback={
            <div className="h-40 animate-pulse border border-border bg-surface" />
          }
        >
          <CatalogueClient
            companies={translatedCompanies}
            sectors={sectors}
            indexes={indexes}
            locale="en"
          />
        </Suspense>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
          <div className="max-w-2xl">
            <p className="mb-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
              ABOUT
            </p>
            <h2 className="mb-[var(--space-md)] text-[24px] font-medium leading-[1.2] text-text-display">
              What is a shareholder club?
            </h2>
            <p className="text-[16px] leading-[1.6] text-text-secondary">
              Many listed companies offer individual shareholders dedicated
              programmes. Depending on the company, these may include product
              discounts, cultural visits, investor meetings, educational
              services or preferential access. Clubs Actionnaires brings the
              published conditions together in a comparable format.
            </p>
          </div>
        </div>
      </section>

      <section id="registration-guide" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
          <div className="max-w-3xl">
            <p className="mb-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
              PRACTICAL GUIDE
            </p>
            <h2 className="mb-[var(--space-lg)] text-[32px] font-medium leading-[1.1] text-text-display md:text-[40px]">
              How to access shareholder benefits
            </h2>
            <p className="mb-[var(--space-2xl)] text-[18px] leading-[1.6] text-text-secondary">
              The exact process varies by country, broker and company. These
              five steps explain the usual route; each company page then gives
              the documented threshold and official link.
            </p>
            <div className="space-y-[var(--space-xl)]">
              <GuideStep
                number="01"
                title="Open an eligible brokerage account"
                text="Use a broker that offers the shares you need and, where required, supports registered ownership or can issue a recent shareholding certificate."
              />
              <GuideStep
                number="02"
                title="Buy the required number of shares"
                text="Check the threshold shown on the company page before buying. Some programmes start at one share, while others require a higher holding."
              />
              <GuideStep
                number="03"
                title="Check the required holding method"
                text="Some clubs accept bearer shares. Others require administered or pure registered shares, a minimum holding period, or ownership on a specific record date."
              />
              <GuideStep
                number="04"
                title="Apply through the official shareholder service"
                text="Complete the company's form and provide the requested proof of ownership and identity. Always use the official link shown on the company page."
              />
              <GuideStep
                number="05"
                title="Recheck conditions before using a benefit"
                text="Availability, booking windows, prices and event capacity can change. The company's current terms remain the authoritative source."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0">
      <p
        aria-label={`${value}`}
        className="font-[family-name:var(--font-display)] text-[34px] font-bold leading-none text-text-display sm:text-[42px]"
      >
        <ParticleDotoText lines={[`${value}`]} />
      </p>
      <p className="mt-[var(--space-xs)] font-[family-name:var(--font-data)] text-[9px] tracking-[0.05em] text-text-disabled sm:text-[11px] sm:tracking-[0.08em]">
        {label}
      </p>
    </div>
  );
}

function GuideStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-l-2 border-accent pl-[var(--space-lg)]">
      <div className="mb-[var(--space-sm)] flex items-baseline gap-[var(--space-md)]">
        <span className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-none text-accent">
          {number}
        </span>
        <h3 className="text-[20px] font-medium leading-[1.2] text-text-display">
          {title}
        </h3>
      </div>
      <p className="text-[15px] leading-[1.7] text-text-secondary">{text}</p>
    </div>
  );
}
