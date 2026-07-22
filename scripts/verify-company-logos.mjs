import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dossiersDir = path.join(root, "prisma", "seed-data", "companies");
const publicDir = path.join(root, "public");
const pagePath = path.join(root, "app", "entreprises", "[slug]", "page.tsx");
const componentPath = path.join(root, "components", "CompanyLogo.tsx");
const cssPath = path.join(root, "app", "globals.css");
const updaterPath = path.join(root, "prisma", "update-from-dossiers.ts");
const telefonicaLogoPath = path.join(publicDir, "logos", "telefonica.svg");

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
const telefonicaLogo = fs.readFileSync(telefonicaLogoPath, "utf8");
const rawBackgroundBlock =
  component.match(/const LOGOS_WITH_RAW_BACKGROUND = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const roundedImageBlock =
  component.match(/const LOGOS_WITH_ROUNDED_IMAGE = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const maxFillBlock =
  component.match(/const LOGOS_WITH_MAX_FILL = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const visualBoostBlock =
  component.match(/const LOGOS_WITH_VISUAL_BOOST = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const strongVisualBoostBlock =
  component.match(/const LOGOS_WITH_STRONG_VISUAL_BOOST = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";

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

if (
  !component.includes("LOGOS_WITH_RAW_BACKGROUND") ||
  !component.includes("LOGOS_WITH_ROUNDED_IMAGE") ||
  !component.includes("LOGOS_WITH_MAX_FILL") ||
  !component.includes("LOGOS_WITH_VISUAL_BOOST") ||
  !component.includes("LOGOS_WITH_STRONG_VISUAL_BOOST") ||
  !component.includes("LOGOS_WITH_ADAPTIVE_MONOCHROME") ||
  !component.includes('data-logo-mode={logoMode}') ||
  component.includes("LOGOS_WITH_PLATE") ||
  component.includes("data-plate") ||
  rawBackgroundBlock.includes('"hermes"') ||
  rawBackgroundBlock.includes('"lvmh"') ||
  rawBackgroundBlock.includes('"legrand-white-vignette"') ||
  rawBackgroundBlock.includes('"carnival-corporation-white-vignette"') ||
  rawBackgroundBlock.includes('"norwegian-cruise-line-blue"') ||
  rawBackgroundBlock.includes('"axa"') ||
  rawBackgroundBlock.includes('"orange"') ||
  rawBackgroundBlock.includes('"royal-caribbean"') ||
  rawBackgroundBlock.includes('"sanofi-purple"') ||
  rawBackgroundBlock.includes('"stellantis-brand"') ||
  !roundedImageBlock.includes('"axa"') ||
  !roundedImageBlock.includes('"carnival-corporation-white-vignette"') ||
  !roundedImageBlock.includes('"lvmh"') ||
  !roundedImageBlock.includes('"legrand-white-vignette"') ||
  !roundedImageBlock.includes('"norwegian-cruise-line-blue"') ||
  !roundedImageBlock.includes('"orange"') ||
  !roundedImageBlock.includes('"royal-caribbean"') ||
  !roundedImageBlock.includes('"sanofi-purple"') ||
  !roundedImageBlock.includes('"stellantis-brand"')
) {
  fail("CompanyLogo doit arrondir seulement les logos avec fond brut, sans plaque artificielle");
} else {
  ok("CompanyLogo distingue les logos transparents des fonds bruts");
}

if (
  !maxFillBlock.includes('"3m"') ||
  !maxFillBlock.includes('"danone-vertical"') ||
  !maxFillBlock.includes('"capgemini"') ||
  !maxFillBlock.includes('"carrefour"') ||
  !maxFillBlock.includes('"essilorluxottica-wide"') ||
  !maxFillBlock.includes('"eurofins-scientific-color"') ||
  !maxFillBlock.includes('"legrand-white-vignette"')
) {
  fail("CompanyLogo doit agrandir uniquement les logos selectionnes comme trop petits");
} else {
  ok("CompanyLogo agrandit les logos trop petits selectionnes");
}

if (
  !visualBoostBlock.includes('"carrefour"') ||
  !visualBoostBlock.includes('"essilorluxottica-wide"') ||
  !visualBoostBlock.includes('"eurofins-scientific-color"') ||
  !visualBoostBlock.includes('"legrand-white-vignette"') ||
  visualBoostBlock.includes('"capgemini"') ||
  visualBoostBlock.includes('"3m"') ||
  visualBoostBlock.includes('"danone-vertical"') ||
  !strongVisualBoostBlock.includes('"capgemini"') ||
  strongVisualBoostBlock.includes('"carrefour"')
) {
  fail("CompanyLogo doit booster seulement les logos horizontaux signales comme trop petits");
} else {
  ok("CompanyLogo booste seulement les logos horizontaux trop petits");
}

if (!css.includes("aspect-ratio: 1 / 1") || !css.includes("object-fit: contain")) {
  fail("les styles logo ne garantissent pas un carre responsive sans crop");
} else {
  ok("les styles logo gardent un carre responsive proportionnel");
}

if (
  !css.includes('.company-logo-shell[data-logo-mode="raw"]') ||
  !css.includes('.company-logo-shell[data-logo-mode="transparent"]') ||
  !css.includes('data-adaptive-monochrome="true"') ||
  !component.includes('"renault"') ||
  css.includes("data-plate")
) {
  fail("les styles logo doivent garder les transparents sans vignette et arrondir les fonds bruts");
} else {
  ok("les styles logo gardent les transparents sans vignette");
}

if (!telefonicaLogo.includes('fill="#0066FF"')) {
  fail("le logo Telefonica doit avoir une couleur explicite visible sur fond noir");
} else {
  ok("le logo Telefonica reste visible sur fond noir");
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
