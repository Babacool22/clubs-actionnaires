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
    <section className="mb-[var(--space-3xl)] min-w-0 overflow-x-clip">
      <p className="break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)] [overflow-wrap:anywhere]">
        QUESTIONS FRÉQUENTES — {companyName.toUpperCase()}
      </p>
      <div className="border-t border-border">
        {items.map((it, i) => (
          <details
            key={i}
            className="group min-w-0 border-b border-border py-[var(--space-lg)] px-[var(--space-md)]"
            onToggle={(event) => {
              if (event.currentTarget.open) {
                track("Open FAQ", {
                  company: companyName,
                  question: it.question,
                });
              }
            }}
          >
            <summary className="flex min-w-0 items-start justify-between gap-[var(--space-lg)] cursor-pointer list-none">
              <h3 className="min-w-0 flex-1 break-words text-[16px] font-medium text-text-display [overflow-wrap:anywhere]">
                {it.question}
              </h3>
              <span className="shrink-0 font-[family-name:var(--font-data)] text-[13px] text-text-disabled group-open:rotate-45 transition-transform duration-[var(--duration-micro)]">
                +
              </span>
            </summary>
            <p className="break-words text-[14px] text-text-secondary leading-[1.5] mt-[var(--space-md)] [overflow-wrap:anywhere]">
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
