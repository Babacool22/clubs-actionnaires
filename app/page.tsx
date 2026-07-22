import { prisma } from "@/lib/prisma";
import CatalogueClient from "@/components/CatalogueClient";
import HeroVideo from "@/components/HeroVideo";
import NewsletterCta from "@/components/NewsletterCta";
import { BASE_URL, SITE_NAME } from "@/lib/seo";
import { Suspense } from "react";

export default async function HomePage() {
  const companies = await prisma.company.findMany({
    include: { benefits: true },
    orderBy: { name: "asc" },
  });

  const sectors = [...new Set(companies.map((c) => c.sector))].sort();
  const indexes = [...new Set(companies.map((c) => c.stockIndex))].sort();

  const totalBenefits = companies.reduce((acc, c) => acc + c.benefits.length, 0);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/#catalogue`,
        url: BASE_URL,
        name: "Catalogue des clubs actionnaires",
        description:
          "Catalogue vérifié des avantages actionnaires, seuils d'actions et conditions d'inscription.",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "fr-FR",
        mainEntity: { "@id": `${BASE_URL}/#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${BASE_URL}/#itemlist`,
        name: "Clubs actionnaires – Catalogue des entreprises",
        description:
          "Liste des clubs d'actionnaires avec leurs avantages exclusifs",
        numberOfItems: companies.length,
        itemListElement: companies.map((company, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `Club Actionnaires ${company.name}`,
          url: `${BASE_URL}/entreprises/${company.slug}`,
        })),
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: SITE_NAME,
        url: BASE_URL,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero — Nothing style: asymmetric, display type, data-driven */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)] sm:py-[var(--space-3xl)] md:py-[var(--space-4xl)] grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-xl)] sm:gap-[var(--space-2xl)] items-center">
          <div>
            {/* Primary layer — Display typography */}
            <h1
              aria-label="CLUBS ACTIONNAIRES"
              className="font-[family-name:var(--font-display)] text-[42px] sm:text-[48px] md:text-[72px] font-bold text-text-display leading-[1.0] tracking-[-0.03em] mb-[var(--space-lg)]"
            >
              CLUBS
              <br />
              ACTIONNAIRES
            </h1>

            {/* Secondary layer */}
            <p className="text-[16px] sm:text-[18px] text-text-secondary leading-[1.6] max-w-lg mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
              Tous les avantages réservés aux actionnaires des plus grandes entreprises mondiales. Un catalogue pour tout comparer.
            </p>

            {/* Data metrics — tertiary layer */}
            <div className="grid grid-cols-3 gap-[var(--space-sm)] sm:flex sm:items-end sm:gap-[var(--space-2xl)]">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-[34px] sm:text-[48px] font-bold text-text-display leading-none">
                  {companies.length}
                </p>
                <p className="font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
                  ENTREPRISES
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border-visible" />
              <div className="min-w-0 border-l border-border-visible pl-[var(--space-sm)] sm:border-0 sm:pl-0">
                <p className="font-[family-name:var(--font-display)] text-[34px] sm:text-[48px] font-bold text-text-display leading-none">
                  {totalBenefits}
                </p>
                <p className="font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
                  AVANTAGES
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border-visible" />
              <div className="min-w-0 border-l border-border-visible pl-[var(--space-sm)] sm:border-0 sm:pl-0">
                <p className="font-[family-name:var(--font-display)] text-[34px] sm:text-[48px] font-bold text-text-display leading-none">
                  {sectors.length}
                </p>
                <p className="font-[family-name:var(--font-data)] text-[9px] sm:text-[11px] tracking-[0.05em] sm:tracking-[0.08em] text-text-disabled mt-[var(--space-xs)]">
                  SECTEURS
                </p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <HeroVideo />
          </div>
        </div>
      </section>

      <NewsletterCta variant="compact" placement="home_dashboard_top" />

      {/* Catalogue */}
      <section
        id="catalogue"
        className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-2xl)]"
      >
        <h2 className="sr-only">Catalogue des clubs actionnaires</h2>
        <Suspense
          fallback={
            <div className="h-40 border border-border bg-surface animate-pulse" />
          }
        >
          <CatalogueClient
            companies={companies}
            sectors={sectors}
            indexes={indexes}
          />
        </Suspense>
      </section>

      {/* About — minimal, text-only */}
      <section id="about" className="border-t border-border">
        <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-3xl)]">
          <div className="max-w-2xl">
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-lg)]">
              A PROPOS
            </p>
            <h2 className="font-[family-name:var(--font-body)] text-[24px] font-medium text-text-display leading-[1.2] tracking-[-0.01em] mb-[var(--space-md)]">
              Qu&apos;est-ce qu&apos;un club d&apos;actionnaires ?
            </h2>
            <p className="text-[16px] text-text-secondary leading-[1.6]">
              De nombreuses grandes entreprises mondiales proposent à leurs
              actionnaires individuels de rejoindre un club d&apos;actionnaires.
              Ces programmes offrent des avantages exclusifs : réductions sur les
              produits et services de l&apos;entreprise, cadeaux annuels, invitations à
              des événements privés, visites de sites industriels, et bien plus.
              Cette plateforme recense tous ces avantages pour vous aider à faire
              valoir vos droits.
            </p>
          </div>
        </div>
      </section>

      {/* Comment s'inscrire au registre */}
      <section id="inscription" className="border-t border-border">
        <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-3xl)]">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-lg)]">
              GUIDE PRATIQUE
            </p>
            <h2 className="font-[family-name:var(--font-body)] text-[32px] md:text-[40px] font-medium text-text-display leading-[1.1] tracking-[-0.02em] mb-[var(--space-lg)]">
              Comment s&apos;inscrire au registre des actionnaires
            </h2>
            <p className="text-[18px] text-text-secondary leading-[1.6] mb-[var(--space-2xl)]">
              Pour profiter des avantages d&apos;un club d&apos;actionnaires, vous devez
              d&apos;abord être inscrit au registre des actionnaires de l&apos;entreprise.
              Voici comment faire, étape par étape, même si vous n&apos;avez jamais
              investi en Bourse.
            </p>

            {/* Steps */}
            <div className="space-y-[var(--space-xl)]">
              {/* Step 1 */}
              <div className="border-l-2 border-accent pl-[var(--space-lg)]">
                <div className="flex items-baseline gap-[var(--space-md)] mb-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-display)] text-[32px] font-bold text-accent leading-none">
                    01
                  </span>
                  <h3 className="font-[family-name:var(--font-body)] text-[20px] font-medium text-text-display leading-[1.2]">
                    Ouvrir un compte-titres ou un PEA
                  </h3>
                </div>
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                  Rendez-vous chez votre banque ou chez un courtier en ligne
                  (Boursorama, Fortuneo, Degiro, Trade Republic...).
                  Demandez l&apos;ouverture d&apos;un <strong className="text-text-primary">compte-titres ordinaire (CTO)</strong> ou
                  d&apos;un <strong className="text-text-primary">Plan d&apos;Épargne en Actions (PEA)</strong>.
                  Le PEA offre des avantages fiscaux après 5 ans de détention, mais
                  il est limité aux actions européennes. Le CTO est plus flexible.
                  L&apos;ouverture est généralement gratuite et se fait en ligne en
                  quelques minutes.
                </p>
                <p className="text-[15px] text-text-secondary leading-[1.7] mt-[var(--space-sm)]">
                  <strong className="text-text-primary">Attention nominatif :</strong>{" "}
                  tous les courtiers ne gèrent pas le nominatif administré de la
                  même façon. Degiro indique ne pas pouvoir inscrire ses clients
                  au registre des actionnaires (structure omnibus). Chez Trade
                  Republic, le nominatif reste partiel ou limité selon les titres
                  et l&apos;évolution du service — vérifiez dans l&apos;app ou auprès du
                  support avant d&apos;acheter pour une prime de fidélité. Les banques
                  en ligne françaises (Boursorama, Fortuneo, etc.) restent en
                  général plus adaptées pour le nominatif administré.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border-l-2 border-accent pl-[var(--space-lg)]">
                <div className="flex items-baseline gap-[var(--space-md)] mb-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-display)] text-[32px] font-bold text-accent leading-none">
                    02
                  </span>
                  <h3 className="font-[family-name:var(--font-body)] text-[20px] font-medium text-text-display leading-[1.2]">
                    Acheter des actions de l&apos;entreprise
                  </h3>
                </div>
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                  Depuis votre compte, recherchez l&apos;entreprise par son nom ou
                  son code ISIN / mnémonique (ex. : <strong className="text-text-primary">MC</strong> pour LVMH, <strong className="text-text-primary">OR</strong> pour
                  L&apos;Oréal). Passez un ordre d&apos;achat au marché pour le nombre
                  d&apos;actions souhaité. La plupart des clubs ne demandent
                  qu&apos;<strong className="text-text-primary">une seule action</strong> pour adhérer, soit parfois
                  seulement quelques dizaines d&apos;euros.
                </p>
              </div>

              {/* Step 3 */}
              <div className="border-l-2 border-accent pl-[var(--space-lg)]">
                <div className="flex items-baseline gap-[var(--space-md)] mb-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-display)] text-[32px] font-bold text-accent leading-none">
                    03
                  </span>
                  <h3 className="font-[family-name:var(--font-body)] text-[20px] font-medium text-text-display leading-[1.2]">
                    Choisir le nominatif ou rester au porteur
                  </h3>
                </div>
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                  C&apos;est l&apos;étape que beaucoup ignorent. Vos actions peuvent être
                  détenues sous deux formes :
                </p>
                <ul className="mt-[var(--space-sm)] space-y-[var(--space-sm)]">
                  <li className="text-[15px] text-text-secondary leading-[1.7] pl-[var(--space-md)] border-l border-border-visible">
                    <strong className="text-text-primary">Au porteur</strong> : vos actions restent chez votre
                    courtier. L&apos;entreprise ne sait pas que vous êtes actionnaire.
                    C&apos;est le mode par défaut.
                  </li>
                  <li className="text-[15px] text-text-secondary leading-[1.7] pl-[var(--space-md)] border-l border-border-visible">
                    <strong className="text-text-primary">Au nominatif administré</strong> : vos actions restent
                    chez votre courtier, mais votre nom est inscrit dans le registre
                    de l&apos;entreprise. C&apos;est la condition pour accéder à la plupart
                    des clubs d&apos;actionnaires.
                  </li>
                  <li className="text-[15px] text-text-secondary leading-[1.7] pl-[var(--space-md)] border-l border-border-visible">
                    <strong className="text-text-primary">Au nominatif pur</strong> : vos actions sont gérées
                    directement par l&apos;entreprise (via son teneur de registre,
                    souvent la Société Générale Securities Services ou CACEIS).
                    Frais de garde souvent gratuits et accès complet aux avantages.
                  </li>
                </ul>
                <p className="text-[15px] text-text-secondary leading-[1.7] mt-[var(--space-sm)]">
                  Pour passer au nominatif, contactez votre courtier ou
                  directement le service actionnaires de l&apos;entreprise. Si votre
                  courtier (ex. Degiro) ne propose pas le nominatif, le nominatif
                  pur auprès du teneur de registre de l&apos;émetteur (Uptevia, SGSS,
                  etc.) reste souvent une alternative hors PEA.
                </p>
              </div>

              {/* Step 4 */}
              <div className="border-l-2 border-accent pl-[var(--space-lg)]">
                <div className="flex items-baseline gap-[var(--space-md)] mb-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-display)] text-[32px] font-bold text-accent leading-none">
                    04
                  </span>
                  <h3 className="font-[family-name:var(--font-body)] text-[20px] font-medium text-text-display leading-[1.2]">
                    S&apos;inscrire au club d&apos;actionnaires
                  </h3>
                </div>
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                  Une fois vos actions acquises (et, si nécessaire, passées en
                  nominatif), rendez-vous sur le site de l&apos;entreprise dans la
                  rubrique &laquo;&nbsp;Actionnaires&nbsp;&raquo; ou &laquo;&nbsp;Investisseurs&nbsp;&raquo;.
                  Remplissez le formulaire d&apos;inscription au club. Vous recevrez
                  généralement une confirmation par e-mail sous quelques jours.
                  Certaines entreprises envoient un kit de bienvenue avec votre
                  carte de membre.
                </p>
              </div>

              {/* Step 5 */}
              <div className="border-l-2 border-accent pl-[var(--space-lg)]">
                <div className="flex items-baseline gap-[var(--space-md)] mb-[var(--space-sm)]">
                  <span className="font-[family-name:var(--font-display)] text-[32px] font-bold text-accent leading-none">
                    05
                  </span>
                  <h3 className="font-[family-name:var(--font-body)] text-[20px] font-medium text-text-display leading-[1.2]">
                    Profiter de vos avantages
                  </h3>
                </div>
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                  Réductions, cadeaux, invitations à des événements exclusifs,
                  visites de sites... Les avantages varient selon les entreprises
                  mais sont souvent méconnus. Consultez notre catalogue ci-dessus
                  pour découvrir tout ce à quoi vous avez droit.
                </p>
              </div>
            </div>

            {/* Important note */}
            <div className="mt-[var(--space-2xl)] bg-surface-raised border border-border-visible p-[var(--space-lg)]">
              <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent mb-[var(--space-sm)]">
                BON A SAVOIR
              </p>
              <p className="text-[15px] text-text-secondary leading-[1.7]">
                L&apos;inscription au registre des actionnaires est <strong className="text-text-primary">totalement
                gratuite</strong>. Pourtant, la majorité des actionnaires individuels
                ne le font jamais et passent à côté de centaines d&apos;euros
                d&apos;avantages chaque année. Une seule action suffit souvent pour
                rejoindre un club : le coût d&apos;entrée peut être aussi bas que
                10 à 20 euros selon l&apos;entreprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto px-[var(--space-md)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)] py-[var(--space-3xl)] text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[48px] font-bold text-text-display leading-[1.0] tracking-[-0.03em] mb-[var(--space-md)]">
            NE LAISSEZ PLUS<br />VOS AVANTAGES DORMIR
          </h2>
          <p className="text-[18px] text-text-secondary leading-[1.6] max-w-xl mx-auto mb-[var(--space-xl)]">
            Des milliers d&apos;actionnaires ignorent qu&apos;ils ont droit à des
            réductions, des cadeaux et des invitations exclusives.
            Inscrivez-vous au registre des actionnaires de vos entreprises
            et commencez à en profiter dès aujourd&apos;hui.
          </p>
          <a
            href="#catalogue"
            className="inline-flex items-center gap-[var(--space-sm)] bg-accent text-text-display px-[var(--space-xl)] py-[var(--space-md)] font-[family-name:var(--font-data)] text-[13px] tracking-[0.08em] uppercase hover:opacity-90 transition-opacity duration-[var(--duration-micro)]"
          >
            DECOUVRIR LES AVANTAGES →
          </a>
        </div>
      </section>
    </div>
  );
}
