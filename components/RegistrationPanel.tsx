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
        className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)] min-w-0 overflow-x-clip border border-border-visible bg-surface"
      >
        <div className="p-[var(--space-md)] sm:p-[var(--space-xl)] border-b border-border">
          <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-sm)] [overflow-wrap:anywhere]">
            PARCOURS ACTIONNAIRE
          </p>
          <h2
            id="registration-title"
            className="break-words font-[family-name:var(--font-body)] text-[26px] sm:text-[32px] font-medium text-text-display leading-[1.15] tracking-[-0.02em] [overflow-wrap:anywhere]"
          >
            Comment accéder aux avantages {companyName} ?
          </h2>
          <p className="max-w-3xl break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] mt-[var(--space-sm)] [overflow-wrap:anywhere]">
            Vérifiez les conditions au moment de votre demande : les seuils et
            procédures peuvent évoluer.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              SEUIL REFERENCE
            </p>
            <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
              {minShares
                ? `${minShares} action${minShares > 1 ? "s" : ""}`
                : "À vérifier"}
            </p>
          </div>

          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
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
              <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
                À vérifier
              </p>
            )}
          </div>

          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              MODE DE DETENTION
            </p>
            <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
              {holdingMode}
            </p>
          </div>

          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              ACCES AU PROGRAMME
            </p>
            <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
              {membershipCost}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 lg:grid-cols-[1fr_1.35fr]">
          <div className="p-[var(--space-md)] sm:p-[var(--space-xl)] border-b lg:border-b-0 lg:border-r border-border">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-lg)] [overflow-wrap:anywhere]">
              LES ETAPES
            </p>
            <ol className="space-y-[var(--space-lg)]">
              <li className="grid min-w-0 grid-cols-[28px_1fr] gap-[var(--space-sm)]">
                <span className="font-[family-name:var(--font-data)] text-[11px] text-accent">
                  01
                </span>
                <div className="min-w-0">
                  <h3 className="break-words text-[15px] font-medium text-text-display [overflow-wrap:anywhere]">
                    Détenir les actions requises
                  </h3>
                  <p className="break-words text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5] [overflow-wrap:anywhere]">
                    {minShares
                      ? `Conservez au moins ${minShares} action${minShares > 1 ? "s" : ""} avant d'engager la demande.`
                      : "Vérifiez le seuil en vigueur sur la page officielle."}
                  </p>
                </div>
              </li>
              <li className="grid min-w-0 grid-cols-[28px_1fr] gap-[var(--space-sm)]">
                <span className="font-[family-name:var(--font-data)] text-[11px] text-accent">
                  02
                </span>
                <div className="min-w-0">
                  <h3 className="break-words text-[15px] font-medium text-text-display [overflow-wrap:anywhere]">
                    Préparer votre justificatif
                  </h3>
                  <p className="break-words text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5] [overflow-wrap:anywhere]">
                    {proofRequirement}
                  </p>
                </div>
              </li>
              <li className="grid min-w-0 grid-cols-[28px_1fr] gap-[var(--space-sm)]">
                <span className="font-[family-name:var(--font-data)] text-[11px] text-accent">
                  03
                </span>
                <div className="min-w-0">
                  <h3 className="break-words text-[15px] font-medium text-text-display [overflow-wrap:anywhere]">
                    Suivre la procédure officielle
                  </h3>
                  <p className="break-words text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5] [overflow-wrap:anywhere]">
                    Ouvrez l’espace actionnaires et suivez les instructions
                    actualisées de l’entreprise.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="min-w-0 p-[var(--space-md)] sm:p-[var(--space-xl)] flex flex-col">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-md)] [overflow-wrap:anywhere]">
              PROCEDURE DOCUMENTEE
            </p>
            <p className="min-w-0 flex-1 break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.65] [overflow-wrap:anywhere]">
              {procedure ??
                "La fiche ne permet pas encore de détailler la procédure. Consultez la source officielle avant toute démarche."}
            </p>

            <div className="flex min-w-0 flex-col sm:flex-row sm:items-center gap-[var(--space-md)] mt-[var(--space-xl)]">
              <TrackedExternalLink
                href={officialUrl}
                eventName="Join Official Club"
                eventProperties={{
                  ...eventProperties,
                  placement: "registration_panel",
                }}
                className="min-h-12 min-w-0 max-w-full break-words inline-flex items-center justify-center bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] sm:text-[12px] tracking-[0.06em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)] [overflow-wrap:anywhere]"
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
                  className="min-h-11 min-w-0 max-w-full break-words inline-flex items-center justify-center font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-secondary hover:text-text-display transition-colors duration-[var(--duration-micro)] [overflow-wrap:anywhere]"
                >
                  SITE DE L&apos;ENTREPRISE →
                </TrackedExternalLink>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden overflow-x-clip border-t border-border-visible bg-[color:var(--black)]/95 backdrop-blur-md px-[var(--space-md)] pt-[var(--space-sm)] pb-[max(var(--space-sm),env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto flex min-w-0 items-center gap-[var(--space-sm)]">
          <div className="min-w-0 flex-1">
            <p className="truncate font-[family-name:var(--font-data)] text-[9px] tracking-[0.08em] text-text-disabled">
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
            className="min-h-12 max-w-[45vw] flex-shrink-0 break-words inline-flex items-center justify-center bg-text-display text-black px-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] tracking-[0.04em] uppercase text-center leading-tight [overflow-wrap:anywhere]"
          >
            PROCEDURE →
          </TrackedExternalLink>
        </div>
      </div>
    </>
  );
}
