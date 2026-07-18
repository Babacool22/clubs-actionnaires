import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BASE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await prisma.company.findMany({
    select: {
      slug: true,
      updatedAt: true,
      _count: { select: { benefits: true } },
    },
    orderBy: { name: "asc" },
  });

  const companyUrls: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${BASE_URL}/entreprises/${company.slug}`,
    lastModified: company.updatedAt,
    changeFrequency: "monthly",
    priority: company._count.benefits > 0 ? 0.8 : 0.55,
  }));

  const latestUpdate =
    companies
      .map((company) => company.updatedAt)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date();

  const legalLastMod = new Date("2026-03-01");

  return [
    {
      url: BASE_URL,
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: legalLastMod,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politique-de-confidentialite`,
      lastModified: legalLastMod,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...companyUrls,
  ];
}
