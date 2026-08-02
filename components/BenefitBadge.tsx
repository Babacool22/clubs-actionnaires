const typeConfig: Record<string, { fr: string; en: string }> = {
  reduction: { fr: "REDUCTION", en: "DISCOUNT" },
  cadeau: { fr: "CADEAU", en: "GIFT" },
  evenement: { fr: "EVENEMENT", en: "EVENT" },
  service: { fr: "SERVICE", en: "SERVICE" },
  priorite: { fr: "PRIORITE", en: "PRIORITY" },
};

export default function BenefitBadge({
  type,
  locale = "fr",
}: {
  type: string;
  locale?: "fr" | "en";
}) {
  const label = typeConfig[type]?.[locale] ?? type.toUpperCase();

  return (
    <span className="inline-flex items-center px-[var(--space-sm)] py-[var(--space-2xs)] border border-border-visible font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-secondary">
      {label}
    </span>
  );
}
