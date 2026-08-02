type AnswerItem = {
  label: string;
  value: string;
  href?: string | null;
};

type GeoAnswerSummaryProps = {
  eyebrow: string;
  title: string;
  summary: string;
  items: AnswerItem[];
};

export default function GeoAnswerSummary({
  eyebrow,
  title,
  summary,
  items,
}: GeoAnswerSummaryProps) {
  const headingId = `quick-answer-${title
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <section
      aria-labelledby={headingId}
      className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)] border-y border-border"
    >
      <div className="py-[var(--space-lg)] sm:py-[var(--space-xl)]">
        <p className="mb-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="break-words text-[22px] sm:text-[26px] font-medium leading-[1.2] text-text-display [overflow-wrap:anywhere]"
        >
          {title}
        </h2>
        <p className="mt-[var(--space-sm)] max-w-3xl break-words text-[14px] sm:text-[15px] leading-[1.65] text-text-secondary [overflow-wrap:anywhere]">
          {summary}
        </p>
      </div>

      <dl className="border-t border-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid min-w-0 gap-[var(--space-xs)] border-b border-border py-[var(--space-md)] last:border-b-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-[var(--space-lg)]"
          >
            <dt className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled">
              {item.label}
            </dt>
            <dd className="min-w-0 break-words text-[14px] leading-[1.55] text-text-secondary [overflow-wrap:anywhere]">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-interactive transition-colors hover:text-text-display"
                >
                  {item.value} {"->"}
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
