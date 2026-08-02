type CompanyWithBenefits = {
  name: string;
  benefits: readonly unknown[];
};

const companyNameCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export function sortCompaniesForCatalogue<T extends CompanyWithBenefits>(
  companies: T[]
) {
  return [...companies].sort((left, right) => {
    const leftHasBenefits = left.benefits.length > 0;
    const rightHasBenefits = right.benefits.length > 0;

    if (leftHasBenefits !== rightHasBenefits) {
      return leftHasBenefits ? -1 : 1;
    }

    return companyNameCollator.compare(left.name, right.name);
  });
}
