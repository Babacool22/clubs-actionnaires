import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--black)] border-b border-border">
      <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="flex items-center justify-between h-14 gap-[var(--space-sm)]">
          <Link href="/" className="flex items-center gap-[var(--space-xs)] sm:gap-[var(--space-sm)] min-w-0">
            {/* Dot indicator */}
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span
              className="font-[family-name:var(--font-data)] text-[10px] sm:text-[13px] font-bold tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-display leading-tight"
            >
              <span className="sm:hidden">Clubs</span>
              <span className="hidden sm:inline">Clubs Actionnaires</span>
            </span>
          </Link>

          <nav className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-lg)]">
            <Link
              href="/#catalogue"
              className="min-h-11 inline-flex items-center font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              Catalogue
            </Link>
            <Link
              href="/#inscription"
              className="min-h-11 inline-flex items-center font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              <span className="sm:hidden">Guide</span>
              <span className="hidden sm:inline">S&apos;inscrire</span>
            </Link>
            <Link
              href="/#about"
              className="hidden sm:inline-flex min-h-11 items-center font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              A propos
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
