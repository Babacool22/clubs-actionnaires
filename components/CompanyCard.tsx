import BenefitBadge from "./BenefitBadge";
import CompanyLogo from "./CompanyLogo";
import { TrackedLink } from "./TrackedLink";
import type { Company, Benefit } from "@/app/generated/prisma/client";

type CompanyWithBenefits = Company & { benefits: Benefit[] };

export default function CompanyCard({
  company,
  catalogueReturnPath,
  locale = "fr",
}: {
  company: CompanyWithBenefits;
  catalogueReturnPath: string;
  locale?: "fr" | "en";
}) {
  const benefitTypes = [...new Set(company.benefits.map((benefit) => benefit.type))];
  const href =
    locale === "en"
      ? `/en/companies/${company.slug}`
      : `/entreprises/${company.slug}`;

  return (
    <TrackedLink
      href={href}
      eventName="Open Company"
      eventProperties={{
        company: company.slug,
        sector: company.sector,
        index: company.stockIndex,
        benefits: company.benefits.length,
      }}
      catalogueReturnPath={catalogueReturnPath}
      className="group block"
    >
      <div className="h-full border border-border bg-surface p-[var(--space-md)] transition-colors duration-[var(--duration-micro)] hover:border-border-visible sm:p-[var(--space-lg)]">
        <div className="mb-[var(--space-lg)] flex min-w-0 items-start justify-between gap-[var(--space-sm)]">
          {company.ticker && (
            <span className="min-w-0 break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled [overflow-wrap:anywhere]">
              {company.ticker}
            </span>
          )}
          <span className="shrink-0 border border-border-visible px-[var(--space-sm)] py-[var(--space-2xs)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary">
            {company.stockIndex}
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_5rem] items-start gap-[var(--space-md)]">
          <div className="min-w-0">
            <h3 className="mb-[var(--space-xs)] break-words font-[family-name:var(--font-body)] text-[24px] font-medium leading-[1.2] text-text-display transition-colors duration-[var(--duration-micro)] group-hover:text-text-primary [overflow-wrap:anywhere]">
              {company.name}
            </h3>
            <p className="mb-[var(--space-lg)] break-words text-[14px] text-text-secondary [overflow-wrap:anywhere]">
              {company.sector}
            </p>
          </div>
          <div className="catalogue-card-logo h-20 w-20 overflow-hidden">
            <CompanyLogo name={company.name} logoUrl={company.logoUrl} />
          </div>
        </div>

        <p className="mb-[var(--space-lg)] line-clamp-3 break-words text-[14px] leading-[1.6] text-text-disabled sm:line-clamp-2 [overflow-wrap:anywhere]">
          {company.description}
        </p>

        <div className="mb-[var(--space-md)] border-t border-border" />

        <div className="mb-[var(--space-md)] flex flex-wrap gap-[var(--space-xs)]">
          {benefitTypes.map((type) => (
            <BenefitBadge key={type} type={type} locale={locale} />
          ))}
        </div>

        <div className="flex min-w-0 items-end justify-between gap-[var(--space-sm)]">
          <span className="min-w-0 break-words font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled [overflow-wrap:anywhere]">
            {company.benefits.length}{" "}
            {locale === "en"
              ? `BENEFIT${company.benefits.length > 1 ? "S" : ""}`
              : `AVANTAGE${company.benefits.length > 1 ? "S" : ""}`}
            {company.minShares && (
              <span className="ml-[var(--space-sm)] text-text-secondary">
                {" / "}
                {company.minShares}{" "}
                {locale === "en"
                  ? `SHARE${company.minShares > 1 ? "S" : ""} MIN.`
                  : `ACTION${company.minShares > 1 ? "S" : ""} MIN.`}
              </span>
            )}
          </span>
          <span className="shrink-0 font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary transition-colors duration-[var(--duration-micro)] group-hover:text-text-display">
            DETAILS -&gt;
          </span>
        </div>
      </div>
    </TrackedLink>
  );
}
