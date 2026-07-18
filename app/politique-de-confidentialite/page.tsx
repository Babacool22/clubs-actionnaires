import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Politique de confidentialité | ${SITE_NAME}`,
  description:
    "Politique de confidentialité de Clubs Actionnaires : données collectées, finalités, cookies, analytics et vos droits RGPD.",
  alternates: {
    canonical: `${BASE_URL}/politique-de-confidentialite`,
  },
  openGraph: {
    title: `Politique de confidentialité | ${SITE_NAME}`,
    description:
      "Données personnelles, cookies et droits des utilisateurs sur Clubs Actionnaires.",
    url: `${BASE_URL}/politique-de-confidentialite`,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]">
      <p className="label text-text-disabled mb-[var(--space-md)]">
        <Link href="/" className="hover:text-text-display transition-colors">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        Politique de confidentialité
      </p>

      <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-text-display font-bold tracking-tight mb-[var(--space-lg)]">
        Politique de confidentialité
      </h1>

      <div className="space-y-[var(--space-xl)] text-[15px] leading-relaxed text-text-secondary">
        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            1. Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données est l&apos;éditeur du site{" "}
            <strong className="text-text-primary">{SITE_NAME}</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-text-primary">Identité :</strong>{" "}
              [NOM PRÉNOM]
            </li>
            <li>
              <strong className="text-text-primary">Contact :</strong>{" "}
              <a
                href="mailto:contact@clubsactionnaires.fr"
                className="text-interactive hover:underline"
              >
                contact@clubsactionnaires.fr
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            2. Données collectées
          </h2>
          <p>
            Le site ne propose pas de compte utilisateur ni de formulaire de
            collecte de données personnelles nominatives (nom, adresse, etc.).
          </p>
          <p>Peuvent toutefois être traités automatiquement :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              données de navigation techniques (adresse IP tronquée/anonymisée
              selon le prestataire, type de navigateur, pages consultées,
              durée de visite, référent) ;
            </li>
            <li>
              préférences locales stockées sur votre appareil (ex. thème clair /
              sombre via <code className="text-text-primary">localStorage</code>
              ) ;
            </li>
            <li>
              mesures d&apos;audience et de performance via les services Vercel
              Analytics et Vercel Speed Insights.
            </li>
          </ul>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            3. Finalités et bases légales
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-text-primary">
                Fonctionnement du site
              </strong>{" "}
              (intérêt légitime) : affichage des pages, mémorisation du thème,
              sécurité, prévention des abus.
            </li>
            <li>
              <strong className="text-text-primary">
                Mesure d&apos;audience et performance
              </strong>{" "}
              (intérêt légitime / consentement selon configuration) :
              comprendre l&apos;usage du site et améliorer l&apos;expérience
              (Vercel Analytics, Speed Insights).
            </li>
          </ul>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            4. Cookies et traceurs
          </h2>
          <p>
            Le site peut déposer des cookies ou utiliseurs technologies
            similaires strictement nécessaires au fonctionnement, ainsi que des
            outils de mesure d&apos;audience fournis par Vercel.
          </p>
          <p>
            La préférence de thème est stockée localement dans votre navigateur
            (<code className="text-text-primary">localStorage</code>) et n&apos;est
            pas transmise à un serveur tiers à des fins publicitaires.
          </p>
          <p>
            Vous pouvez configurer votre navigateur pour refuser tout ou partie
            des cookies. Certaines fonctionnalités peuvent alors être dégradées.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            5. Destinataires et sous-traitants
          </h2>
          <p>Les données techniques peuvent être traitées par :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-text-primary">Vercel Inc.</strong>{" "}
              (hébergement, Analytics, Speed Insights) — États-Unis / UE selon
              configuration ;
            </li>
            <li>
              le cas échéant, des prestataires d&apos;infrastructure ou de
              résolution DNS.
            </li>
          </ul>
          <p>
            Ces prestataires agissent en qualité de sous-traitants ou de
            responsables conjoints selon leurs conditions. Des transferts hors
            UE peuvent avoir lieu ; ils s&apos;appuient alors sur des garanties
            appropriées (clauses contractuelles types, etc.) prévues par le
            prestataire.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            6. Durées de conservation
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              logs et métriques d&apos;audience : selon la politique de
              rétention de Vercel (généralement courte durée, agrégée) ;
            </li>
            <li>
              préférence de thème : jusqu&apos;à suppression manuelle dans le
              navigateur.
            </li>
          </ul>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            7. Vos droits (RGPD)
          </h2>
          <p>
            Conformément au Règlement général sur la protection des données
            (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un
            droit d&apos;accès, de rectification, d&apos;effacement, de
            limitation, d&apos;opposition et de portabilité, dans les conditions
            prévues par la loi.
          </p>
          <p>
            Pour exercer vos droits :{" "}
            <a
              href="mailto:contact@clubsactionnaires.fr"
              className="text-interactive hover:underline"
            >
              contact@clubsactionnaires.fr
            </a>
            .
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la CNIL
            (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive hover:underline"
            >
              www.cnil.fr
            </a>
            ).
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            8. Sécurité
          </h2>
          <p>
            Des mesures techniques raisonnables sont mises en œuvre (HTTPS,
            en-têtes de sécurité, limitation de surface d&apos;attaque). Aucun
            système n&apos;étant infaillible, une sécurité absolue ne peut être
            garantie.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            9. Modifications
          </h2>
          <p>
            Cette politique peut être mise à jour à tout moment. La date de
            dernière mise à jour figure ci-dessous. La version en ligne fait
            foi.
          </p>
        </section>

        <section className="space-y-[var(--space-sm)]">
          <h2 className="font-[family-name:var(--font-data)] text-[12px] tracking-[0.08em] uppercase text-text-display">
            10. Mentions légales
          </h2>
          <p>
            Voir également les{" "}
            <Link
              href="/mentions-legales"
              className="text-interactive hover:underline"
            >
              mentions légales
            </Link>
            .
          </p>
        </section>

        <p className="text-[12px] text-text-disabled pt-[var(--space-md)] border-t border-border">
          Dernière mise à jour : mars 2026
        </p>
      </div>
    </div>
  );
}
