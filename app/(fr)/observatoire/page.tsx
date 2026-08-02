import type { Metadata } from "next";
import Link from "next/link";
import {
  buildCatalogueReportSummary,
  getCatalogueReportCompanies,
} from "@/lib/catalogue-report";
import {
  BASE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  serializeJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${BASE_URL}/observatoire`;
const EN_PAGE_URL = `${BASE_URL}/en/shareholder-clubs-report`;
const DATA_URL = `${BASE_URL}/data/shareholder-clubs.csv`;
const PUBLISHED_AT = "2026-07-30";

export async function generateMetadata(): Promise<Metadata> {
  const companies = await getCatalogueReportCompanies();
  const summary = buildCatalogueReportSummary(companies);
  const title = `Observatoire 2026 : ${summary.companyCount} clubs actionnaires | ${SITE_NAME}`;
  const description = `Étude de ${summary.companyCount} entreprises et ${summary.benefitCount} avantages actionnaires : seuils, secteurs, méthode, données vérifiées et CSV à télécharger.`;

  return {
    title,
    description,
    alternates: {
      canonical: PAGE_URL,
      languages: {
        "fr-FR": PAGE_URL,
        "en-US": EN_PAGE_URL,
        "x-default": PAGE_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "article",
      publishedTime: PUBLISHED_AT,
      modifiedTime: summary.lastUpdated.toISOString(),
      images: [
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: "Observatoire des clubs actionnaires",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE_PATH],
    },
  };
}

export default async function ObservatoryPage() {
  const companies = await getCatalogueReportCompanies();
  const summary = buildCatalogueReportSummary(companies);
  const activeRate = Math.round(
    (summary.activeCompanyCount / summary.companyCount) * 100
  );
  const lastUpdatedLabel = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(summary.lastUpdated);
  const citation = `${SITE_NAME} (2026), Observatoire des clubs actionnaires, ${PAGE_URL}.`;
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${PAGE_URL}#dataset`,
    name: "Observatoire 2026 des clubs actionnaires",
    description: `Base vérifiée de ${summary.companyCount} grandes entreprises, ${summary.benefitCount} avantages actionnaires, seuils de détention, secteurs, indices boursiers et liens vers les sources officielles.`,
    url: PAGE_URL,
    identifier: PAGE_URL,
    inLanguage: ["fr-FR", "en-US"],
    isAccessibleForFree: true,
    datePublished: PUBLISHED_AT,
    dateModified: summary.lastUpdated.toISOString(),
    temporalCoverage: "2026",
    creator: {
      "@type": "Person",
      name: "Bastien Coulonnier",
      url: `${BASE_URL}/a-propos`,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    keywords: [
      "clubs actionnaires",
      "avantages actionnaires",
      "seuils de détention",
      "actionnaires individuels",
      "données financières",
    ],
    measurementTechnique:
      "Vérification manuelle des pages officielles de relations investisseurs et des règlements des clubs actionnaires.",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Entreprises analysées",
        value: summary.companyCount,
      },
      {
        "@type": "PropertyValue",
        name: "Avantages recensés",
        value: summary.benefitCount,
      },
      {
        "@type": "PropertyValue",
        name: "Secteurs représentés",
        value: summary.sectorCount,
      },
    ],
    distribution: {
      "@type": "DataDownload",
      contentUrl: DATA_URL,
      encodingFormat: "text/csv",
    },
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(datasetJsonLd) }}
      />

      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] lg:py-[var(--space-4xl)]">
          <p className="mb-[var(--space-lg)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
            DONNEES VERIFIEES · EDITION 2026
          </p>
          <h1 className="max-w-5xl font-[family-name:var(--font-display)] text-[42px] font-bold leading-[1.02] text-text-display sm:text-[56px] lg:text-[72px]">
            Observatoire des clubs actionnaires
          </h1>
          <p className="mt-[var(--space-xl)] max-w-3xl text-[17px] leading-[1.65] text-text-secondary sm:text-[19px]">
            Une photographie consolidée des programmes réservés aux actionnaires
            individuels, construite à partir des règlements et espaces
            investisseurs officiels des entreprises.
          </p>
          <p className="mt-[var(--space-md)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.05em] text-text-disabled">
            DERNIERE MISE A JOUR · {lastUpdatedLabel.toUpperCase()}
          </p>
        </div>
      </header>

      <section className="border-b border-border">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-[var(--space-md)] sm:px-[var(--space-lg)] lg:grid-cols-4 lg:px-[var(--space-xl)]">
          {[
            ["Entreprises analysées", summary.companyCount],
            ["Programmes avec avantages", summary.activeCompanyCount],
            ["Avantages recensés", summary.benefitCount],
            ["Secteurs représentés", summary.sectorCount],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-border px-[var(--space-md)] py-[var(--space-xl)] even:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"
            >
              <dt className="font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.08em] text-text-disabled">
                {label}
              </dt>
              <dd className="mt-[var(--space-sm)] font-[family-name:var(--font-display)] text-[36px] font-bold leading-none text-text-display sm:text-[48px]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <main className="mx-auto max-w-7xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
        <section className="grid gap-[var(--space-2xl)] border-b border-border pb-[var(--space-3xl)] lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              A RETENIR
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium leading-tight text-text-display">
              Des programmes accessibles, mais très inégaux
            </h2>
          </div>
          <div className="grid gap-[var(--space-xl)] sm:grid-cols-3">
            <div>
              <p className="text-[28px] font-medium text-text-display">
                {activeRate} %
              </p>
              <p className="mt-[var(--space-xs)] text-[14px] leading-relaxed text-text-secondary">
                des entreprises analysées publient au moins un avantage
                actionnaire identifiable.
              </p>
            </div>
            <div>
              <p className="text-[28px] font-medium text-text-display">
                {summary.oneShareCompanyCount}
              </p>
              <p className="mt-[var(--space-xs)] text-[14px] leading-relaxed text-text-secondary">
                programmes sont accessibles à partir d&apos;une seule action.
              </p>
            </div>
            <div>
              <p className="text-[28px] font-medium text-text-display">
                {summary.medianMinimumShares ?? "—"}
              </p>
              <p className="mt-[var(--space-xs)] text-[14px] leading-relaxed text-text-secondary">
                actions représentent le seuil médian parmi les programmes qui
                publient un minimum.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-[var(--space-3xl)]">
          <div className="mb-[var(--space-xl)] max-w-3xl">
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              REPARTITION
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium text-text-display">
              Les clubs actionnaires par secteur
            </h2>
          </div>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {[
                    "Secteur",
                    "Entreprises",
                    "Programmes actifs",
                    "Avantages",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.08em] text-text-disabled"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.sectors.map((sector) => (
                  <tr
                    key={sector.name}
                    className="border-b border-border last:border-b-0"
                  >
                    <th className="px-[var(--space-md)] py-[var(--space-md)] text-[14px] font-medium text-text-display">
                      {sector.name}
                    </th>
                    <td className="px-[var(--space-md)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] text-text-secondary">
                      {sector.companyCount}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] text-text-secondary">
                      {sector.activeCompanyCount}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] text-text-secondary">
                      {sector.benefitCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-[var(--space-2xl)] border-b border-border py-[var(--space-3xl)] lg:grid-cols-2">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              METHODOLOGIE
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium text-text-display">
              Une vérification entreprise par entreprise
            </h2>
          </div>
          <div className="space-y-[var(--space-md)] text-[15px] leading-[1.7] text-text-secondary">
            <p>
              Les pages de relations investisseurs, règlements de clubs,
              formulaires d&apos;adhésion et communications officielles sont
              prioritaires. Chaque fiche indique sa date de dernière
              vérification.
            </p>
            <p>
              Les droits communs à tous les actionnaires, les promotions clients
              et les avantages non confirmés ne sont pas comptés comme des
              avantages de club.
            </p>
            <p>
              Les conditions peuvent évoluer. La source officielle de
              l&apos;entreprise reste toujours la référence avant toute démarche.
            </p>
          </div>
        </section>

        <section className="grid gap-[var(--space-2xl)] py-[var(--space-3xl)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent">
              DONNEES ET CITATION
            </p>
            <h2 className="mt-[var(--space-md)] text-[30px] font-medium text-text-display">
              Télécharger et citer l&apos;observatoire
            </h2>
            <p className="mt-[var(--space-md)] max-w-2xl text-[15px] leading-[1.7] text-text-secondary">
              Le fichier CSV rassemble les entreprises, secteurs, indices,
              seuils, volumes d&apos;avantages, dates de vérification et URL des
              sources officielles.
            </p>
            <div className="mt-[var(--space-xl)] flex flex-wrap gap-[var(--space-md)]">
              <a
                href="/data/shareholder-clubs.csv"
                download
                className="border border-accent bg-accent px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-hover"
              >
                Télécharger le CSV
              </a>
              <Link
                href="/#catalogue"
                className="border border-border-visible px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] font-bold uppercase tracking-[0.06em] text-text-display transition-colors hover:border-text-secondary"
              >
                Explorer le catalogue
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-accent pl-[var(--space-lg)]">
            <p className="font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.08em] text-text-disabled">
              Citation recommandée
            </p>
            <p className="mt-[var(--space-md)] break-words text-[14px] leading-[1.7] text-text-secondary">
              {citation}
            </p>
            <p className="mt-[var(--space-lg)] text-[12px] leading-relaxed text-text-disabled">
              Données indicatives et non contractuelles. Les conditions
              officielles des entreprises prévalent.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
