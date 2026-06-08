"use client";

import { track } from "@vercel/analytics";

type FaqItem = { question: string; answer: string };

export default function Faq({
  items,
  companyName,
}: {
  items: FaqItem[];
  companyName: string;
}) {
  if (!items.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
  return (
    <section className="mb-[var(--space-3xl)]">
      <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)]">
        QUESTIONS FRÉQUENTES — {companyName.toUpperCase()}
      </p>
      <div className="border-t border-border">
        {items.map((it, i) => (
          <details
            key={i}
            className="group border-b border-border py-[var(--space-lg)] px-[var(--space-md)]"
            onToggle={(event) => {
              if (event.currentTarget.open) {
                track("Open FAQ", {
                  company: companyName,
                  question: it.question,
                });
              }
            }}
          >
            <summary className="flex items-start justify-between gap-[var(--space-lg)] cursor-pointer list-none">
              <h3 className="text-[16px] font-medium text-text-display flex-1">
                {it.question}
              </h3>
              <span className="font-[family-name:var(--font-data)] text-[13px] text-text-disabled group-open:rotate-45 transition-transform duration-[var(--duration-micro)]">
                +
              </span>
            </summary>
            <p className="text-[14px] text-text-secondary leading-[1.5] mt-[var(--space-md)]">
              {it.answer}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
