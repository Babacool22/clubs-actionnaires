import { getCatalogueReportCompanies } from "@/lib/catalogue-report";
import {
  getEnglishCompanyTranslation,
  hasEnglishCompanyTranslation,
} from "@/lib/company-translations";
import { BASE_URL } from "@/lib/seo";

export const dynamic = "force-static";

function escapeCsv(value: string | number | null) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET() {
  const companies = await getCatalogueReportCompanies();
  const headers = [
    "company_name",
    "slug",
    "sector_fr",
    "sector_en",
    "stock_index",
    "ticker",
    "minimum_shares",
    "benefits_count",
    "last_verified_at",
    "official_website",
    "shareholder_club_url",
    "french_page",
    "english_page",
  ];
  const rows = companies.map((company) => {
    const translation = getEnglishCompanyTranslation(company.slug);
    const lastVerifiedAt = company.lastVerifiedAt ?? company.updatedAt;

    return [
      company.name,
      company.slug,
      company.sector,
      translation?.sector ?? "",
      company.stockIndex,
      company.ticker,
      company.minShares,
      company._count.benefits,
      lastVerifiedAt.toISOString().slice(0, 10),
      company.website,
      company.clubUrl,
      `${BASE_URL}/entreprises/${company.slug}`,
      hasEnglishCompanyTranslation(company.slug)
        ? `${BASE_URL}/en/companies/${company.slug}`
        : "",
    ];
  });
  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");

  return new Response(`\uFEFF${csv}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="clubs-actionnaires-dataset.csv"',
      "Cache-Control":
        "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
