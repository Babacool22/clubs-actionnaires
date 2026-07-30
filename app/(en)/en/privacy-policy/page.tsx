import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, SITE_NAME, SOCIAL_IMAGE_PATH } from "@/lib/seo";

const PAGE_URL = `${BASE_URL}/en/privacy-policy`;

export const metadata: Metadata = {
  title: `Privacy policy | ${SITE_NAME}`,
  description:
    "Privacy policy for Clubs Actionnaires: data processing, purposes, analytics, cookies and GDPR rights.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "fr-FR": `${BASE_URL}/politique-de-confidentialite`,
      "en-US": PAGE_URL,
      "x-default": `${BASE_URL}/politique-de-confidentialite`,
    },
  },
  openGraph: {
    title: `Privacy policy | ${SITE_NAME}`,
    description: "Personal data, cookies and user rights on Clubs Actionnaires.",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: SOCIAL_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-[var(--space-md)] py-[var(--space-2xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
      <p className="label mb-[var(--space-md)] text-text-disabled">
        <Link href="/en" className="transition-colors hover:text-text-display">
          Home
        </Link>
        <span className="mx-2">/</span>Privacy policy
      </p>
      <h1 className="mb-[var(--space-lg)] text-3xl font-bold tracking-tight text-text-display sm:text-4xl">
        Privacy policy
      </h1>

      <div className="space-y-[var(--space-xl)] text-[15px] leading-relaxed text-text-secondary">
        <PolicySection title="1. Data controller">
          <p>
            The data controller is Bastien COULONNIER, publisher of{" "}
            <strong className="text-text-primary">{SITE_NAME}</strong>. Contact:{" "}
            <a
              href="mailto:contact@clubsactionnaires.fr"
              className="text-interactive hover:underline"
            >
              contact@clubsactionnaires.fr
            </a>
            .
          </p>
        </PolicySection>
        <PolicySection title="2. Data processed">
          <p>
            The public website does not require a user account. Newsletter
            subscriptions process the email address submitted by the user.
            Technical navigation data, browser type, viewed pages, referrer and
            local display preferences may also be processed.
          </p>
          <p>
            Audience and performance measurements are provided by Vercel
            Analytics and Vercel Speed Insights.
          </p>
        </PolicySection>
        <PolicySection title="3. Purposes and legal bases">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Website operation, security and preference storage: legitimate
              interest.
            </li>
            <li>
              Audience and performance measurement: legitimate interest or
              consent, depending on the applicable configuration.
            </li>
            <li>
              Newsletter subscription and delivery: consent and performance of
              the requested service.
            </li>
          </ul>
        </PolicySection>
        <PolicySection title="4. Cookies and local storage">
          <p>
            The site may use strictly necessary cookies and Vercel audience
            measurement technologies. The light or dark theme preference is
            stored locally in the browser and is not used for advertising.
          </p>
          <p>
            You can restrict cookies in your browser. Some features may then
            work less effectively.
          </p>
        </PolicySection>
        <PolicySection title="5. Recipients and processors">
          <p>
            Technical data may be processed by Vercel Inc. for hosting,
            analytics and performance measurement, by infrastructure or DNS
            providers, and by beehiiv for newsletter subscriptions and delivery.
          </p>
          <p>
            Transfers outside the European Economic Area may occur under the
            safeguards provided by the relevant service provider, such as
            standard contractual clauses.
          </p>
        </PolicySection>
        <PolicySection title="6. Retention">
          <p>
            Technical logs and aggregated audience data are retained according
            to the provider&apos;s policy. Local theme preferences remain until
            removed in the browser. Newsletter subscription data is retained
            until unsubscription or a valid deletion request.
          </p>
        </PolicySection>
        <PolicySection title="7. Your GDPR rights">
          <p>
            Subject to legal conditions, you may request access, correction,
            deletion, restriction, objection or portability by contacting{" "}
            <a
              href="mailto:contact@clubsactionnaires.fr"
              className="text-interactive hover:underline"
            >
              contact@clubsactionnaires.fr
            </a>
            . You may also lodge a complaint with the French data protection
            authority, the CNIL, at{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive hover:underline"
            >
              www.cnil.fr
            </a>
            .
          </p>
        </PolicySection>
        <PolicySection title="8. Security">
          <p>
            Reasonable technical measures are used, including HTTPS and
            security headers. No information system can guarantee absolute
            security.
          </p>
        </PolicySection>
        <PolicySection title="9. Updates">
          <p>
            This policy may be updated. The version published online is the
            applicable version.
          </p>
        </PolicySection>
        <PolicySection title="10. Legal notice">
          <p>
            See also the{" "}
            <Link href="/en/legal-notice" className="text-interactive hover:underline">
              legal notice
            </Link>
            .
          </p>
        </PolicySection>
        <p className="border-t border-border pt-[var(--space-md)] text-[12px] text-text-disabled">
          Last updated: July 2026
        </p>
      </div>
    </div>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-[var(--space-sm)]">
      <h2 className="font-[family-name:var(--font-data)] text-[12px] uppercase tracking-[0.08em] text-text-display">
        {title}
      </h2>
      {children}
    </section>
  );
}
