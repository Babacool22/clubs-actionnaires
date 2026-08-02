import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SOCIAL_IMAGE_PATH } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page does not exist. Return to the shareholder clubs catalogue.",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
  openGraph: {
    title: `Page not found | ${SITE_NAME}`,
    description: "Return to the shareholder clubs catalogue.",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: SOCIAL_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-[var(--space-md)] py-[var(--space-4xl)] text-center">
      <p className="label mb-[var(--space-lg)] text-accent">ERROR 404</p>
      <h1 className="mb-[var(--space-lg)] font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6rem)] font-bold leading-none text-text-display">
        PAGE NOT FOUND
      </h1>
      <p className="mb-[var(--space-xl)] max-w-lg text-[17px] leading-relaxed text-text-secondary">
        The requested page may have moved or been removed. The complete
        shareholder clubs catalogue is still available from the English home
        page.
      </p>
      <div className="flex flex-wrap justify-center gap-[var(--space-sm)]">
        <Link
          href="/en"
          className="inline-flex min-h-11 items-center border border-accent bg-accent px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-white transition-opacity hover:opacity-90"
        >
          BACK TO HOME
        </Link>
        <Link
          href="/en#catalogue"
          className="inline-flex min-h-11 items-center border border-border-visible px-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-primary transition-colors hover:bg-surface"
        >
          VIEW CATALOGUE
        </Link>
      </div>
    </div>
  );
}
