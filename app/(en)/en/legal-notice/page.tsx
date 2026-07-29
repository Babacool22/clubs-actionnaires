import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, SITE_NAME, SOCIAL_IMAGE_PATH } from "@/lib/seo";

const PAGE_URL = `${BASE_URL}/en/legal-notice`;

export const metadata: Metadata = {
  title: `Legal notice | ${SITE_NAME}`,
  description:
    "Legal notice for Clubs Actionnaires: publisher, hosting, intellectual property and liability.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "fr-FR": `${BASE_URL}/mentions-legales`,
      "en-US": PAGE_URL,
    },
  },
  openGraph: {
    title: `Legal notice | ${SITE_NAME}`,
    description: "Publisher, hosting and terms governing the site's information.",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: SOCIAL_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

const sections = [
  {
    title: "1. Website publisher",
    content: (
      <>
        <p>
          The <strong className="text-text-primary">{SITE_NAME}</strong> website
          is available at{" "}
          <a href={BASE_URL} className="text-interactive hover:underline">
            {BASE_URL}
          </a>
          .
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Publisher: Bastien COULONNIER</li>
          <li>Status: private individual</li>
          <li>
            Contact:{" "}
            <a
              href="mailto:contact@clubsactionnaires.fr"
              className="text-interactive hover:underline"
            >
              contact@clubsactionnaires.fr
            </a>
          </li>
          <li>Publication director: Bastien COULONNIER</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Hosting",
    content: (
      <>
        <p>The website is hosted by Vercel Inc.</p>
        <p>440 N Barranca Ave #4133, Covina, CA 91723, United States.</p>
        <p>
          Website:{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-interactive hover:underline"
          >
            https://vercel.com
          </a>
        </p>
      </>
    ),
  },
  {
    title: "3. Purpose of the website",
    content: (
      <p>
        {SITE_NAME} is an information website that lists and presents
        shareholder clubs and benefits for individual shareholders. Its
        content is not investment advice, a financial product offer, or a
        recommendation to buy or sell financial instruments.
      </p>
    ),
  },
  {
    title: "4. Liability",
    content: (
      <>
        <p>
          Information is provided as is, using public and official sources
          whenever possible. Despite reasonable care, it may be incomplete,
          outdated or inaccurate.
        </p>
        <p>
          The publisher cannot be held liable for decisions made solely from
          this website or for direct or indirect loss arising from access to or
          use of its content. Always verify thresholds, prices and enrolment
          conditions with the relevant company or register keeper.
        </p>
      </>
    ),
  },
  {
    title: "5. Intellectual property",
    content: (
      <>
        <p>
          The website&apos;s texts, structure, design and presentation database
          are protected by intellectual property law. Unauthorised reproduction
          or exploitation is prohibited, except for private use or short
          quotations that identify the source.
        </p>
        <p>
          Company names, brands and logos remain the property of their
          respective owners. Their inclusion does not imply affiliation or
          partnership.
        </p>
      </>
    ),
  },
  {
    title: "6. External links",
    content: (
      <p>
        The website links to third-party services and official shareholder
        areas. The publisher does not control those websites and is not
        responsible for their content or availability.
      </p>
    ),
  },
  {
    title: "7. Personal data",
    content: (
      <p>
        See the{" "}
        <Link href="/en/privacy-policy" className="text-interactive hover:underline">
          privacy policy
        </Link>{" "}
        for information about personal data and cookies.
      </p>
    ),
  },
  {
    title: "8. Governing law",
    content: (
      <p>
        This legal notice is governed by French law. If an amicable resolution
        cannot be reached, French courts have jurisdiction.
      </p>
    ),
  },
];

export default function LegalNoticePage() {
  return (
    <LegalPage title="Legal notice" current="Legal notice">
      {sections.map((section) => (
        <section key={section.title} className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] uppercase tracking-[0.08em] text-text-display">
            {section.title}
          </h2>
          {section.content}
        </section>
      ))}
      <p className="border-t border-border pt-[var(--space-md)] text-[12px] text-text-disabled">
        Last updated: March 2026
      </p>
    </LegalPage>
  );
}

function LegalPage({
  title,
  current,
  children,
}: {
  title: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
      <p className="label mb-[var(--space-md)] text-text-disabled">
        <Link href="/en" className="transition-colors hover:text-text-display">
          Home
        </Link>
        <span className="mx-2">/</span>
        {current}
      </p>
      <h1 className="mb-[var(--space-lg)] text-3xl font-bold tracking-tight text-text-display sm:text-4xl">
        {title}
      </h1>
      <div className="space-y-[var(--space-xl)] text-[15px] leading-relaxed text-text-secondary">
        {children}
      </div>
    </div>
  );
}
