import { MinSharesCost } from "@/components/StockPrice";
import { TrackedExternalLink } from "@/components/TrackedLink";
import type { ShareholderAccess } from "@/lib/shareholder-access";

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
  access?: Readonly<ShareholderAccess> | null;
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
  access,
}: RegistrationPanelProps) {
  const status = access?.programStatus ?? "formal_club";
  const referenceShares = access?.minShares ?? minShares;
  const thresholdLabel = access?.thresholdLabelFr;
  const resolvedHoldingMode = access?.holdingModeFr || holdingMode;
  const resolvedMembershipCost = access?.membershipCostFr || membershipCost;
  const resolvedProofRequirement =
    access?.proofRequirementFr || proofRequirement;
  const resolvedProcedure = access?.procedureFr || procedure;
  const resolvedOfficialUrl = access?.officialUrl || officialUrl;
  const isNoProgram = status === "no_program";
  const isUnclear = status === "unclear";
  const hasPublishedThreshold = referenceShares !== null;
  const shouldEstimateInvestment =
    hasPublishedThreshold && !isNoProgram && !isUnclear;

  const panelCopy = {
    formal_club: {
      eyebrow: "PARCOURS DU CLUB",
      title: `Comment rejoindre le club ${companyName} ?`,
      intro:
        "Vérifiez les conditions au moment de votre demande : les seuils et procédures peuvent évoluer.",
      cta: "REJOINDRE LE CLUB →",
      eventName: "Join Official Club",
    },
    shareholder_benefit: {
      eyebrow: "AVANTAGE ACTIONNAIRE",
      title: `Comment demander l'avantage ${companyName} ?`,
      intro:
        "Vérifiez les conditions et les délais directement auprès de l'entreprise avant votre demande.",
      cta: "DEMANDER L'AVANTAGE →",
      eventName: "Request Shareholder Benefit",
    },
    shareholder_services: {
      eyebrow: "SERVICES ACTIONNAIRES",
      title: `Comment accéder aux services actionnaires ${companyName} ?`,
      intro:
        "Ces services relèvent de la détention ou de la relation actionnaire, sans constituer un club d'avantages.",
      cta: "VOIR LES SERVICES OFFICIELS →",
      eventName: "Open Shareholder Services",
    },
    no_program: {
      eyebrow: "STATUT DU PROGRAMME",
      title: `Aucun programme actionnaire actif identifié chez ${companyName}`,
      intro:
        "Les droits ordinaires liés à l'action ne sont pas présentés ici comme un club ou un avantage commercial.",
      cta: "CONSULTER LA SOURCE OFFICIELLE →",
      eventName: "Open Official Shareholder Source",
    },
    unclear: {
      eyebrow: "CONDITIONS À CONFIRMER",
      title: `Offre actionnaire ${companyName} : conditions 2026 non publiées`,
      intro:
        "Une offre antérieure ou ponctuelle est documentée, mais ses conditions actuelles ne peuvent pas être affirmées.",
      cta: "VÉRIFIER L'OFFRE OFFICIELLE →",
      eventName: "Verify Shareholder Offer",
    },
  }[status];

  const thresholdValue = isNoProgram
    ? "Non applicable"
    : isUnclear
      ? "Conditions 2026 non publiées"
      : hasPublishedThreshold
        ? `${referenceShares} action${referenceShares > 1 ? "s" : ""}`
        : "Aucun seuil publié";

  const investmentFallback = isNoProgram
    ? "Non applicable"
    : isUnclear
      ? "Conditions 2026 non publiées"
      : "Aucun seuil publié";

  const eventProperties = {
    company: companySlug,
    minShares: referenceShares,
    programStatus: status,
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
            {panelCopy.eyebrow}
          </p>
          <h2
            id="registration-title"
            className="break-words font-[family-name:var(--font-body)] text-[26px] sm:text-[32px] font-medium text-text-display leading-[1.15] tracking-[-0.02em] [overflow-wrap:anywhere]"
          >
            {panelCopy.title}
          </h2>
          <p className="max-w-3xl break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.6] mt-[var(--space-sm)] [overflow-wrap:anywhere]">
            {panelCopy.intro}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              SEUIL REFERENCE
            </p>
            <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
              {thresholdValue}
            </p>
            {thresholdLabel && (
              <p className="mt-[var(--space-xs)] break-words text-[11px] leading-[1.45] text-text-disabled [overflow-wrap:anywhere]">
                {thresholdLabel}
              </p>
            )}
          </div>

          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              INVESTISSEMENT ESTIME
            </p>
            {yahooSymbol && shouldEstimateInvestment ? (
              <MinSharesCost
                symbol={yahooSymbol}
                minShares={referenceShares!}
                compact
                label="AU COURS ACTUEL"
              />
            ) : (
              <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
                {investmentFallback}
              </p>
            )}
          </div>

          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              MODE DE DETENTION
            </p>
            <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
              {resolvedHoldingMode || "Non applicable"}
            </p>
          </div>

          <div className="min-w-0 bg-[var(--black)] p-[var(--space-md)] min-h-28">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-sm)] [overflow-wrap:anywhere]">
              ACCES AU PROGRAMME
            </p>
            <p className="break-words text-[18px] sm:text-[20px] font-medium text-text-display leading-tight [overflow-wrap:anywhere]">
              {resolvedMembershipCost}
            </p>
          </div>
        </div>

        {access && access.alternateThresholds.length > 0 && (
          <div className="border-t border-border p-[var(--space-md)] sm:p-[var(--space-xl)]">
            <p className="font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-accent mb-[var(--space-md)]">
              PALIERS ET CONDITIONS DISTINCTES
            </p>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {access.alternateThresholds.map((threshold) => (
                <div
                  key={`${threshold.minShares}-${threshold.conditionFr}`}
                  className="min-w-0 bg-surface p-[var(--space-md)]"
                >
                  <p className="text-[18px] font-medium text-text-display">
                    {threshold.minShares} actions
                  </p>
                  <p className="mt-[var(--space-xs)] text-[12px] leading-[1.5] text-text-secondary">
                    {threshold.conditionFr}
                  </p>
                  <p className="mt-[var(--space-sm)] text-[13px] leading-[1.5] text-text-display">
                    {threshold.benefitFr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`grid min-w-0 ${isNoProgram ? "" : "lg:grid-cols-[1fr_1.35fr]"}`}
        >
          {!isNoProgram && (
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
                    {status === "shareholder_services"
                      ? "Choisir le mode de détention adapté"
                      : isUnclear
                        ? "Confirmer les conditions actuelles"
                        : "Détenir les actions requises"}
                  </h3>
                  <p className="break-words text-[13px] text-text-secondary mt-[var(--space-xs)] leading-[1.5] [overflow-wrap:anywhere]">
                    {thresholdLabel ??
                      (hasPublishedThreshold
                        ? `Conservez au moins ${referenceShares} action${referenceShares! > 1 ? "s" : ""} avant d'engager la demande.`
                        : "Aucun seuil chiffré n'est publié par l'entreprise.")}
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
                    {resolvedProofRequirement}
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
                    Utilisez uniquement la source officielle et suivez les
                    instructions actualisées de l’entreprise.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          )}

          <div className="min-w-0 p-[var(--space-md)] sm:p-[var(--space-xl)] flex flex-col">
            <p className="break-words font-[family-name:var(--font-data)] text-[10px] tracking-[0.08em] text-text-disabled mb-[var(--space-md)] [overflow-wrap:anywhere]">
              {isNoProgram ? "CONSTAT DOCUMENTE" : "PROCEDURE DOCUMENTEE"}
            </p>
            <p className="min-w-0 flex-1 break-words text-[14px] sm:text-[15px] text-text-secondary leading-[1.65] [overflow-wrap:anywhere]">
              {resolvedProcedure ??
                "La fiche ne permet pas encore de détailler la procédure. Consultez la source officielle avant toute démarche."}
            </p>

            <div className="flex min-w-0 flex-col sm:flex-row sm:items-center gap-[var(--space-md)] mt-[var(--space-xl)]">
              <TrackedExternalLink
                href={resolvedOfficialUrl}
                eventName={panelCopy.eventName}
                eventProperties={{
                  ...eventProperties,
                  placement: "registration_panel",
                }}
                className="min-h-12 min-w-0 max-w-full break-words inline-flex items-center justify-center bg-text-display text-black px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] sm:text-[12px] tracking-[0.06em] uppercase hover:opacity-80 transition-opacity duration-[var(--duration-micro)] [overflow-wrap:anywhere]"
              >
                {panelCopy.cta}
              </TrackedExternalLink>

              {companyWebsite && companyWebsite !== resolvedOfficialUrl && (
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

      {!isNoProgram && (
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden overflow-x-clip border-t border-border-visible bg-[color:var(--black)]/95 backdrop-blur-md px-[var(--space-md)] pt-[var(--space-sm)] pb-[max(var(--space-sm),env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto flex min-w-0 items-center gap-[var(--space-sm)]">
          <div className="min-w-0 flex-1">
            <p className="truncate font-[family-name:var(--font-data)] text-[9px] tracking-[0.08em] text-text-disabled">
              {thresholdValue.toUpperCase()}
            </p>
            <p className="text-[13px] font-medium text-text-display truncate">
              {status === "shareholder_services" ? "Services" : "Accès"} {companyName}
            </p>
          </div>
          <TrackedExternalLink
            href={resolvedOfficialUrl}
            eventName={panelCopy.eventName}
            eventProperties={{
              ...eventProperties,
              placement: "mobile_sticky",
            }}
            className="min-h-12 max-w-[45vw] flex-shrink-0 break-words inline-flex items-center justify-center bg-text-display text-black px-[var(--space-sm)] font-[family-name:var(--font-data)] text-[10px] tracking-[0.04em] uppercase text-center leading-tight [overflow-wrap:anywhere]"
          >
            {status === "unclear" ? "VERIFIER →" : "PROCEDURE →"}
          </TrackedExternalLink>
        </div>
      </div>
      )}
    </>
  );
}
