import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "research/company-dossiers/manifest.json"), "utf8")
);
const seedDir = path.join(root, "prisma/seed-data/companies");
let failures = 0;

function fail(slug, message) {
  failures += 1;
  console.error(`[${slug}] ${message}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

for (const company of manifest.companies) {
  if (company.status !== "ready_for_development") {
    fail(company.slug, `status is ${company.status}, expected ready_for_development`);
    continue;
  }

  const finalPath = path.join(root, company.finalDossierPath);
  const rawPath = path.join(root, company.rawReportPath);
  if (!fs.existsSync(finalPath)) {
    fail(company.slug, `missing final dossier ${company.finalDossierPath}`);
    continue;
  }

  const dossier = readJson(finalPath);
  const report = readJson(rawPath);

  if (dossier.slug !== company.slug) fail(company.slug, "slug mismatch");
  if (dossier.name !== company.name) fail(company.slug, "name mismatch");
  if (dossier.sector !== company.sector) fail(company.slug, "sector mismatch");
  if (dossier.stockIndex !== company.stockIndex) fail(company.slug, "stockIndex mismatch");
  if (dossier.lastVerifiedAt !== report.researchAsOf) {
    fail(company.slug, "lastVerifiedAt must match researchAsOf");
  }
  if ((dossier.minShares ?? null) !== (report.eligibility.globalMinimumShares ?? null)) {
    fail(company.slug, "minShares mismatch");
  }
  if ((dossier.benefits ?? []).length !== report.benefits.length) {
    fail(company.slug, "benefit count mismatch");
  }
  if ((dossier.faqs ?? []).length !== report.faqs.length) {
    fail(company.slug, "FAQ count mismatch");
  }

  const sourceUrls = new Set(dossier.sources ?? []);
  for (const [index, benefit] of (dossier.benefits ?? []).entries()) {
    if (!benefit.title || !benefit.description) {
      fail(company.slug, `benefit ${index + 1} missing title or description`);
    }
    if (/Source\s*:/.test(benefit.description)) {
      fail(company.slug, `benefit ${index + 1} contains rendered source marker`);
    }
    if (!benefit.sourceUrl) {
      fail(company.slug, `benefit ${index + 1} missing sourceUrl`);
    } else if (!sourceUrls.has(benefit.sourceUrl)) {
      fail(company.slug, `benefit ${index + 1} sourceUrl not listed in sources`);
    }
  }

  for (const [index, faq] of (dossier.faqs ?? []).entries()) {
    if (!faq.question || !faq.answer) {
      fail(company.slug, `FAQ ${index + 1} missing question or answer`);
    }
  }
}

const files = fs.readdirSync(seedDir).filter((file) => file.endsWith(".json"));
for (const file of files) {
  const dossier = readJson(path.join(seedDir, file));
  if (!Array.isArray(dossier.benefits)) fail(file, "benefits must be an array");
  if (!Array.isArray(dossier.faqs)) fail(file, "faqs must be an array");
}

if (failures > 0) {
  console.error(`${failures} validation error(s).`);
  process.exit(1);
}

console.log(
  `${manifest.companies.length} researched dossier(s) validated; ${files.length} seed dossier(s) parse cleanly.`
);
