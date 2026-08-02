import type { Metadata } from "next";
import Link from "next/link";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${BASE_URL}/en/faq`;

const faqs = [
  {
    question: "What is a shareholder club?",
    answer:
      "A shareholder club is a programme offered by a company to its individual shareholders. Depending on the company, it may provide dedicated information, visits, events, services or preferential rates.",
  },
  {
    question: "How many shares do I need to hold?",
    answer:
      "The threshold depends on the company. One share is sometimes enough, while other programmes require dozens or hundreds of shares. Each company page shows the published threshold and its source.",
  },
  {
    question: "How do I join a shareholder club?",
    answer:
      "Applications are usually completed on the company's official website or through its shareholder relations service. A form, recent proof of ownership and sometimes proof of identity may be required.",
  },
  {
    question: "Do the shares need to be registered?",
    answer:
      "Not always. Some clubs accept bearer shares, while others reserve all or part of their services for pure or administered registered shareholders. Check the rule for each company.",
  },
  {
    question: "Is membership free?",
    answer:
      "Many clubs do not charge a membership fee, but buying, holding or transferring shares into registered form may involve costs. Free membership should not be assumed beyond the published terms.",
  },
  {
    question: "How often is the information verified?",
    answer:
      "Each company page displays a last verification date based on its sources. Conditions can change without notice, so the company's official website should always be checked before applying or booking.",
  },
];

export const metadata: Metadata = {
  title: `Shareholder clubs FAQ | ${SITE_NAME}`,
  description:
    "Answers about shareholder clubs, share thresholds, enrolment, registered ownership and proof of shareholding.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "fr-FR": `${BASE_URL}/faq`,
      "en-US": PAGE_URL,
      "x-default": `${BASE_URL}/faq`,
    },
  },
  openGraph: {
    title: `Shareholder clubs FAQ | ${SITE_NAME}`,
    description:
      "Understand shareholder clubs, their conditions and how they work.",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: SOCIAL_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    inLanguage: "en-US",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
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
        <span className="mx-2">/</span>FAQ
      </p>
      <h1 className="mb-[var(--space-xl)] font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5rem)] font-bold leading-none text-text-display">
        FREQUENTLY ASKED QUESTIONS
      </h1>
      <div className="border-t border-border">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group border-b border-border px-[var(--space-md)] py-[var(--space-lg)]"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-[var(--space-lg)]">
              <h2 className="text-[18px] font-medium leading-snug text-text-display">
                {faq.question}
              </h2>
              <span className="shrink-0 font-[family-name:var(--font-data)] text-[16px] text-text-disabled transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-[var(--space-md)] max-w-2xl text-[15px] leading-relaxed text-text-secondary">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
