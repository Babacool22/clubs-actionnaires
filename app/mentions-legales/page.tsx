import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Mentions légales | ${SITE_NAME}`,
  description:
    "Mentions légales du site Clubs Actionnaires : éditeur, hébergeur, propriété intellectuelle et responsabilité.",
  alternates: {
    canonical: `${BASE_URL}/mentions-legales`,
  },
  openGraph: {
    title: `Mentions légales | ${SITE_NAME}`,
    description:
      "Mentions légales du site Clubs Actionnaires : éditeur, hébergeur et conditions d'utilisation des informations.",
    url: `${BASE_URL}/mentions-legales`,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
      <p className="label text-text-disabled mb-[var(--space-md)]">
        <Link href="/" className="hover:text-text-display transition-colors">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        Mentions légales
      </p>

      <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-text-display font-bold tracking-tight mb-[var(--space-lg)]">
        Mentions légales
      </h1>

      <div className="space-y-[var(--space-xl)] text-[15px] leading-relaxed text-text-secondary">
        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            1. Éditeur du site
          </h2>
          <p>
            Le site <strong className="text-text-primary">{SITE_NAME}</strong>{" "}
            est accessible à l&apos;adresse{" "}
            <a
              href={BASE_URL}
              className="text-interactive hover:underline"
            >
              {BASE_URL}
            </a>
            .
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-text-primary">Éditeur :</strong>{" "}
              {/* TODO: remplace par ton nom complet ou ta raison sociale */}
              [NOM PRÉNOM / RAISON SOCIALE]
            </li>
            <li>
              <strong className="text-text-primary">Statut :</strong>{" "}
              Personne physique / particulier
              {/* ou : Auto-entrepreneur / SASU, etc. */}
            </li>
            <li>
              <strong className="text-text-primary">Email de contact :</strong>{" "}
              {/* TODO: mets un vrai email */}
              <a
                href="mailto:contact@clubsactionnaires.fr"
                className="text-interactive hover:underline"
              >
                contact@clubsactionnaires.fr
              </a>
            </li>
            <li>
              <strong className="text-text-primary">
                Directeur de la publication :
              </strong>{" "}
              [NOM PRÉNOM]
            </li>
          </ul>
          <p className="text-[13px] text-text-disabled">
            Remplace les champs entre crochets avant la mise en production.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            2. Hébergement
          </h2>
          <p>Le site est hébergé par :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-text-primary">Vercel Inc.</strong>
            </li>
            <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li>
              Site :{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-interactive hover:underline"
              >
                https://vercel.com
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            3. Objet du site
          </h2>
          <p>
            {SITE_NAME} est un site d&apos;information qui recense et présente,
            à titre purement informatif, les clubs et avantages destinés aux
            actionnaires individuels de grandes entreprises. Les contenus ne
            constituent ni un conseil en investissement, ni une offre de
            produits financiers, ni une recommandation d&apos;achat ou de vente
            d&apos;instruments financiers.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            4. Responsabilité
          </h2>
          <p>
            Les informations publiées sont fournies « en l&apos;état », sur la
            base de sources publiques et officielles lorsque cela est possible.
            Malgré le soin apporté à leur mise à jour, elles peuvent être
            incomplètes, obsolètes ou erronées.
          </p>
          <p>
            L&apos;éditeur ne saurait être tenu responsable des décisions
            prises sur la seule base des informations du site, ni des dommages
            directs ou indirects résultant de l&apos;accès au site ou de
            l&apos;utilisation de son contenu. Les conditions d&apos;accès aux
            clubs et avantages (seuils, tarifs, modalités d&apos;inscription,
            etc.) doivent toujours être vérifiées auprès de l&apos;entreprise
            concernée ou de son teneur de registre.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            5. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des éléments du site (textes, structure, design,
            logo, base de données de présentation) est protégé par le droit de
            la propriété intellectuelle. Toute reproduction, représentation ou
            exploitation non autorisée est interdite, sauf usage privé ou
            citation courte avec mention de la source.
          </p>
          <p>
            Les noms, marques et logos des entreprises citées restent la
            propriété de leurs titulaires respectifs. Leur mention n&apos;implique
            aucune affiliation ni partenariat, sauf indication contraire.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            6. Liens hypertextes
          </h2>
          <p>
            Le site peut contenir des liens vers des sites tiers (espaces
            actionnaires officiels, sources d&apos;information, etc.).
            L&apos;éditeur n&apos;exerce aucun contrôle sur ces sites et décline
            toute responsabilité quant à leur contenu ou leur disponibilité.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            7. Données personnelles
          </h2>
          <p>
            Pour toute information relative aux données personnelles et aux
            cookies, consultez la{" "}
            <Link
              href="/politique-de-confidentialite"
              className="text-interactive hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            8. Droit applicable
          </h2>
          <p>
            Les présentes mentions sont régies par le droit français. En cas de
            litige, et à défaut de résolution amiable, les tribunaux français
            seront seuls compétents.
          </p>
        </section>

        <p className="text-[12px] text-text-disabled pt-[var(--space-md)] border-t border-border">
          Dernière mise à jour : mars 2026
        </p>
      </div>
    </div>
  );
}
