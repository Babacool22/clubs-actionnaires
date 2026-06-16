import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(
  root,
  "research",
  "company-dossiers",
  "manifest.json"
);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const selectedSlugs = new Set(process.argv.slice(2));
const companies =
  selectedSlugs.size === 0
    ? manifest.companies
    : manifest.companies.filter((company) => selectedSlugs.has(company.slug));

let failures = 0;

function fail(slug, message) {
  failures += 1;
  console.error(`[${slug}] ${message}`);
}

function checkSourceIds(slug, label, ids, knownSourceIds) {
  if (!Array.isArray(ids)) {
    fail(slug, `${label} doit être un tableau de sources.`);
    return;
  }

  for (const sourceId of ids) {
    if (!knownSourceIds.has(sourceId)) {
      fail(slug, `${label} référence une source inconnue: ${sourceId}.`);
    }
  }
}

for (const company of companies) {
  const reportPath = path.join(root, company.rawReportPath);
  if (!fs.existsSync(reportPath)) {
    fail(company.slug, `rapport absent: ${company.rawReportPath}`);
    continue;
  }

  let report;
  try {
    report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  } catch (error) {
    fail(company.slug, `JSON invalide: ${error.message}`);
    continue;
  }

  if (report.schemaVersion !== "1.0") {
    fail(company.slug, "schemaVersion doit valoir 1.0.");
  }
  if (report.researchAsOf !== manifest.researchAsOf) {
    fail(
      company.slug,
      `researchAsOf doit valoir ${manifest.researchAsOf}.`
    );
  }
  if (report.company?.slug !== company.slug) {
    fail(company.slug, `slug du rapport incorrect: ${report.company?.slug}.`);
  }
  const normalizedReportName = report.company?.name
    ?.replace(/\s+(SE|SA|S\.A\.|NV|N\.V\.)$/i, "")
    .trim();
  if (
    report.company?.name !== company.name &&
    normalizedReportName !== company.name
  ) {
    fail(company.slug, `nom du rapport incorrect: ${report.company?.name}.`);
  }

  const sources = Array.isArray(report.sources) ? report.sources : [];
  const knownSourceIds = new Set();
  const knownUrls = new Set();
  for (const source of sources) {
    if (!source?.id || knownSourceIds.has(source.id)) {
      fail(company.slug, `identifiant de source absent ou dupliqué: ${source?.id}.`);
    }
    knownSourceIds.add(source?.id);

    if (!source?.url || knownUrls.has(source.url)) {
      fail(company.slug, `URL de source absente ou dupliquée: ${source?.url}.`);
    }
    knownUrls.add(source?.url);

    if (source?.accessedAt !== manifest.researchAsOf) {
      fail(
        company.slug,
        `source ${source?.id} consultée à une date différente de ${manifest.researchAsOf}.`
      );
    }
  }

  if (sources.length === 0) {
    fail(company.slug, "aucune source fournie.");
  }

  checkSourceIds(
    company.slug,
    "offerClassification.sourceIds",
    report.offerClassification?.sourceIds,
    knownSourceIds
  );
  checkSourceIds(
    company.slug,
    "eligibility.sourceIds",
    report.eligibility?.sourceIds,
    knownSourceIds
  );
  checkSourceIds(
    company.slug,
    "enrollment.sourceIds",
    report.enrollment?.sourceIds,
    knownSourceIds
  );

  const benefits = Array.isArray(report.benefits) ? report.benefits : [];
  if (benefits.length > 8) {
    fail(company.slug, `${benefits.length} bénéfices: maximum autorisé 8.`);
  }
  for (const benefit of benefits) {
    if (!knownSourceIds.has(benefit.primarySourceId)) {
      fail(
        company.slug,
        `bénéfice ${benefit.id} sans source primaire valide.`
      );
    }
    if (!["A", "B", "C"].includes(benefit.evidenceGrade)) {
      fail(
        company.slug,
        `bénéfice ${benefit.id} avec preuve insuffisante ${benefit.evidenceGrade}.`
      );
    }
    if (benefit.sourceUrl !== sources.find(
      (source) => source.id === benefit.primarySourceId
    )?.url) {
      fail(
        company.slug,
        `sourceUrl de ${benefit.id} ne correspond pas à sa source primaire.`
      );
    }
    checkSourceIds(
      company.slug,
      `bénéfice ${benefit.id}`,
      benefit.supportingSourceIds,
      knownSourceIds
    );
  }

  const faqs = Array.isArray(report.faqs) ? report.faqs : [];
  if (faqs.length < 5 || faqs.length > 6) {
    fail(company.slug, `${faqs.length} FAQ: 5 ou 6 requises.`);
  }
  for (const [index, faq] of faqs.entries()) {
    checkSourceIds(
      company.slug,
      `FAQ ${index + 1}`,
      faq.sourceIds,
      knownSourceIds
    );
  }

  for (const claim of report.claims ?? []) {
    checkSourceIds(
      company.slug,
      `claim ${claim.id}`,
      claim.sourceIds,
      knownSourceIds
    );
  }
  for (const [index, claim] of (report.rejectedClaims ?? []).entries()) {
    checkSourceIds(
      company.slug,
      `rejectedClaim ${index + 1}`,
      claim.sourceIds,
      knownSourceIds
    );
  }
  for (const [index, conflict] of (report.conflicts ?? []).entries()) {
    checkSourceIds(
      company.slug,
      `conflit ${index + 1}`,
      conflict.sourceIds,
      knownSourceIds
    );
  }

  if (report.handoff?.benefitCount !== benefits.length) {
    fail(company.slug, "handoff.benefitCount ne correspond pas au rapport.");
  }
  if (report.handoff?.faqCount !== faqs.length) {
    fail(company.slug, "handoff.faqCount ne correspond pas au rapport.");
  }

  if (failures === 0) {
    console.log(`[${company.slug}] rapport conforme.`);
  }
}

if (failures > 0) {
  console.error(`${failures} erreur(s) détectée(s).`);
  process.exit(1);
}

console.log(`${companies.length} rapport(s) validé(s).`);
