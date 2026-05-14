import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--black)] border-b border-border">
      <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-[var(--space-sm)]">
            {/* Dot indicator */}
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span
              className="font-[family-name:var(--font-data)] text-[13px] font-bold tracking-[0.08em] uppercase text-text-display"
            >
              Clubs Actionnaires
            </span>
          </Link>

          <nav className="flex items-center gap-[var(--space-lg)]">
            <Link
              href="/#catalogue"
              className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              Catalogue
            </Link>
            <Link
              href="/#inscription"
              className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
            >
              S&apos;inscrire
            </Link>
            <Link
              href="/#about"
              className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
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
