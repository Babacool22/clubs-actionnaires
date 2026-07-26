import type { Metadata } from "next";
import Link from "next/link";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `À propos | ${SITE_NAME}`,
  description:
    "Découvrez la mission, la méthode de vérification et l'éditeur de Clubs Actionnaires.",
  alternates: { canonical: `${BASE_URL}/a-propos` },
  openGraph: {
    title: `À propos | ${SITE_NAME}`,
    description:
      "Mission, méthode de vérification, indépendance éditoriale et politique de correction.",
    url: `${BASE_URL}/a-propos`,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Clubs Actionnaires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `À propos | ${SITE_NAME}`,
    description:
      "Mission, méthode de vérification, indépendance éditoriale et politique de correction.",
    images: [SOCIAL_IMAGE_PATH],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/a-propos#webpage`,
    name: `À propos de ${SITE_NAME}`,
    url: `${BASE_URL}/a-propos`,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    mainEntity: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      founder: {
        "@type": "Person",
        name: "Bastien Coulonnier",
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <p className="label text-text-disabled mb-[var(--space-md)]">
        <Link href="/" className="hover:text-text-display transition-colors">
          Accueil
        </Link>
        <span className="mx-2">/</span>À propos
      </p>

      <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5rem)] font-bold leading-none text-text-display mb-[var(--space-xl)]">
        NOTRE MISSION
      </h1>

      <div className="space-y-[var(--space-xl)] text-[16px] leading-relaxed text-text-secondary">
        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-body)] text-2xl font-medium text-text-display">
            Rendre les avantages actionnaires lisibles
          </h2>
          <p>
            {SITE_NAME} est un catalogue indépendant consacré aux programmes,
            services et avantages proposés aux actionnaires individuels. Le
            projet est édité par Bastien Coulonnier.
          </p>
          <p>
            Les informations sont dispersées entre règlements, formulaires,
            espaces investisseurs et documents financiers. Le site les rassemble
            dans un format comparable, sans constituer un conseil en
            investissement.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-body)] text-2xl font-medium text-text-display">
            Méthode de vérification
          </h2>
          <ul className="list-disc pl-5 space-y-[var(--space-xs)]">
            <li>
              Priorité aux pages officielles, règlements et publications des
              entreprises.
            </li>
            <li>
              Distinction entre avantage actif, droit statutaire et offre
              historique ou expirée.
            </li>
            <li>
              Affichage des sources et d&apos;une date de dernière vérification
              pour chaque dossier.
            </li>
            <li>
              Formulation prudente lorsqu&apos;une condition n&apos;est pas
              publiée ou reste à confirmer.
            </li>
          </ul>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-body)] text-2xl font-medium text-text-display">
            Indépendance et corrections
          </h2>
          <p>
            Les marques et logos appartiennent à leurs titulaires. Leur présence
            n&apos;implique aucune affiliation. Les conditions peuvent évoluer;
            la source officielle de l&apos;entreprise reste toujours la
            référence avant toute démarche.
          </p>
          <p>
            Pour signaler une information obsolète ou proposer une correction,
            écrivez à{" "}
            <a
              href="mailto:contact@clubsactionnaires.fr"
              className="text-interactive hover:underline"
            >
              contact@clubsactionnaires.fr
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
