import { MinSharesCost } from "@/components/StockPrice";
import { TrackedExternalLink } from "@/components/TrackedLink";

type RegistrationPanelProps = {
  companyName: string;
  companySlug: string;
  minShares: number | null;
  yahooSymbol: string | null;
  holdingMode: string;
  membershipCost: string;
  proofRequirement: string;
  procedure: string | null;
  officialUrl: string;
  companyWebsite: string | null;
};

export default function RegistrationPanel({
  companyName,
  companySlug,
  minShares,
  yahooSymbol,
  holdingMode,
  membershipCost,
  proofRequirement,
  procedure,
  officialUrl,
  companyWebsite,
}: RegistrationPanelProps) {
  const eventProperties = {
    company: companySlug,
    minShares,
  };

  return (
    <>
      <section
        id="inscription"
        aria-labelledby="registration-title"
        className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)] border border-border-visible bg-surface"
      >
        <div className="p-[var(--space-md)] sm:p-[var(--space-xl)] border-b border-border">
          <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-sm)]">
            PARCOURS ACTIONNAIRE
          </p>
          <h2
            id="registration-title"
            className="font-[family-name:var(--font-body)] text-[26px] sm:text-[32px] font-medium text-text-display leading-[1.15] tracking-[-0.02em]"
          >
            Comment accéder aux avantages {companyName} ?
          </h2>
          <p className="text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] mt-[var(--space-sm)] max-w-3xl">
            Vérifiez les conditions au moment de votre demande : les seuils et
            procédures peuvent évoluer.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
              SEUIL REFERENCE
            </p>
            <p className="text-[18px] sm:text-[20px] font-medium text-text-display leading-tight">
              {minShares
                ? `${minShares} action${minShares > 1 ? "s" : ""}`
                : "À vérifier"}
            </p>
          </div>

          <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
              INVESTISSEMENT ESTIME
            </p>
            {yahooSymbol && minShares ? (
              <MinSharesCost
                symbol={yahooSymbol}
                minShares={minShares}
                compact
                label="AU COURS ACTUEL"
              />
            ) : (
              <p className="text-[18px] sm:text-[20px] font-medium text-text-display leading-tight">
                À vérifier
              </p>
            )}
          </div>

          <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
              MODE DE DETENTION
            </p>
            <p className="text-[18px] sm:text-[20px] font-medium text-text-display leading-tight">
              {holdingMode}
            </p>
          </div>

          <div className="bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)]">
              ACCES AU PROGRAMME
            </p>
            <p className="text-[18px] sm:text-[20px] font-medium text-text-display leading-tight">
              {membershipCost}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.35fr]">
          <div className="p-[var(--space-md)] sm:p-[var(--space-xl)] border-b lg:border-b-0 lg:border-r border-border">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-lg)]">
              LES ETAPES
            </p>
            <ol className="space-y-[var(--space-lg)]">
              <li className="grid grid-cols-[28px_1fr] gap-[var(--space-sm)]">
                <span className="font-[family-name:var(--font-data)] text-[11px] text-accent">
                  01
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-text-display">
                    Détenir les actions requises
                  </h3>
                  <p className="text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5]">
                    {minShares
                      ? `Conservez au moins ${minShares} action${minShares > 1 ? "s" : ""} avant d'engager la demande.`
                      : "Vérifiez le seuil en vigueur sur la page officielle."}
                  </p>
                </div>
              </li>
              <li className="grid grid-cols-[28px_1fr] gap-[var(--space-sm)]">
                <span className="font-[family-name:var(--font-data)] text-[11px] text-accent">
                  02
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-text-display">
                    Préparer votre justificatif
                  </h3>
                  <p className="text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5]">
                    {proofRequirement}
                  </p>
                </div>
              </li>
              <li className="grid grid-cols-[28px_1fr] gap-[var(--space-sm)]">
                <span className="font-[family-name:var(--font-data)] text-[11px] text-accent">
                  03
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-text-display">
                    Suivre la procédure officielle
                  </h3>
                  <p className="text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5]">
                    Ouvrez l’espace actionnaires et suivez les instructions
                    actualisées de l’entreprise.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="p-[var(--space-md)] sm:p-[var(--space-xl)] flex flex-col">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-md)]">
              PROCEDURE DOCUMENTEE
            </p>
            <p className="text-[14px] sm:text-[15px] text-text-secondary leading-[1.65] flex-1">
              {procedure ??
                "La fiche ne permet pas encore de détailler la procédure. Consultez la source officielle avant toute démarche."}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-[var(--space-md)] mt-[var(--space-xl)]">
              <TrackedExternalLink
                href={officialUrl}
                eventName="Join Official Club"
                eventProperties={{
                  ...eventProperties,
                  placement: "registration_panel",
                }}
                className="min-h-12 inline-flex items-center justify-center bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] sm:text-[12px] tracking-[0.06em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
              >
                VOIR LA PROCEDURE OFFICIELLE →
              </TrackedExternalLink>

              {companyWebsite && companyWebsite !== officialUrl && (
                <TrackedExternalLink
                  href={companyWebsite}
                  eventName="Open Company Website"
                  eventProperties={{
                    company: companySlug,
                    placement: "registration_panel",
                  }}
                  className="min-h-11 inline-flex items-center justify-center font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)]"
                >
                  SITE DE L&apos;ENTREPRISE →
                </TrackedExternalLink>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden border-t border-border-visible bg-[color:var(--black)]/95 backdrop-blur-md px-[var(--space-md)] pt-[var(--space-sm)] pb-[max(var(--space-sm),env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto flex items-center gap-[var(--space-md)]">
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-data)] text-[9px] tracking-[0.08em] text-text-disabled">
              {minShares
                ? `DES ${minShares} ACTION${minShares > 1 ? "S" : ""}`
                : "CONDITIONS A VERIFIER"}
            </p>
            <p className="text-[13px] font-medium text-text-display truncate">
              Avantages {companyName}
            </p>
          </div>
          <TrackedExternalLink
            href={officialUrl}
            eventName="Join Official Club"
            eventProperties={{
              ...eventProperties,
              placement: "mobile_sticky",
            }}
            className="min-h-12 flex-shrink-0 inline-flex items-center justify-center bg-text-display text-black px-[var(--space-md)] font-[family-name:var(--font-data)] text-[10px] tracking-[0.06em] uppercase"
          >
            PROCEDURE →
          </TrackedExternalLink>
        </div>
      </div>
    </>
  );
}
