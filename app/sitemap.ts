import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BASE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companies = await prisma.company.findMany({
    select: { slug: true },
    orderBy: { name: "asc" },
  });

  const companyUrls: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${BASE_URL}/entreprises/${company.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...companyUrls,
  ];
}
