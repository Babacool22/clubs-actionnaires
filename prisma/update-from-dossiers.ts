import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const VALID_BENEFIT_TYPES = new Set([
  "reduction",
  "cadeau",
  "evenement",
  "service",
  "priorite",
]);

const TYPE_ALIASES: Record<string, string> = {
  event: "evenement",
  evenement: "evenement",
  reunion: "evenement",
  visit: "evenement",
  visite: "evenement",
  conference: "evenement",
  concours: "evenement",
  gift: "cadeau",
  cadeau: "cadeau",
  reduction: "reduction",
  remise: "reduction",
  service: "service",
  communication: "service",
  publication: "service",
  plateforme: "service",
  guide: "service",
  governance: "service",
  dividend: "priorite",
  dividende: "priorite",
  priorite: "priorite",
  priority: "priorite",
};

function normalizeType(raw: string): string {
  const key = raw.toLowerCase().trim();
  const mapped = TYPE_ALIASES[key];
  if (mapped && VALID_BENEFIT_TYPES.has(mapped)) return mapped;
  return "service";
}

type SourceEntry = string | { url: string; title?: string };

type DossierBenefit = {
  type: string;
  title: string;
  description: string;
  value: string | null;
  requiredShares: number | null;
  sourceUrl: string | null;
};

type DossierFaq = { question: string; answer: string };

type Dossier = {
  slug: string;
  name: string;
  description?: string;
  sector: string;
  stockIndex: string;
  ticker?: string;
  website?: string;
  clubName?: string;
  clubUrl?: string;
  minShares: number | null;
  lastVerifiedAt?: string;
  benefits: DossierBenefit[];
  faqs: DossierFaq[];
  sources?: SourceEntry[];
};

function loadDossiers(): Dossier[] {
  const dir = path.resolve(process.cwd(), "prisma/seed-data/companies");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    return JSON.parse(raw) as Dossier;
  });
}

function renderBenefitDescription(b: DossierBenefit): string {
  // Source link is appended to description via a parenthetical marker
  // so the UI surfaces it without schema change.
  const base = b.description.trim();
  if (b.sourceUrl) return `${base} (Source : ${b.sourceUrl})`;
  return base;
}

function renderBenefitValue(b: DossierBenefit): string | null {
  // Prepend requiredShares when distinct from company minShares.
  if (b.value && b.requiredShares && b.requiredShares > 1) {
    return `${b.value} · ${b.requiredShares} actions`;
  }
  return b.value;
}

function hasField<T extends object>(value: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

async function main() {
  const dossiers = loadDossiers();
  if (dossiers.length === 0) {
    console.log("Aucun dossier JSON trouvé dans prisma/seed-data/companies/.");
    return;
  }

  console.log(`📂 ${dossiers.length} dossier(s) chargé(s).`);

  for (const d of dossiers) {
    const company = await prisma.company.findUnique({
      where: { slug: d.slug },
    });
    if (!company) {
      console.warn(`⚠️  Slug "${d.slug}" inconnu dans la DB, ignoré.`);
      continue;
    }

    await prisma.company.update({
      where: { id: company.id },
      data: {
        name: d.name,
        description: d.description ?? company.description,
        sector: d.sector,
        stockIndex: d.stockIndex,
        ticker: hasField(d, "ticker") ? d.ticker ?? null : company.ticker,
        website: hasField(d, "website") ? d.website ?? null : company.website,
        clubUrl: hasField(d, "clubUrl") ? d.clubUrl ?? null : null,
        minShares: hasField(d, "minShares") ? d.minShares ?? null : null,
      },
    });

    await prisma.benefit.deleteMany({ where: { companyId: company.id } });
    if (d.benefits.length > 0) {
      await prisma.benefit.createMany({
        data: d.benefits.map((b) => ({
          companyId: company.id,
          type: normalizeType(b.type),
          title: b.title,
          description: renderBenefitDescription(b),
          value: renderBenefitValue(b),
        })),
      });
    }

    if (d.faqs && d.faqs.length > 0) {
      await prisma.faq.deleteMany({ where: { companyId: company.id } });
      await prisma.faq.createMany({
        data: d.faqs.map((f, i) => ({
          companyId: company.id,
          question: f.question,
          answer: f.answer,
          order: i,
        })),
      });
    }

    console.log(
      `✅ ${d.name} mis à jour : ${d.benefits.length} benefits, ${d.faqs.length} FAQs`
    );
  }

  console.log("\n🎉 Mise à jour terminée.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
