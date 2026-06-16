import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "research/company-dossiers/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyMissing = args.includes("--missing");
const selectedSlugs = new Set(args.filter((arg) => !arg.startsWith("--")));

function sourceUrlById(report, id) {
  return report.sources.find((source) => source.id === id)?.url ?? null;
}

function uniqueUrls(urls) {
  return Array.from(new Set(urls.filter(Boolean)));
}

function mapBenefit(report, benefit) {
  return {
    type: benefit.type,
    title: benefit.title,
    description: benefit.description,
    value: benefit.value ?? null,
    requiredShares: benefit.requiredShares ?? null,
    sourceUrl: benefit.sourceUrl ?? sourceUrlById(report, benefit.primarySourceId),
  };
}

function buildDossier(company) {
  const report = JSON.parse(
    fs.readFileSync(path.join(root, company.rawReportPath), "utf8")
  );
  const sourceUrls = uniqueUrls([
    ...report.benefits.map(
      (benefit) => benefit.sourceUrl ?? sourceUrlById(report, benefit.primarySourceId)
    ),
    ...report.sources.map((source) => source.url),
  ]);

  const dossier = {
    slug: company.slug,
    name: company.name,
    description: report.company.description,
    sector: company.sector,
    stockIndex: company.stockIndex,
    ticker: report.company.ticker,
    website: report.company.website,
    minShares: report.eligibility.globalMinimumShares ?? null,
    lastVerifiedAt: report.researchAsOf,
    benefits: report.benefits.map((benefit) => mapBenefit(report, benefit)),
    faqs: report.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    sources: sourceUrls,
  };

  if (report.company.clubName) dossier.clubName = report.company.clubName;
  if (report.company.clubUrl) dossier.clubUrl = report.company.clubUrl;

  return dossier;
}

const companies = manifest.companies.filter((company) => {
  if (selectedSlugs.size > 0 && !selectedSlugs.has(company.slug)) return false;
  if (company.status !== "ready_for_development") return false;
  return true;
});

let written = 0;
let skipped = 0;

for (const company of companies) {
  const finalPath = path.join(root, company.finalDossierPath);
  if (fs.existsSync(finalPath) && !force && onlyMissing) {
    skipped += 1;
    continue;
  }
  if (fs.existsSync(finalPath) && !force && !onlyMissing) {
    console.error(
      `[${company.slug}] exists already. Use --force or --missing to control writes.`
    );
    process.exitCode = 1;
    continue;
  }

  const dossier = buildDossier(company);
  fs.mkdirSync(path.dirname(finalPath), { recursive: true });
  fs.writeFileSync(finalPath, `${JSON.stringify(dossier, null, 2)}\n`, "utf8");
  written += 1;
  console.log(`[${company.slug}] wrote ${company.finalDossierPath}`);
}

if (selectedSlugs.size > 0) {
  const knownSlugs = new Set(manifest.companies.map((company) => company.slug));
  for (const slug of selectedSlugs) {
    if (!knownSlugs.has(slug)) {
      console.error(`[${slug}] unknown slug`);
      process.exitCode = 1;
    }
  }
}

console.log(`Done. written=${written} skipped=${skipped}`);
