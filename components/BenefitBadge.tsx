const typeConfig: Record<string, { label: string }> = {
  reduction: { label: "REDUCTION" },
  cadeau: { label: "CADEAU" },
  evenement: { label: "EVENEMENT" },
  service: { label: "SERVICE" },
  priorite: { label: "PRIORITE" },
};

export default function BenefitBadge({ type }: { type: string }) {
  const config = typeConfig[type] ?? { label: type.toUpperCase() };

  return (
    <span className="inline-flex items-center px-[var(--space-sm)] py-[var(--space-2xs)] border border-border-visible font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary">
      {config.label}
    </span>
  );
}
