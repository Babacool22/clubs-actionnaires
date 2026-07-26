import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SOCIAL_IMAGE_PATH } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page introuvable",
  description:
    "Cette page n'existe pas. Retrouvez le catalogue des clubs actionnaires et leurs avantages.",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
  openGraph: {
    title: `Page introuvable | ${SITE_NAME}`,
    description:
      "Cette page n'existe pas. Retrouvez le catalogue des clubs actionnaires.",
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Page introuvable | ${SITE_NAME}`,
    description:
      "Cette page n'existe pas. Retrouvez le catalogue des clubs actionnaires.",
    images: [SOCIAL_IMAGE_PATH],
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-[var(--space-md)] py-[var(--space-4xl)] text-center">
      <p className="label text-accent mb-[var(--space-lg)]">ERREUR 404</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6rem)] font-bold leading-none text-text-display mb-[var(--space-lg)]">
        PAGE INTROUVABLE
      </h1>
      <p className="max-w-lg text-[17px] text-text-secondary leading-relaxed mb-[var(--space-xl)]">
        La page demand&eacute;e a peut-&ecirc;tre &eacute;t&eacute;
        d&eacute;plac&eacute;e ou supprim&eacute;e. Le catalogue complet reste
        accessible depuis l&apos;accueil.
      </p>
      <div className="flex flex-wrap justify-center gap-[var(--space-sm)]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center border border-accent bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-white hover:opacity-90 transition-opacity"
        >
          RETOUR &Agrave; L&apos;ACCUEIL
        </Link>
        <Link
          href="/#catalogue"
          className="inline-flex min-h-11 items-center border border-border-visible px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-primary hover:bg-surface transition-colors"
        >
          VOIR LE CATALOGUE
        </Link>
      </div>
    </div>
  );
}
