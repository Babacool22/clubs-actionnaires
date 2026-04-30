"use client";

import { useState, useMemo } from "react";
import CompanyCard from "./CompanyCard";
import type { Company, Benefit } from "@/app/generated/prisma/client";

type CompanyWithBenefits = Company & { benefits: Benefit[] };

const BENEFIT_TYPES = [
  { value: "reduction", label: "REDUCTION" },
  { value: "cadeau", label: "CADEAU" },
  { value: "evenement", label: "EVENEMENT" },
  { value: "service", label: "SERVICE" },
];

export default function CatalogueClient({
  companies,
  sectors,
  indexes,
}: {
  companies: CompanyWithBenefits[];
  sectors: string[];
  indexes: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [selectedBenefitType, setSelectedBenefitType] = useState("");

  const filtered = useMemo(() => {
    return companies.filter((company) => {
      const matchSearch =
        search.trim() === "" ||
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.sector.toLowerCase().includes(search.toLowerCase()) ||
        company.description.toLowerCase().includes(search.toLowerCase());

      const matchSector =
        selectedSector === "" || company.sector === selectedSector;
      const matchIndex =
        selectedIndex === "" || company.stockIndex === selectedIndex;
      const matchBenefit =
        selectedBenefitType === "" ||
        company.benefits.some((b) => b.type === selectedBenefitType);

      return matchSearch && matchSector && matchIndex && matchBenefit;
    });
  }, [companies, search, selectedSector, selectedIndex, selectedBenefitType]);

  const hasFilters =
    search || selectedSector || selectedIndex || selectedBenefitType;

  function resetFilters() {
    setSearch("");
    setSelectedSector("");
    setSelectedIndex("");
    setSelectedBenefitType("");
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-[var(--space-lg)]">
        <input
          type="text"
          placeholder="RECHERCHER..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-[var(--space-md)] py-[var(--space-md)] bg-surface border-b border-border-visible text-text-primary font-[family-name:var(--font-data)] text-[13px] tracking-[0.04em] placeholder:text-text-disabled focus:outline-none focus:border-text-primary transition-colors duration-[var(--duration-micro)]"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-[var(--space-md)] mb-[var(--space-xl)]">
        {/* Index */}
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="bg-transparent border border-border-visible px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary cursor-pointer focus:outline-none focus:border-text-primary transition-colors duration-[var(--duration-micro)] appearance-none"
        >
          <option value="">TOUS LES INDICES</option>
          {indexes.map((idx) => (
            <option key={idx} value={idx}>
              {idx}
            </option>
          ))}
        </select>

        {/* Sector */}
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="bg-transparent border border-border-visible px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] uppercase text-text-secondary cursor-pointer focus:outline-none focus:border-text-primary transition-colors duration-[var(--duration-micro)] appearance-none"
        >
          <option value="">TOUS LES SECTEURS</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Benefit type toggles */}
        {BENEFIT_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() =>
              setSelectedBenefitType(
                selectedBenefitType === type.value ? "" : type.value
              )
            }
            className={`px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] border transition-colors duration-[var(--duration-micro)] ${
              selectedBenefitType === type.value
                ? "bg-text-display text-black border-text-display"
                : "bg-transparent text-text-secondary border-border-visible hover:border-text-secondary"
            }`}
          >
            {type.label}
          </button>
        ))}

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="px-[var(--space-md)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-accent border border-accent hover:bg-accent-subtle transition-colors duration-[var(--duration-micro)]"
          >
            REINITIALISER
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-[var(--space-lg)]">
        <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled">
          <span className="text-text-display font-bold">{filtered.length}</span>{" "}
          RESULTAT{filtered.length !== 1 ? "S" : ""}
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="py-[var(--space-4xl)] text-center">
          <p className="font-[family-name:var(--font-display)] text-[36px] text-text-display tracking-[-0.02em] mb-[var(--space-md)]">
            0
          </p>
          <p className="font-[family-name:var(--font-data)] text-[11px] tracking-[0.08em] text-text-disabled mb-[var(--space-xl)]">
            AUCUN RESULTAT
          </p>
          <button
            onClick={resetFilters}
            className="px-[var(--space-lg)] py-[var(--space-sm)] font-[family-name:var(--font-data)] text-[13px] tracking-[0.08em] uppercase bg-text-display text-black hover:opacity-80 transition-opacity duration-[var(--duration-micro)]"
          >
            REINITIALISER
          </button>
        </div>
      )}
    </div>
  );
}
