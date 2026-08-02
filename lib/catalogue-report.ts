import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type CatalogueReportCompany = {
  slug: string;
  name: string;
  sector: string;
  stockIndex: string;
  ticker: string | null;
  minShares: number | null;
  website: string | null;
  clubUrl: string | null;
  lastVerifiedAt: Date | null;
  updatedAt: Date;
  _count: {
    benefits: number;
  };
};

export type CatalogueSectorStat = {
  name: string;
  companyCount: number;
  activeCompanyCount: number;
  benefitCount: number;
};

export type CatalogueReportSummary = {
  companyCount: number;
  activeCompanyCount: number;
  benefitCount: number;
  sectorCount: number;
  oneShareCompanyCount: number;
  medianMinimumShares: number | null;
  lastUpdated: Date;
  sectors: CatalogueSectorStat[];
};

export const getCatalogueReportCompanies = cache(async () => {
  return prisma.company.findMany({
    select: {
      slug: true,
      name: true,
      sector: true,
      stockIndex: true,
      ticker: true,
      minShares: true,
      website: true,
      clubUrl: true,
      lastVerifiedAt: true,
      updatedAt: true,
      _count: {
        select: {
          benefits: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
});

export function buildCatalogueReportSummary(
  companies: CatalogueReportCompany[],
  getSectorName: (company: CatalogueReportCompany) => string = (company) =>
    company.sector
): CatalogueReportSummary {
  const sectorMap = new Map<string, CatalogueSectorStat>();
  const minimumShares = companies
    .map((company) => company.minShares)
    .filter((value): value is number => value !== null && value > 0)
    .sort((a, b) => a - b);
  let activeCompanyCount = 0;
  let benefitCount = 0;
  let oneShareCompanyCount = 0;
  let lastUpdated = new Date("2026-01-01T00:00:00.000Z");

  for (const company of companies) {
    const sectorName = getSectorName(company);
    const current = sectorMap.get(sectorName) ?? {
      name: sectorName,
      companyCount: 0,
      activeCompanyCount: 0,
      benefitCount: 0,
    };

    current.companyCount += 1;
    current.benefitCount += company._count.benefits;
    benefitCount += company._count.benefits;
    if (company._count.benefits > 0) {
      current.activeCompanyCount += 1;
      activeCompanyCount += 1;
    }
    if (company.minShares === 1) oneShareCompanyCount += 1;

    const companyUpdatedAt = company.lastVerifiedAt ?? company.updatedAt;
    if (companyUpdatedAt > lastUpdated) lastUpdated = companyUpdatedAt;

    sectorMap.set(sectorName, current);
  }

  const middle = Math.floor(minimumShares.length / 2);
  const medianMinimumShares =
    minimumShares.length === 0
      ? null
      : minimumShares.length % 2 === 0
        ? Math.round((minimumShares[middle - 1] + minimumShares[middle]) / 2)
        : minimumShares[middle];

  return {
    companyCount: companies.length,
    activeCompanyCount,
    benefitCount,
    sectorCount: sectorMap.size,
    oneShareCompanyCount,
    medianMinimumShares,
    lastUpdated,
    sectors: [...sectorMap.values()].sort(
      (a, b) =>
        b.benefitCount - a.benefitCount ||
        b.companyCount - a.companyCount ||
        a.name.localeCompare(b.name)
    ),
  };
}
