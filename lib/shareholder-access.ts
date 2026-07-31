import consolidatedAccessAudit from "@/research/shareholder-access-audit-2026-07-31/consolidated.json";

export const shareholderProgramStatuses = [
  "formal_club",
  "shareholder_benefit",
  "shareholder_services",
  "no_program",
  "unclear",
] as const;

export type ShareholderProgramStatus =
  (typeof shareholderProgramStatuses)[number];

export type AlternateShareThreshold = {
  minShares: number;
  conditionFr: string;
  benefitFr: string;
};

export type ShareholderAccess = {
  slug: string;
  programStatus: ShareholderProgramStatus;
  minShares: number | null;
  alternateThresholds: AlternateShareThreshold[];
  thresholdLabelFr: string;
  holdingModeFr: string;
  membershipCostFr: string;
  proofRequirementFr: string;
  procedureFr: string;
  officialUrl: string;
  confidence: number;
};

const shareholderAccessEntries =
  consolidatedAccessAudit.companies as ShareholderAccess[];

export const SHAREHOLDER_ACCESS_BY_SLUG = Object.freeze(
  Object.fromEntries(
    shareholderAccessEntries.map((entry) => [entry.slug, Object.freeze(entry)])
  )
) as Readonly<Record<string, Readonly<ShareholderAccess>>>;

export const AUDITED_SHAREHOLDER_ACCESS_SLUGS = Object.freeze(
  shareholderAccessEntries.map((entry) => entry.slug)
);

export function getShareholderAccess(slug: string) {
  return SHAREHOLDER_ACCESS_BY_SLUG[slug] ?? null;
}
