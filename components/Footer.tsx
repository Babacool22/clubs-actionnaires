export default function Footer() {
  return (
    <footer className="border-t border-border mt-[var(--space-4xl)]">
      <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-[var(--space-xl)]">
          <div>
            <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
              <div className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-display font-bold">
                Clubs Actionnaires
              </span>
            </div>
            <p className="text-[14px] text-text-secondary leading-relaxed max-w-sm">
              Catalogue des avantages actionnaires des plus grandes entreprises mondiales.
            </p>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-disabled">
              Informations indicatives
            </p>
            <p className="text-[12px] text-text-disabled mt-[var(--space-xs)] max-w-xs">
              Verifiez les conditions directement aupres des entreprises.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
