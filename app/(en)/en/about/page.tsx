import type { Metadata } from "next";
import Link from "next/link";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${BASE_URL}/en/about`;

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    "Learn about the mission, verification method and editorial independence of Clubs Actionnaires.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "fr-FR": `${BASE_URL}/a-propos`,
      "en-US": PAGE_URL,
      "x-default": `${BASE_URL}/a-propos`,
    },
  },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      "Mission, verification method, editorial independence and corrections policy.",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: SOCIAL_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}#webpage`,
    name: `About ${SITE_NAME}`,
    url: PAGE_URL,
    inLanguage: "en-US",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
  };

  return (
    <div className="mx-auto max-w-3xl px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <p className="label mb-[var(--space-md)] text-text-disabled">
        <Link href="/en" className="transition-colors hover:text-text-display">
          Home
        </Link>
        <span className="mx-2">/</span>About
      </p>
      <h1 className="mb-[var(--space-xl)] font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5rem)] font-bold leading-none text-text-display">
        OUR MISSION
      </h1>

      <div className="space-y-[var(--space-xl)] text-[16px] leading-relaxed text-text-secondary">
        <Section title="Make shareholder benefits easier to understand">
          <p>
            {SITE_NAME} is an independent catalogue of programmes, services and
            benefits offered to individual shareholders. The project is edited
            by Bastien Coulonnier.
          </p>
          <p>
            The information is often scattered across regulations, application
            forms, investor areas and financial documents. The site brings it
            together in a comparable format and does not provide investment
            advice.
          </p>
        </Section>
        <Section title="Verification method">
          <ul className="list-disc space-y-[var(--space-xs)] pl-5">
            <li>Official company pages, rules and publications are prioritised.</li>
            <li>
              Active benefits are distinguished from statutory rights and
              historical or expired offers.
            </li>
            <li>
              Every company page displays its sources and last verification date.
            </li>
            <li>
              Cautious wording is used whenever a condition is unpublished or
              still needs confirmation.
            </li>
          </ul>
        </Section>
        <Section title="Independence and corrections">
          <p>
            Company names, brands and logos belong to their respective owners.
            Their presence does not imply any affiliation. Conditions can
            change, so the company&apos;s official source remains authoritative
            before any application or booking.
          </p>
          <p>
            To report outdated information or suggest a correction, email{" "}
            <a
              href="mailto:contact@clubsactionnaires.fr"
              className="text-interactive hover:underline"
            >
              contact@clubsactionnaires.fr
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-[var(--space-sm)]">
      <h2 className="text-2xl font-medium text-text-display">{title}</h2>
      {children}
    </section>
  );
}
