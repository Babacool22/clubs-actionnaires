import fs from "node:fs";
import path from "node:path";
import {
  companyEnglishTranslations,
  type CompanyEnglishTranslation,
} from "../lib/company-translations";

type SourceCompany = {
  slug: string;
  benefits: unknown[];
  faqs: unknown[];
};

const sourceDirectory = path.join(
  process.cwd(),
  "prisma",
  "seed-data",
  "companies"
);

const sourceCompanies = fs
  .readdirSync(sourceDirectory)
  .filter((fileName) => fileName.endsWith(".json"))
  .map((fileName) => {
    const filePath = path.join(sourceDirectory, fileName);
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as SourceCompany;
  })
  .sort((left, right) => left.slug.localeCompare(right.slug));

const errors: string[] = [];

function requiredText(
  slug: string,
  field: string,
  value: string | undefined
) {
  if (!value?.trim()) {
    errors.push(`${slug}: missing ${field}`);
  }
}

function validateTranslation(
  source: SourceCompany,
  translation: CompanyEnglishTranslation | undefined
) {
  if (!translation) {
    errors.push(`${source.slug}: missing translation`);
    return;
  }

  if (translation.slug !== source.slug) {
    errors.push(
      `${source.slug}: translation slug is ${translation.slug || "(empty)"}`
    );
  }
  if (translation.benefits.length !== source.benefits.length) {
    errors.push(
      `${source.slug}: ${translation.benefits.length}/${source.benefits.length} benefits`
    );
  }
  if (translation.faqs.length !== source.faqs.length) {
    errors.push(
      `${source.slug}: ${translation.faqs.length}/${source.faqs.length} FAQs`
    );
  }

  requiredText(source.slug, "name", translation.name);
  requiredText(source.slug, "sector", translation.sector);
  requiredText(source.slug, "description", translation.description);
  requiredText(source.slug, "seoTitle", translation.seoTitle);
  requiredText(source.slug, "seoDescription", translation.seoDescription);
  requiredText(
    source.slug,
    "registrationProcedure",
    translation.registrationProcedure
  );
  requiredText(source.slug, "proofRequirement", translation.proofRequirement);
  requiredText(source.slug, "holdingMode", translation.holdingMode);
  requiredText(source.slug, "membershipCost", translation.membershipCost);

  if (translation.seoTitle.length > 60) {
    errors.push(`${source.slug}: seoTitle exceeds 60 characters`);
  }
  if (translation.seoDescription.length > 158) {
    errors.push(`${source.slug}: seoDescription exceeds 158 characters`);
  }

  translation.benefits.forEach((benefit, index) => {
    requiredText(source.slug, `benefits[${index}].title`, benefit.title);
    requiredText(
      source.slug,
      `benefits[${index}].description`,
      benefit.description
    );
  });
  translation.faqs.forEach((faq, index) => {
    requiredText(source.slug, `faqs[${index}].question`, faq.question);
    requiredText(source.slug, `faqs[${index}].answer`, faq.answer);
  });
}

for (const company of sourceCompanies) {
  validateTranslation(company, companyEnglishTranslations[company.slug]);
}

const sourceSlugs = new Set(sourceCompanies.map((company) => company.slug));
for (const slug of Object.keys(companyEnglishTranslations)) {
  if (!sourceSlugs.has(slug)) {
    errors.push(`${slug}: translation has no matching source company`);
  }
}

const sourceBenefitCount = sourceCompanies.reduce(
  (total, company) => total + company.benefits.length,
  0
);
const sourceFaqCount = sourceCompanies.reduce(
  (total, company) => total + company.faqs.length,
  0
);

if (errors.length > 0) {
  console.error(`English translation validation failed (${errors.length}):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `English translations verified: ${sourceCompanies.length} companies, ${sourceBenefitCount} benefits, ${sourceFaqCount} FAQs.`
);
