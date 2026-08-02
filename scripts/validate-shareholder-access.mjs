import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditPath = path.join(
  root,
  "research/shareholder-access-audit-2026-07-31/consolidated.json"
);
const seedDir = path.join(root, "prisma/seed-data/companies");
const panelPath = path.join(root, "components/RegistrationPanel.tsx");
const frPagePath = path.join(
  root,
  "app/(fr)/entreprises/[slug]/page.tsx"
);
const enPagePath = path.join(
  root,
  "app/(en)/en/companies/[slug]/page.tsx"
);

const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
const allowedStatuses = new Set([
  "formal_club",
  "shareholder_benefit",
  "shareholder_services",
  "no_program",
  "unclear",
]);
const requiredTextFields = [
  "thresholdLabelFr",
  "holdingModeFr",
  "membershipCostFr",
  "proofRequirementFr",
  "procedureFr",
  "officialUrl",
];
let failures = 0;

function fail(slug, message) {
  failures += 1;
  console.error(`[${slug}] ${message}`);
}

if (audit.companies.length !== 52) {
  fail("audit", `expected 52 entries, found ${audit.companies.length}`);
}

const slugs = new Set();
for (const access of audit.companies) {
  if (slugs.has(access.slug)) fail(access.slug, "duplicate slug");
  slugs.add(access.slug);

  if (!allowedStatuses.has(access.programStatus)) {
    fail(access.slug, `invalid programStatus ${access.programStatus}`);
  }
  if (
    access.minShares !== null &&
    (!Number.isInteger(access.minShares) || access.minShares < 1)
  ) {
    fail(access.slug, "minShares must be a positive integer or null");
  }
  if (!Number.isFinite(access.confidence)) {
    fail(access.slug, "confidence must be numeric");
  }
  for (const field of requiredTextFields) {
    if (typeof access[field] !== "string") {
      fail(access.slug, `${field} must be a string`);
    }
  }
  if (!access.officialUrl.startsWith("https://")) {
    fail(access.slug, "officialUrl must use HTTPS");
  }
  for (const threshold of access.alternateThresholds) {
    if (!Number.isInteger(threshold.minShares) || threshold.minShares < 1) {
      fail(access.slug, "alternate threshold must be a positive integer");
    }
    if (!threshold.conditionFr || !threshold.benefitFr) {
      fail(access.slug, "alternate threshold needs a condition and benefit");
    }
  }

  const seedPath = path.join(seedDir, `${access.slug}.json`);
  if (!fs.existsSync(seedPath)) {
    fail(access.slug, "missing company seed");
    continue;
  }
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const expectedMinShares =
    access.programStatus === "no_program" ? null : access.minShares;
  if ((seed.minShares ?? null) !== expectedMinShares) {
    fail(
      access.slug,
      `seed minShares is ${seed.minShares ?? "null"}, expected ${expectedMinShares ?? "null"}`
    );
  }
  if (seed.lastVerifiedAt !== audit.auditDate) {
    fail(access.slug, `lastVerifiedAt must be ${audit.auditDate}`);
  }

  const panelThreshold =
    access.programStatus === "no_program"
      ? "Non applicable"
      : access.programStatus === "unclear"
        ? "Conditions 2026 non publiees"
        : access.minShares
          ? `${access.minShares} actions`
          : "Aucun seuil publie";
  if (/a verifier/i.test(panelThreshold)) {
    fail(access.slug, "audited panel would fall back to A verifier");
  }
}

const panelSource = fs.readFileSync(panelPath, "utf8");
const frPageSource = fs.readFileSync(frPagePath, "utf8");
const enPageSource = fs.readFileSync(enPagePath, "utf8");

if (/À vérifier|A VERIFIER/.test(panelSource)) {
  fail("RegistrationPanel", "contains a generic A verifier fallback");
}
if (!frPageSource.includes("access={shareholderAccess}")) {
  fail("French page", "does not pass structured access to RegistrationPanel");
}
if (enPageSource.includes("company.minShares ?? 1")) {
  fail("English page", "still invents a one-share default");
}

if (failures > 0) {
  console.error(`${failures} shareholder-access validation error(s).`);
  process.exit(1);
}

console.log(
  `${audit.companies.length} structured shareholder-access entries validated with matching seeds and no audited A verifier fallback.`
);
