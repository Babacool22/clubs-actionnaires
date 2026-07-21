import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dossiersDir = path.join(root, "prisma", "seed-data", "companies");
const publicDir = path.join(root, "public");
const pagePath = path.join(root, "app", "entreprises", "[slug]", "page.tsx");
const componentPath = path.join(root, "components", "CompanyLogo.tsx");
const cssPath = path.join(root, "app", "globals.css");
const updaterPath = path.join(root, "prisma", "update-from-dossiers.ts");

function fail(message) {
  console.error(`x ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`ok ${message}`);
}

const files = fs
  .readdirSync(dossiersDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

let withLogo = 0;

for (const file of files) {
  const fullPath = path.join(dossiersDir, file);
  const dossier = JSON.parse(fs.readFileSync(fullPath, "utf8"));

  if (!dossier.logoUrl) {
    fail(`${file} n'a pas de logoUrl`);
    continue;
  }

  if (!dossier.logoUrl.startsWith("/logos/")) {
    fail(`${file} logoUrl doit pointer vers /logos/`);
    continue;
  }

  const assetPath = path.join(publicDir, dossier.logoUrl.replace(/^\//, ""));
  if (!fs.existsSync(assetPath)) {
    fail(`${file} pointe vers un asset absent: ${dossier.logoUrl}`);
    continue;
  }

  const ext = path.extname(assetPath).toLowerCase();
  if (![".png", ".svg", ".webp"].includes(ext)) {
    fail(`${file} pointe vers un format logo inattendu: ${ext}`);
    continue;
  }

  const stat = fs.statSync(assetPath);
  if (stat.size === 0) {
    fail(`${file} pointe vers un asset vide`);
    continue;
  }

  withLogo++;
}

const page = fs.readFileSync(pagePath, "utf8");
const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const updater = fs.readFileSync(updaterPath, "utf8");

if (!page.includes("<CompanyLogo") || !page.includes("logoUrl={company.logoUrl}")) {
  fail("la fiche entreprise ne rend pas CompanyLogo avec company.logoUrl");
} else {
  ok("la fiche entreprise rend CompanyLogo");
}

if (!component.includes("next/image") || !component.includes("className=\"company-logo-image\"")) {
  fail("CompanyLogo doit rendre les logos en image couleur");
} else {
  ok("CompanyLogo rend les logos en couleur");
}

if (!component.includes("LOGOS_WITH_PLATE") || !component.includes("data-plate")) {
  fail("CompanyLogo doit garder les plaques blanches seulement pour les logos monochromes");
} else {
  ok("CompanyLogo limite les plaques blanches aux logos monochromes");
}

if (!css.includes("aspect-ratio: 1 / 1") || !css.includes("object-fit: contain")) {
  fail("les styles logo ne garantissent pas un carre responsive sans crop");
} else {
  ok("les styles logo gardent un carre responsive proportionnel");
}

if (!css.includes('.company-logo-shell[data-plate="true"]')) {
  fail("les styles logo doivent rendre la plaque blanche conditionnelle");
} else {
  ok("les styles logo rendent la plaque blanche conditionnelle");
}

if (!updater.includes("logoUrl") || !updater.includes("company.logoUrl")) {
  fail("update-from-dossiers ne propage pas logoUrl");
} else {
  ok("update-from-dossiers propage logoUrl");
}

if (withLogo === files.length) {
  ok(`${withLogo}/${files.length} dossiers ont un logo local`);
} else {
  fail(`${withLogo}/${files.length} dossiers seulement ont un logo local valide`);
}
