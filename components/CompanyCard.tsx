import BenefitBadge from "./BenefitBadge";
import { TrackedLink } from "./TrackedLink";
import type { Company, Benefit } from "@/app/generated/prisma/client";

type CompanyWithBenefits = Company & { benefits: Benefit[] };

export default function CompanyCard({
  company,
  catalogueReturnPath,
}: {
  company: CompanyWithBenefits;
  catalogueReturnPath: string;
}) {
  const benefitTypes = [...new Set(company.benefits.map((b) => b.type))];

  return (
    <TrackedLink
      href={`/entreprises/${company.slug}`}
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
      <div className="bg-surface border border-border p-[var(--space-md)] sm:p-[var(--space-lg)] h-full hover:border-border-visible transition-colors duration-[var(--duration-micro)]">
        {/* Top row: ticker + index */}
        <div className="flex items-start justify-between mb-[var(--space-lg)]">
          {company.ticker && (
            <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
              {company.ticker}
            </span>
          )}
          <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary border border-border-visible px-[var(--space-sm)] py-[var(--space-2xs)]">
            {company.stockIndex}
          </span>
        </div>

        {/* Company name — primary layer */}
        <h3 className="font-[family-name:var(--font-body)] text-[24px] font-medium text-text-display leading-[1.2] tracking-[-0.01em] mb-[var(--space-xs)] group-hover:text-text-primary transition-colors duration-[var(--duration-micro)]">
          {company.name}
        </h3>

        {/* Sector — secondary layer */}
        <p className="text-[14px] text-text-secondary mb-[var(--space-lg)]">
          {company.sector}
        </p>

        {/* Description — tertiary */}
        <p className="text-[14px] text-text-disabled leading-[1.6] line-clamp-3 sm:line-clamp-2 mb-[var(--space-lg)]">
          {company.description}
        </p>

        {/* Divider */}
        <div className="border-t border-border mb-[var(--space-md)]" />

        {/* Benefits tags */}
        <div className="flex flex-wrap gap-[var(--space-xs)] mb-[var(--space-md)]">
          {benefitTypes.map((type) => (
            <BenefitBadge key={type} type={type} />
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-[var(--space-sm)]">
          <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
            {company.benefits.length} AVANTAGE{company.benefits.length > 1 ? "S" : ""}
            {company.minShares && (
              <span className="ml-[var(--space-sm)] text-text-secondary">
                · {company.minShares} ACTION{company.minShares > 1 ? "S" : ""} MIN.
              </span>
            )}
          </span>
          <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary group-hover:text-text-display transition-colors duration-[var(--duration-micro)]">
            DETAILS →
          </span>
        </div>
      </div>
    </TrackedLink>
  );
}
